"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger, destroyLenis, getLenis, initLenis, registerGsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { onIdle } from "@/lib/utils";

/**
 * Boots GSAP and Lenis once for the whole app and keeps ScrollTrigger honest
 * about page height - the single most common cause of pinned sections ending
 * in the wrong place is a refresh that never happened after fonts or images
 * changed the layout.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    registerGsap();
    initLenis();

    // Fonts change line counts, and that moves every trigger - but a refresh
    // re-measures the whole page and briefly unpins anything pinned, so the
    // several reasons to do one at boot are folded into a single pass.
    //
    // Image loads are deliberately not a reason. Every image on the site
    // sits in a box that is sized before it arrives, so a load moves
    // nothing; refreshing on each one meant a full re-measure, mid-scroll,
    // every time a lazy photograph came in.
    let queued = 0;
    const refresh = () => {
      window.clearTimeout(queued);
      queued = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    };

    void document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    // On phones the boot script holds the sections below the first screen
    // out of layout (html.booting, see globals.css). Hand them back once
    // the page is idle, or the moment someone touches it, then re-measure.
    const html = document.documentElement;
    let cancelIdle = () => {};
    const settle = () => {
      if (!html.classList.contains("booting")) return;
      html.classList.remove("booting");
      refresh();
    };
    const settleWhenIdle = () => {
      cancelIdle = onIdle(settle, 2000);
    };
    if (html.classList.contains("booting")) {
      window.addEventListener("pointerdown", settle, { once: true, passive: true });
      window.addEventListener("keydown", settle, { once: true });
      if (document.readyState === "complete") settleWhenIdle();
      else window.addEventListener("load", settleWhenIdle, { once: true });
    }

    return () => {
      window.clearTimeout(queued);
      cancelIdle();
      window.removeEventListener("load", refresh);
      window.removeEventListener("load", settleWhenIdle);
      window.removeEventListener("pointerdown", settle);
      window.removeEventListener("keydown", settle);
      destroyLenis();
    };
  }, []);

  useEffect(() => {
    // App Router keeps the scroll container mounted across routes.
    getLenis()?.scrollTo(0, { immediate: true });
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  return <>{children}</>;
}
