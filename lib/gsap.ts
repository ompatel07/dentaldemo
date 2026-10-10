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
 * True when the device can reasonably run the hero's WebGL object.
 *
 * Phones are allowed. They used to be excluded outright, back when the
 * object was a transmissive material lit by a live environment; it is now
 * one matcap lookup on a few thousand triangles, meshed in a worker, which
 * a mid-range phone draws without noticing. What still rules a device out
 * is the user asking for less (reduced motion, data saver) or genuinely
 * little memory. HeroObject adds its own gates on top: the box must be on
 * screen and big enough, and nothing loads until the page has.
 */
export function isCapableDevice(): boolean {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;

  const nav = navigator as NavigatorExtras;
  if (nav.connection?.saveData) return false;

  // Unreported on Safari and Firefox; assume a current device there.
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

  // Phones and tablets scroll natively. Lenis would leave touch alone
  // anyway, so all it could add there is a frame loop and a way to go wrong.
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return null;

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

  // Something may have locked the page before this instance existed.
  applyLock();

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

/**
 * Freeze the page behind modals, the menu overlay and the preloader.
 *
 * Locks are counted, and every change re-applies BOTH mechanisms - the
 * inline overflow and Lenis. They used to be either/or, decided at call
 * time: the preloader locked before Lenis existed (inline overflow) and
 * unlocked after it did (Lenis only), which left `overflow: hidden` on
 * <html> for the rest of the visit. A mouse wheel never noticed, because
 * Lenis scrolls programmatically; a finger could not scroll at all.
 */
let locks = 0;

function applyLock() {
  if (typeof document === "undefined") return;
  const locked = locks > 0;
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
}

export function lockScroll() {
  locks += 1;
  applyLock();
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  applyLock();
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
