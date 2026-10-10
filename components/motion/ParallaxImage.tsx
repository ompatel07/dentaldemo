"use client";

import Image from "next/image";
import { useRef } from "react";
import { EASE, gsap, registerGsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { prefersReducedMotion } from "@/lib/motion";
import { cx, onNearViewport } from "@/lib/utils";
import type { ImageSlot } from "@/content/types";

type Props = {
  image: ImageSlot;
  className?: string;
  /** Rounded mask radius token; "mask" is the editorial default. */
  radius?: "none" | "sm" | "md" | "lg" | "mask";
  /** Vertical drift of the image inside its mask, in percent of height. */
  amount?: number;
  /** Extra scale so the drift never exposes an edge. */
  overscan?: number;
  priority?: boolean;
  sizes?: string;
  /** Reveal style as the mask enters the viewport. */
  reveal?: "none" | "mask" | "circle";
  /** Ratio enforced by the mask, e.g. "4/5". Omit to use intrinsic size. */
  ratio?: string;
};

const RADIUS: Record<NonNullable<Props["radius"]>, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  mask: "rounded-mask",
};

/**
 * An image that drifts inside a fixed mask as the page scrolls, optionally
 * unmasking on entry. The mask holds layout, the image is overscanned, so the
 * drift never shows a gap and never shifts anything around it.
 */
export function ParallaxImage({
  image,
  className,
  radius = "mask",
  amount = 10,
  overscan = 1.14,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  reveal = "mask",
  ratio,
}: Props) {
  const maskRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const mask = maskRef.current;
    const inner = imgRef.current;
    if (!mask || !inner) return;

    registerGsap();
    const reduced = prefersReducedMotion();

    let ctx: gsap.Context | null = null;

    const build = () => {
      ctx = gsap.context(() => {
        if (reveal !== "none") {
          const from =
            reveal === "circle"
              ? { clipPath: "circle(0% at 50% 50%)" }
              : { clipPath: "inset(0% 0% 100% 0%)" };
          const to =
            reveal === "circle"
              ? { clipPath: "circle(75% at 50% 50%)" }
              : { clipPath: "inset(0% 0% 0% 0%)" };

          gsap.set(mask, from);
          gsap.to(mask, {
            ...to,
            duration: reduced ? 0.4 : 1.2,
            ease: EASE.reveal,
            scrollTrigger: { trigger: mask, start: "top 88%", once: true },
          });
        }

        if (reduced || amount === 0) return;

        gsap.fromTo(
          inner,
          { yPercent: -amount / 2 },
          {
            yPercent: amount / 2,
            ease: "none",
            scrollTrigger: {
              trigger: mask,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      }, mask);
    };

    const stop = onNearViewport(mask, build, "600px 0px");

    return () => {
      stop();
      ctx?.revert();
    };
  }, [amount, reveal]);

  return (
    <div
      ref={maskRef}
      className={cx(
        "relative overflow-hidden bg-surface",
        RADIUS[radius],
        className,
      )}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <div
        ref={imgRef}
        className="absolute inset-0 will-change-transform"
        style={{ scale: String(overscan) }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          priority={priority}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
