"use client";

import { useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";

/**
 * A one-pixel gold line across the top of the page, scrubbed to document
 * progress. Decorative - the page already has a scrollbar - so it is hidden
 * from assistive technology.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    registerGsap();

    const ctx = gsap.context(() => {
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
      gsap.to(bar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 h-[2px]"
      style={{ zIndex: "calc(var(--z-nav) + 1)" }}
    >
      <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-[var(--coral)]" />
    </div>
  );
}
