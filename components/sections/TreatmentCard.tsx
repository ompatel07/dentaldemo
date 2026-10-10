"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";
import { TransitionLink } from "@/components/shell/PageTransition";
import { fromPrice } from "@/lib/format";
import type { Treatment } from "@/content/types";

/**
 * One treatment in the rail.
 *
 * The photograph is sized by viewport HEIGHT, not by an aspect ratio. The
 * rail pins to a full-height viewport, and on a short laptop window a 4:5
 * card is simply taller than the screen - the caption and price ended up
 * below the fold, under the dock.
 *
 * The image is overscanned and leans toward the pointer: one quickTo per
 * axis, created once. The whole card is a single link, so a keyboard user
 * gets one stop per destination.
 */
export function TreatmentCard({ treatment }: { treatment: Treatment }) {
  const cardRef = useRef<HTMLElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const card = cardRef.current;
    const img = imgRef.current;
    if (!card || !img) return;
    if (!hasFinePointer() || prefersReducedMotion()) return;

    registerGsap();

    const tune = { duration: 0.8, ease: "power3.out" } as const;
    const xTo = gsap.quickTo(img, "xPercent", tune);
    const yTo = gsap.quickTo(img, "yPercent", tune);
    const sTo = gsap.quickTo(img, "scale", { duration: 0.7, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      xTo(((e.clientX - r.left) / r.width - 0.5) * -5);
      yTo(((e.clientY - r.top) / r.height - 0.5) * -5);
    };
    const onEnter = () => sTo(1.08);
    const onLeave = () => {
      xTo(0);
      yTo(0);
      sTo(1);
    };

    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointerleave", onLeave);

    return () => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(img);
    };
  }, []);

  return (
    <article ref={cardRef} className="group/card w-[76vw] shrink-0 snap-start sm:w-[44vw] lg:w-[clamp(280px,21vw,360px)]">
      <TransitionLink href={`/treatments/${treatment.slug}`} className="block" data-cursor-label="View">
        <div className="relative h-[min(50svh,440px)] overflow-hidden rounded-[var(--r-lg)] bg-surface">
          <div ref={imgRef} className="absolute -inset-[5%] will-change-transform">
            <Image
              src={treatment.image.src}
              alt={treatment.image.alt}
              fill
              sizes="(max-width: 640px) 74vw, (max-width: 1024px) 44vw, 22vw"
              className="object-cover"
              loading="lazy"
            />
          </div>

          <span className="absolute left-3 top-3 grid h-8 min-w-8 place-items-center rounded-pill bg-[var(--paper)] px-2 font-mono text-xs font-medium text-[var(--ink)]">
            {treatment.chapter}
          </span>

          <span className="absolute bottom-3 right-3 grid h-11 w-11 translate-y-2 place-items-center rounded-pill bg-[var(--coral)] text-[var(--ink)] opacity-0 transition-all duration-500 ease-[var(--ease-expo)] group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-visible/card:opacity-100">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M4 12 12 4M6 4h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="display text-[clamp(1.25rem,1.6vw,1.6rem)]">{treatment.name}</h3>
          <p className="whitespace-nowrap text-sm font-medium text-accent">{fromPrice(treatment.priceFrom)}</p>
        </div>

        {/* Two lines reserved, so every card in the rail is the same height. */}
        <p className="mt-1.5 line-clamp-2 min-h-[2.75em] text-sm text-muted">{treatment.tagline}</p>
        <p className="label mt-3">{treatment.sessions}</p>
      </TransitionLink>
    </article>
  );
}
