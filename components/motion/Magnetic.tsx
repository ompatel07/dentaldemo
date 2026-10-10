"use client";

import { useRef, type ReactNode } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { prefersReducedMotion } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  /** How far the element leans toward the pointer, in px. */
  strength?: number;
  /** Inner content leans further than the shell for a parallax feel. */
  innerStrength?: number;
  scale?: number;
  disabled?: boolean;
};

/**
 * Magnetic hover. The element leans toward the pointer with a quickTo tween
 * (one interpolator, no tween churn on every mousemove) and springs back on
 * leave. Pointer-type and motion preference are read from the media query
 * rather than from React state so there is nothing to re-render.
 */
export function Magnetic({
  children,
  className,
  strength = 14,
  innerStrength = 6,
  scale = 1,
  disabled = false,
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = prefersReducedMotion();
    if (!fine || reduced) return;

    registerGsap();

    const inner = el.firstElementChild as HTMLElement | null;
    const tune = { duration: 0.5, ease: "power3.out" } as const;

    const xTo = gsap.quickTo(el, "x", tune);
    const yTo = gsap.quickTo(el, "y", tune);
    const sTo = gsap.quickTo(el, "scale", { duration: 0.4, ease: "power3.out" });
    const ixTo = inner ? gsap.quickTo(inner, "x", tune) : null;
    const iyTo = inner ? gsap.quickTo(inner, "y", tune) : null;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      // -1..1 from the element's centre.
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      xTo(nx * strength * 2);
      yTo(ny * strength * 2);
      ixTo?.(nx * innerStrength * 2);
      iyTo?.(ny * innerStrength * 2);
    };

    const onEnter = () => sTo(scale);

    const onLeave = () => {
      xTo(0);
      yTo(0);
      sTo(1);
      ixTo?.(0);
      iyTo?.(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf([el, inner].filter(Boolean) as Element[]);
      gsap.set(el, { clearProps: "transform" });
      if (inner) gsap.set(inner, { clearProps: "transform" });
    };
  }, [disabled, innerStrength, scale, strength]);

  return (
    <span ref={ref} className={className} style={{ display: "inline-flex", willChange: "transform" }}>
      {children}
    </span>
  );
}
