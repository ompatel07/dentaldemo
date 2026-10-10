"use client";

import { useRef, type ReactNode } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Behaviour-only wrapper for the stacking cards.
 *
 * It takes its children as a prop, which is the point: the cards themselves
 * stay a server component and never ship to the browser as React work. This
 * file is the only part of that section that hydrates, and all it does is
 * find `[data-tech-card]` and scrub two properties.
 */
export function StickyStack({ children, className }: { children: ReactNode; className?: string }) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerGsap();
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      if (prefersReducedMotion()) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-tech-card]", root);

      const tweens = cards.slice(0, -1).map((card, i) => {
        const inner = card.querySelector<HTMLElement>("[data-tech-inner]");
        const next = cards[i + 1];
        if (!inner || !next) return null;

        return gsap.to(inner, {
          scale: 0.95,
          opacity: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: next,
            // Starts late on purpose: the card being read must not dim
            // until the next one is properly on top of it.
            start: "top 55%",
            end: "top 12%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
      });

      return () => {
        tweens.forEach((t) => {
          t?.scrollTrigger?.kill();
          t?.kill();
        });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
