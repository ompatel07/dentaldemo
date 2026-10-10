"use client";

import { useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { prefersReducedMotion } from "@/lib/motion";
import { onEnterViewport } from "@/lib/utils";

type Props = {
  value: number;
  /** Where the count starts. Defaults to 0 for entry counters. */
  from?: number;
  duration?: number;
  decimals?: number;
  /** Thousands grouping via the site locale. */
  group?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** "scroll" counts up on entry; "value" re-tweens whenever value changes. */
  trigger?: "scroll" | "value";
  locale?: string;
};

/**
 * Number tween. Used for the review aggregate, the journey step numbers and
 * the EMI figure - which is why it also supports re-tweening from its current
 * displayed value whenever `value` changes.
 *
 * The accessible value is always the final number: the element carries
 * aria-live="off" and a sr-only exact figure, so assistive tech never reads a
 * stream of intermediate digits.
 */
export function CountUp({
  value,
  from = 0,
  duration = 1.4,
  decimals = 0,
  group = true,
  prefix = "",
  suffix = "",
  className,
  trigger = "scroll",
  locale = "en-IN",
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const current = useRef(from);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerGsap();

    const format = (n: number) => {
      const fixed = Number(n.toFixed(decimals));
      const text = group
        ? new Intl.NumberFormat(locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }).format(fixed)
        : fixed.toFixed(decimals);
      return prefix + text + suffix;
    };

    if (prefersReducedMotion()) {
      current.current = value;
      el.textContent = format(value);
      return;
    }

    const state = { n: trigger === "value" ? current.current : from };
    el.textContent = format(state.n);

    const tween = gsap.to(state, {
      n: value,
      duration,
      ease: "power2.out",
      paused: trigger === "scroll",
      onUpdate: () => {
        current.current = state.n;
        el.textContent = format(state.n);
      },
    });

    // Entry counters start the moment any part of them is on screen. With a
    // margin, a counter resting in the last tenth of the viewport - the hero
    // stats on a phone - sat at zero until somebody scrolled.
    const unobserve = trigger === "scroll" ? onEnterViewport(el, () => tween.play(), "0px") : () => {};

    return () => {
      unobserve();
      tween.kill();
    };
  }, [decimals, duration, from, group, locale, prefix, suffix, trigger, value]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true" />
      <span className="sr-only">
        {prefix}
        {value.toFixed(decimals)}
        {suffix}
      </span>
    </span>
  );
}
