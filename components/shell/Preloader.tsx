"use client";

import { useRef } from "react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { EASE, gsap, lockScroll, registerExtra, unlockScroll } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { ToothMark } from "@/components/ui/ToothMark";
import { site } from "@/content/site.config";
import { prefersReducedMotion } from "@/lib/motion";

export const INTRO_SEEN_KEY = "aurelle:intro-seen";

/** Hard cap on how long the counter may wait for fonts and the load event. */
const READY_CAP_MS = site.intro.maxWaitMs;

type Props = {
  /** Fires as the curtain starts opening, so the hero animates with it. */
  onReveal: () => void;
  /** Fires when the overlay is finished and can leave the DOM. */
  onDone: () => void;
};

/**
 * The preloader.
 *
 * The wordmark sits centre screen while the tooth mark traces itself beside
 * it and a line fills along the bottom; then a split curtain opens
 * vertically and the hero animates into the gap.
 *
 * The counter is honest about two things: it holds at 90 until fonts and the
 * window load event have actually landed, and it is hard-capped, so nobody
 * ever waits more than about two seconds for a dental website.
 *
 * Repeat visits in the same tab skip it entirely - a blocking script in
 * app/layout.tsx marks <html> before first paint, so there is no flash.
 */
export function Preloader({ onReveal, onDone }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const markRef = useRef<HTMLDivElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const counter = counterRef.current;
    if (!root || !counter) return;

    registerExtra(DrawSVGPlugin);

    const reduced = prefersReducedMotion();
    lockScroll();

    const state = { n: 0 };
    const paint = () => {
      counter.textContent = String(Math.round(state.n)).padStart(3, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${state.n / 100})`;
    };
    paint();

    // Reduced motion: no theatre, just get out of the way.
    if (reduced) {
      const t = window.setTimeout(() => {
        onReveal();
        gsap.to(root, {
          autoAlpha: 0,
          duration: 0.3,
          onComplete: () => {
            unlockScroll();
            onDone();
          },
        });
      }, 250);
      return () => {
        window.clearTimeout(t);
        unlockScroll();
      };
    }

    let cap: number | undefined;

    const ctx = gsap.context(() => {
      const strokes = root.querySelectorAll<SVGPathElement>("[data-draw]");
      gsap.set(strokes, { drawSVG: "0%" });

      let drawDone = false;
      let released = false;
      let opened = false;

      const open = () => {
        if (opened || !drawDone || !released) return;
        opened = true;
        out.play(0);
      };

      const out = gsap
        .timeline({ paused: true })
        .to(state, { n: 100, duration: 0.3, ease: "power2.out", onUpdate: paint }, 0)
        .to([markRef.current, metaRef.current], { autoAlpha: 0, duration: 0.35, ease: "none" }, 0.18)
        .add(() => onReveal(), 0.3)
        .to(topRef.current, { yPercent: -100, duration: 0.95, ease: EASE.reveal }, 0.3)
        .to(bottomRef.current, { yPercent: 100, duration: 0.95, ease: EASE.reveal }, 0.3)
        .add(() => {
          unlockScroll();
          onDone();
        });

      gsap
        .timeline({
          onComplete: () => {
            drawDone = true;
            open();
          },
        })
        .to(metaRef.current, { autoAlpha: 1, duration: 0.4, ease: "none" }, 0)
        .to(state, { n: 90, duration: 1, ease: "power1.inOut", onUpdate: paint }, 0)
        .to(strokes, { drawSVG: "100%", duration: 1.05, ease: EASE.reveal, stagger: 0.1 }, 0);

      const release = () => {
        released = true;
        open();
      };

      void Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        document.readyState === "complete"
          ? Promise.resolve()
          : new Promise<void>((res) => window.addEventListener("load", () => res(), { once: true })),
      ]).then(release);

      cap = window.setTimeout(release, READY_CAP_MS);
    }, root);

    return () => {
      window.clearTimeout(cap);
      ctx.revert();
      unlockScroll();
    };
  }, [onDone, onReveal]);

  return (
    <div
      ref={rootRef}
      className="preloader fixed inset-0 grid grid-rows-2"
      style={{ zIndex: "var(--z-preloader)" }}
      role="status"
      aria-live="polite"
      aria-label={site.copy.loading}
    >
      <div ref={topRef} className="bg-[var(--ink)] will-change-transform" />
      <div ref={bottomRef} className="bg-[var(--ink)] will-change-transform" />

      {/* Mark and meta sit above both halves so the split reads as one image. */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-[var(--paper)]">
        <div ref={markRef} className="flex flex-col items-center text-center">
          <div className="flex items-center gap-[clamp(0.75rem,1.6vw,1.5rem)]">
            <span className="text-[var(--mint-strong)]">
              <ToothMark className="h-[clamp(44px,6vw,84px)] w-auto" draw strokeWidth={1.4} />
            </span>
            <span className="display text-[clamp(3rem,9vw,8rem)] leading-none">{site.brand.name}</span>
          </div>
          <p className="accent-italic mt-[clamp(0.75rem,2vh,1.25rem)] text-[clamp(1.1rem,1.8vw,1.6rem)] text-[var(--mint-strong)]">
            {site.brand.tagline}
          </p>
        </div>
      </div>

      <div ref={metaRef} className="pointer-events-none absolute inset-x-0 bottom-0 p-[var(--gutter)] text-[var(--paper)] opacity-0">
        <div className="flex items-end justify-between gap-6">
          <p className="text-sm font-medium">
            {site.brand.suffix}, {site.contact.address.city}
          </p>
          <p className="display text-[clamp(1.75rem,4vw,3rem)] leading-none tabular-nums">
            <span ref={counterRef}>000</span>
          </p>
        </div>
        <span className="mt-4 block h-px bg-[var(--paper)]/20">
          <span ref={barRef} className="block h-px origin-left scale-x-0 bg-[var(--coral)]" />
        </span>
      </div>
    </div>
  );
}
