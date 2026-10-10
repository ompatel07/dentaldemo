"use client";

import { useRef, useState } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { prefersReducedMotion } from "@/lib/motion";

type CursorState = {
  mode: "default" | "label" | "hidden";
  label: string;
};

/**
 * Custom cursor: a small dot that expands into a labelled disc over anything
 * carrying `data-cursor`.
 *
 *   <a data-cursor="view">            -> disc labelled with the default copy
 *   <div data-cursor-label="Drag">    -> disc with custom label
 *   <input data-cursor="hidden">      -> native caret restored
 *
 * Mounted once from the shell. It opts out entirely on touch devices and
 * under reduced motion, where it would be noise rather than craft, and it
 * only hides the native cursor once it is actually running - so a JS failure
 * can never leave the page with no pointer at all.
 */
export function CursorFollower() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<CursorState>({ mode: "default", label: "" });

  useIsomorphicLayoutEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches || prefersReducedMotion()) return;

    registerGsap();

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    gsap.set(dot, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const xTo = gsap.quickTo(dot, "x", { duration: 0.32, ease: "power3.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.32, ease: "power3.out" });

    let visible = false;

    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.set(dot, { x: e.clientX, y: e.clientY });
        gsap.to(dot, { autoAlpha: 1, duration: 0.3 });
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const node = e.target as HTMLElement | null;

      // Over a form control the native caret is showing, so the dot steps
      // aside rather than sitting on top of it.
      if (node?.closest("input, textarea, select, [contenteditable='true']")) {
        setState({ mode: "hidden", label: "" });
        return;
      }

      const target = node?.closest<HTMLElement>("[data-cursor], [data-cursor-label]");
      if (!target) {
        setState({ mode: "default", label: "" });
        return;
      }
      const mode = target.dataset.cursor;
      if (mode === "hidden") {
        setState({ mode: "hidden", label: "" });
        return;
      }
      const label = target.dataset.cursorLabel ?? "";
      setState(label ? { mode: "label", label } : { mode: "default", label: "" });
    };

    const onLeaveWindow = () => gsap.to(dot, { autoAlpha: 0, duration: 0.2 });
    const onEnterWindow = () => gsap.to(dot, { autoAlpha: 1, duration: 0.2 });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeaveWindow);
    document.addEventListener("pointerenter", onEnterWindow);

    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeaveWindow);
      document.removeEventListener("pointerenter", onEnterWindow);
      gsap.killTweensOf(dot);
    };
  }, []);

  const labelled = state.mode === "label";

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 hidden mix-blend-difference md:block"
      /* Starts invisible in markup, not just in the effect: until the
         pointer moves there is nowhere sensible to draw it, and a dot
         parked in the top-left corner is the classic custom-cursor tell. */
      style={{ zIndex: "var(--z-cursor)", opacity: 0, visibility: "hidden" }}
    >
      <div
        className="flex items-center justify-center rounded-pill bg-[var(--paper)] text-[var(--ink)] transition-[width,height,opacity] duration-[320ms] ease-[var(--ease-expo)]"
        style={{
          width: labelled ? 84 : 12,
          height: labelled ? 84 : 12,
          opacity: state.mode === "hidden" ? 0 : 1,
        }}
      >
        <span
          className="label text-[10px] !text-[var(--ink)] transition-opacity duration-200"
          style={{ opacity: labelled ? 1 : 0 }}
        >
          {state.label}
        </span>
      </div>
    </div>
  );
}
