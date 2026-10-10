"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { isCapableDevice } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { useIntroReady } from "@/components/motion/IntroContext";
import { site } from "@/content/site.config";
import { cx, onIdle } from "@/lib/utils";

const TeethScene = dynamic(() => import("./TeethScene"), { ssr: false, loading: () => null });

/**
 * If WebGL dies - context lost, a driver bug, a browser we have never heard
 * of - the still underneath simply stays where it is.
 */
class CanvasBoundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFail();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The hero's 3D molar, with a rendered still of the same model underneath.
 *
 * The still is a transparent PNG captured from this very scene
 * (scripts/render-tooth.mjs), so the swap to live WebGL is invisible: same
 * object, same light, it just starts to turn.
 *
 * Gates in front of the canvas, all deliberate:
 *   - config: site.hero.object must be "3d"
 *   - layout: the box must actually be displayed (it is measured), since
 *     the hero carries one per breakpoint and hides the other
 *   - capability: memory, save-data, reduced motion
 *   - timing: nothing loads until the intro is done, the page has loaded
 *     and the main thread is idle, so three.js never competes with it
 */
export function HeroObject({ className }: { className?: string }) {
  const introReady = useIntroReady();
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [capable, setCapable] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [idle, setIdle] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (site.hero.object !== "3d") return;
    // The hero places one of these per layout and hides the other with
    // CSS; a hidden box measures zero and never loads anything.
    const width = boxRef.current?.getBoundingClientRect().width ?? 0;
    if (width < 72) return;
    if (site.hero.phones !== "3d" && window.matchMedia("(max-width: 1023px)").matches) return;

    const motionOff = prefersReducedMotion();
    setReduced(motionOff);
    // Under reduced motion the object still renders - held perfectly still.
    setCapable(isCapableDevice() || motionOff);
  }, []);

  useEffect(() => {
    if (!capable || !introReady) return;
    // Not before the page itself has loaded, and then only when idle: the
    // still is already on screen, so the live object can afford to be late.
    let cancel = () => {};
    const arm = () => {
      cancel = onIdle(() => setIdle(true), 2500);
    };
    if (document.readyState === "complete") arm();
    else {
      window.addEventListener("load", arm, { once: true });
      cancel = () => window.removeEventListener("load", arm);
    }
    return () => cancel();
  }, [capable, introReady]);

  const handleFail = useCallback(() => setLive(false), []);
  const handleReady = useCallback(() => setLive(true), []);

  return (
    // No position utility is added here: the caller positions this box, and
    // a second position class on the same element is settled by Tailwind's
    // output order, not by intent - `relative` was beating `absolute`.
    <div ref={boxRef} className={className} aria-hidden="true">
      {/* A soft contact shadow, so the object sits in the layout. */}
      <div className="absolute inset-x-[18%] bottom-[4%] h-[9%] rounded-[50%] bg-[var(--ink)]/25 blur-2xl" />

      <div className={cx("absolute inset-0 transition-opacity duration-700", live ? "opacity-0" : "opacity-100")}>
        <Image src="/images/hero-tooth.png" alt="" fill sizes="(max-width: 1024px) 40vw, 30vw" className="object-contain" loading="lazy" />
      </div>

      {capable && introReady && idle ? (
        <div className="absolute inset-0">
          <CanvasBoundary onFail={handleFail}>
            <TeethScene reduced={reduced} onReady={handleReady} />
          </CanvasBoundary>
        </div>
      ) : null}
    </div>
  );
}
