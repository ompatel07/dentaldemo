"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { IntroContext } from "@/components/motion/IntroContext";
import { Preloader, INTRO_SEEN_KEY } from "./Preloader";
import { ScrollTrigger } from "@/lib/gsap";
import { site } from "@/content/site.config";

/**
 * Owns the intro: whether the preloader runs, and when above-the-fold
 * animations are allowed to start.
 *
 * The preloader only ever runs on the first page of a session, and only on
 * the home route - arriving directly at /contact should not be made to watch
 * a loading film. `<html class="intro-seen">` is set by a blocking script
 * before first paint, so a repeat visit never flashes the overlay.
 */
export function IntroProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/" && site.intro.enabled;

  // Rendered on the server too, then corrected in the first effect. The
  // blocking script hides it with CSS in the meantime.
  const [showPreloader, setShowPreloader] = useState(isHome);
  const [ready, setReady] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setShowPreloader(false);
      setReady(true);
      return;
    }
    // Matches the blocking script in app/layout.tsx.
    const narrow = window.innerWidth < 1024;

    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
    } catch {
      // Private mode or blocked storage: run the intro, it is only 2 seconds.
    }
    if (seen || narrow) {
      setShowPreloader(false);
      setReady(true);
      document.documentElement.classList.add("intro-done");
    }
  }, [isHome]);

  const handleReveal = useCallback(() => {
    setReady(true);
    // Releases the paused CSS entrances so the hero rises into the gap the
    // curtain is opening.
    document.documentElement.classList.add("intro-done");
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const handleDone = useCallback(() => {
    setShowPreloader(false);
    document.documentElement.classList.add("intro-seen");
    // The hero only reaches its final height once the curtain is gone.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  return (
    <IntroContext.Provider value={ready}>
      {showPreloader ? <Preloader onReveal={handleReveal} onDone={handleDone} /> : null}
      {children}
    </IntroContext.Provider>
  );
}
