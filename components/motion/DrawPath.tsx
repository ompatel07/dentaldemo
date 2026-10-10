"use client";

import { useRef, type ReactNode } from "react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { EASE, gsap, registerExtra } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { cx } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Scrub draws with the scroll; false draws once on entry. */
  scrub?: boolean;
  start?: string;
  end?: string;
  duration?: number;
  stagger?: number;
  /** Selector for the strokes to draw, relative to the wrapper. */
  selector?: string;
  /** Fires with 0..1 progress, for syncing text to the drawn line. */
  onProgress?: (progress: number) => void;
};

/**
 * Draws SVG strokes with DrawSVGPlugin, either scrubbed to scroll (the
 * journey path) or once on entry (the preloader mark, chapter rules).
 *
 * Reduced motion renders the artwork fully drawn and does nothing else.
 */
export function DrawPath({
  children,
  className,
  scrub = true,
  start = "top 70%",
  end = "bottom 70%",
  duration = 1.6,
  stagger = 0.1,
  selector = "[data-draw]",
  onProgress,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(onProgress);
  progressRef.current = onProgress;

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerExtra(DrawSVGPlugin);

    const strokes = Array.from(el.querySelectorAll<SVGElement>(selector));
    if (strokes.length === 0) return;

    if (prefersReducedMotion()) {
      gsap.set(strokes, { drawSVG: "100%" });
      progressRef.current?.(1);
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(strokes, { drawSVG: "0%" });

      const tl = gsap.timeline({
        defaults: { ease: scrub ? "none" : EASE.reveal },
        scrollTrigger: {
          trigger: el,
          start,
          end: scrub ? end : start,
          scrub: scrub ? 0.8 : false,
          once: !scrub,
          invalidateOnRefresh: true,
          onUpdate: (self) => progressRef.current?.(self.progress),
        },
      });

      tl.to(strokes, { drawSVG: "100%", duration, stagger });
    }, el);

    return () => ctx.revert();
  }, [duration, end, scrub, selector, stagger, start]);

  return (
    <div ref={ref} className={cx("relative", className)}>
      {children}
    </div>
  );
}
