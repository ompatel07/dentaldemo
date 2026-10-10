"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** useLayoutEffect that does not warn during SSR. */
export const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Drives every "fall back to a simple fade" decision in the motion library. */
export function useReducedMotion(): boolean {
  // Reads the one attribute the blocking script wrote, so a component and
  // the stylesheet can never disagree about whether motion is on.
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(document.documentElement.dataset.motion === "reduce"), []);
  return reduced;
}

/** Mouse or trackpad present, so custom cursor and hover effects make sense. */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}

/** Mount flag, for deferring anything that must not run during hydration. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Locks page scroll through Lenis while active is true. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    void import("@/lib/gsap").then(({ lockScroll }) => {
      if (!cancelled) lockScroll();
    });
    return () => {
      cancelled = true;
      void import("@/lib/gsap").then(({ unlockScroll }) => unlockScroll());
    };
  }, [active]);
}

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/** Traps Tab inside a container and restores focus on close. Modals and menu. */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(active: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const node = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);

    focusables()[0]?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    node.addEventListener("keydown", onKeyDown);
    return () => {
      node.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [active]);

  return ref;
}

/** Escape-to-close, shared by the menu overlay, modals and the doctor drawer. */
export function useEscapeKey(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onEscape]);
}
