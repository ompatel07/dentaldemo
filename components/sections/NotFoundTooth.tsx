"use client";

import { useRef } from "react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { EASE, gsap, registerExtra } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { ToothMark } from "@/components/ui/ToothMark";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * "4 [tooth] 4" - the tooth stands in for the zero, draws itself, then
 * drifts gently out of its socket and hangs there, turning very slowly.
 *
 * It is the one joke on the site, so it still obeys the house rules: the
 * mark draws rather than pops, the drift uses the reveal curve rather than
 * a bounce, and under reduced motion it simply sits there, complete.
 */
export function NotFoundTooth() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerExtra(DrawSVGPlugin);

    const strokes = root.querySelectorAll("[data-draw]");
    const tooth = root.querySelector("[data-tooth]");
    const digits = root.querySelectorAll("[data-digit]");
    const socket = root.querySelector("[data-socket]");

    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(strokes, { drawSVG: "100%" });
        gsap.set([digits, tooth, socket], { autoAlpha: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ delay: 0.25 });

      tl.set(strokes, { drawSVG: "0%" })
        .set(digits, { yPercent: 115, autoAlpha: 1 })
        .set(tooth, { autoAlpha: 0, y: -18 })
        .set(socket, { autoAlpha: 0 })
        .to(digits, { yPercent: 0, duration: 1, ease: EASE.reveal, stagger: 0.08 })
        .to(tooth, { autoAlpha: 1, duration: 0.3 }, "-=0.5")
        .to(strokes, { drawSVG: "100%", duration: 1, ease: EASE.reveal, stagger: 0.1 }, "<")
        .to(socket, { autoAlpha: 1, duration: 0.5 }, "-=0.3")
        // The extraction: it slides out of the socket and settles below it.
        .to(tooth, { y: 26, rotate: 7, duration: 1.1, ease: EASE.reveal }, "+=0.35")
        .to(
          tooth,
          { y: 32, rotate: -5, duration: 4.5, ease: "sine.inOut", repeat: -1, yoyo: true },
          ">",
        );

      return () => tl.kill();
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="flex items-center gap-[clamp(0.5rem,1.5vw,1.5rem)]">
      <span className="block overflow-hidden">
        <span data-digit className="display block text-[clamp(5rem,18vw,16rem)] leading-[0.85]">
          4
        </span>
      </span>

      <span className="relative block" aria-hidden="true">
        {/* The empty socket the tooth leaves behind. */}
        <span
          data-socket
          className="absolute left-1/2 top-[18%] block h-[18%] w-[52%] -translate-x-1/2 rounded-pill border border-dashed border-line-strong opacity-0"
        />
        <span data-tooth className="block text-accent">
          <ToothMark className="h-[clamp(5rem,18vw,16rem)] w-auto" draw strokeWidth={1} />
        </span>
      </span>

      <span className="block overflow-hidden">
        <span data-digit className="display block text-[clamp(5rem,18vw,16rem)] leading-[0.85]">
          4
        </span>
      </span>

      <span className="sr-only">404 &mdash; page not found</span>
    </div>
  );
}
