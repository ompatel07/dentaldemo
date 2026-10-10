"use client";

import { useRef, type ReactNode } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { prefersReducedMotion } from "@/lib/motion";
import { cx } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Scroll distance multiplier. 1 = exactly the track's overflow width. */
  distance?: number;
  /** Extra classes for the moving track. */
  trackClassName?: string;
/** Min viewport width for pinning. Must match the `max-md:` fallback
   * breakpoint below, or a viewport exactly on the boundary gets neither. */
  minWidth?: number;
};

/**
 * Pinned horizontal scroll. The section pins and the track translates by its
 * own overflow width, so the mapping between wheel distance and travel is
 * exact and `end` survives resize via invalidateOnRefresh.
 *
 * Below `minWidth` - and whenever reduced motion is set - nothing pins. The
 * track becomes a native scroll-snap carousel, which is what phones actually
 * want and what keeps pinning from janking on mobile.
 */
export function PinnedHorizontal({
  children,
  className,
  distance = 1,
  trackClassName,
  minWidth = 768,
}: Props) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    registerGsap();

    const mm = gsap.matchMedia();

    mm.add(
      {
        pin: `(min-width: ${minWidth}px)`,
      },
      (context) => {
        if (!context.conditions?.pin || prefersReducedMotion()) return;

        const overflow = () => Math.max(0, track.scrollWidth - window.innerWidth);
        if (overflow() <= 0) return;

        const tween = gsap.to(track, {
          x: () => -overflow(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + overflow() * distance,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(track, { clearProps: "x" });
        };
      },
    );

    return () => mm.revert();
  }, [distance, minWidth]);

  return (
    <div ref={sectionRef} className={cx("relative", className)} data-pinned-horizontal>
      <div
        ref={trackRef}
        className={cx(
          // No align-items here on purpose. Setting one in the base and
          // another via trackClassName puts two align-items utilities on
          // the same element, and the winner is decided by Tailwind's own
          // output order rather than by the caller.
          "flex",
          // Mobile and reduced-motion fallback: real swipe, real snap.
          "max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:overscroll-x-contain",
          "reduce:snap-x reduce:snap-mandatory reduce:overflow-x-auto",
          trackClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
