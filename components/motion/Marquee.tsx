"use client";

import { useRef, type ReactNode } from "react";
import { ScrollTrigger, gsap, registerGsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { cx } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Base speed in px per second. */
  speed?: number;
  /** Baseline travel direction: -1 leftward, 1 rightward. */
  direction?: 1 | -1;
  /** Peak multiplier applied at high scroll velocity. */
  maxBoost?: number;
  /**
   * Copies of `children` laid end to end. One copy must be at least as wide
   * as the viewport for the wrap to stay seamless; three is ample for a row
   * of wordmarks.
   */
  repeat?: number;
  /** The belt is decorative by default; sections expose a real list instead. */
  ariaHidden?: boolean;
};

/**
 * Infinite marquee. One copy's width is measured, then the whole belt is
 * tweened by that distance with a wrap modifier - so the loop is seamless in
 * either direction and nothing is cloned or re-measured per frame.
 *
 * Scroll velocity pushes the belt faster; scroll direction flips it. Both ride
 * one ScrollTrigger and ease back to walking pace when scrolling stops.
 * Reduced motion leaves a static row, clipped - never a scrollbar, which is
 * what the first version showed and what made the band look broken.
 */
export function Marquee({
  children,
  className,
  speed = 60,
  direction = -1,
  maxBoost = 5,
  repeat = 3,
  ariaHidden = true,
}: Props) {
  const beltRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const belt = beltRef.current;
    if (!belt) return;
    if (prefersReducedMotion()) return;

    registerGsap();

    const ctx = gsap.context(() => {
      const copy = belt.firstElementChild as HTMLElement | null;
      if (!copy) return;

      let width = copy.offsetWidth;
      if (width === 0) return;

      // The tween always travels leftward; timeScale sign chooses what the
      // viewer sees, so a rightward marquee simply starts at -1.
      const baseSign = direction === -1 ? 1 : -1;

      const tween = gsap.to(belt, {
        x: -width,
        duration: width / speed,
        ease: "none",
        repeat: -1,
        modifiers: { x: gsap.utils.unitize(gsap.utils.wrap(-width, 0)) },
      });
      tween.timeScale(baseSign);

      let idle: number | undefined;

      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          const sign = baseSign * (self.direction === 1 ? 1 : -1);
          const boost = gsap.utils.clamp(1, maxBoost, 1 + Math.abs(self.getVelocity()) / 400);
          gsap.to(tween, { timeScale: sign * boost, duration: 0.35, overwrite: true });

          window.clearTimeout(idle);
          idle = window.setTimeout(() => {
            gsap.to(tween, { timeScale: sign, duration: 1.2, overwrite: true });
          }, 160);
        },
      });

      const ro = new ResizeObserver(() => {
        const next = copy.offsetWidth;
        if (!next || Math.abs(next - width) < 1) return;
        width = next;
        tween.vars.x = -width;
        tween.vars.modifiers = { x: gsap.utils.unitize(gsap.utils.wrap(-width, 0)) };
        tween.duration(width / speed);
        tween.invalidate();
      });
      ro.observe(copy);

      return () => {
        window.clearTimeout(idle);
        ro.disconnect();
        st.kill();
      };
    }, belt);

    return () => ctx.revert();
  }, [direction, maxBoost, speed]);

  return (
    <div
      className={cx("relative w-full overflow-hidden", className)}
      aria-hidden={ariaHidden || undefined}
    >
      <div ref={beltRef} className="flex w-max will-change-transform">
        {Array.from({ length: Math.max(2, repeat) }).map((_, i) => (
          <div key={i} className="flex shrink-0 items-center">
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
