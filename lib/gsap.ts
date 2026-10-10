/**
 * The one and only place GSAP plugins get registered, and the one and only
 * Lenis instance. Import gsap and plugins from here - never from "gsap"
 * directly - so registration can never be missed or duplicated.
 */
"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/motion";

export { prefersReducedMotion };

export { gsap, ScrollTrigger, SplitText, CustomEase };

/**
 * Plugins used by one or two components each - Flip, Draggable, Inertia,
 * DrawSVG - are NOT imported here. They are imported and registered by the
 * components that need them, so a page that has no draggable carousel never
 * downloads Draggable. Registering everything centrally is tidy right up
 * until every route pays for every feature.
 */
export function registerExtra(...plugins: object[]) {
  if (typeof window === "undefined") return;
  registerGsap();
  gsap.registerPlugin(...plugins);
}

/* ------------------------------------------------------------------ *
 * Easing and duration vocabulary - mirrors styles/tokens.css.
 * Reveals use one signature curve; UI uses expo. Nothing bouncy.
 * ------------------------------------------------------------------ */

export const EASE = {
  /** cubic-bezier(0.76, 0, 0.24, 1) - the house reveal curve. */
  reveal: "aurelle-reveal",
  expo: "expo.out",
  quart: "power4.out",
  inOut: "power3.inOut",
} as const;

export const DUR = {
  fast: 0.28,
  ui: 0.48,
  reveal: 1,
  slow: 1.4,
} as const;

export const STAGGER = {
  tight: 0.03,
  base: 0.055,
  loose: 0.08,
} as const;

/* ------------------------------------------------------------------ *
 * Registration
 * ------------------------------------------------------------------ */

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  registered = true;

  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

  // cubic-bezier(0.76, 0, 0.24, 1) expressed as the path CustomEase wants.
  CustomEase.create(EASE.reveal, "M0,0 C0.76,0 0.24,1 1,1");

  gsap.defaults({ ease: EASE.expo, duration: DUR.ui });

  // Mobile browsers fire resize when the URL bar collapses; re-pinning on
  // that is what makes most "award" sites janky on phones.
  ScrollTrigger.config({ ignoreMobileResize: true });
  ScrollTrigger.defaults({ markers: false });
}

/* ------------------------------------------------------------------ *
 * Motion preference and device capability
 * ------------------------------------------------------------------ */


type NavigatorExtras = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/**
 * True when the device can realistically carry WebGL plus heavy scroll work.
 *
 * Viewport width is the first gate, and it is deliberately blunt: a
 * transmissive material costs an extra render pass per frame, and a phone
 * that can technically run it still pays for it in battery, heat and a
 * second of main thread during load. Core count is no defence either -
 * mid-range Androids happily report eight cores and then drop frames, and
 * `hardwareConcurrency` is not throttled by device emulation, so it reads
 * as a desktop under test. Below 1024px the still is simply better.
 */
export function isCapableDevice(): boolean {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;

  const nav = navigator as NavigatorExtras;
  if (nav.connection?.saveData) return false;

  // Coarse pointer means a phone or tablet whatever the reported width.
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  if (window.matchMedia("(max-width: 1023px)").matches) return false;

  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 4;

  return cores >= 4 && mem >= 4;
}

/* ------------------------------------------------------------------ *
 * Lenis - single instance, driven by the GSAP ticker so smooth scroll
 * and scroll-linked animation share one clock (no double-rAF drift).
 * ------------------------------------------------------------------ */

let lenis: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;

export function initLenis(): Lenis | null {
  if (typeof window === "undefined") return null;
  if (lenis) return lenis;

  registerGsap();

  // Respect the OS preference by simply not smoothing. Native scroll is the
  // accessible fallback, and ScrollTrigger keeps working either way.
  if (prefersReducedMotion()) {
    ScrollTrigger.refresh();
    return null;
  }

  lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.8,
    syncTouch: false,
    autoResize: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  tickerFn = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function destroyLenis() {
  if (tickerFn) gsap.ticker.remove(tickerFn);
  tickerFn = null;
  lenis?.destroy();
  lenis = null;
}

export function getLenis(): Lenis | null {
  return lenis;
}

/** Freeze the page behind modals and the menu overlay. */
export function lockScroll() {
  if (typeof document === "undefined") return;
  if (lenis) lenis.stop();
  else document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  if (typeof document === "undefined") return;
  if (lenis) lenis.start();
  else document.documentElement.style.overflow = "";
}

export function scrollToTarget(target: string | number | HTMLElement, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.25 });
    return;
  }
  if (typeof window === "undefined") return;
  if (typeof target === "number") {
    window.scrollTo({ top: target + offset, behavior: "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (el instanceof HTMLElement) {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: "smooth" });
  }
}
