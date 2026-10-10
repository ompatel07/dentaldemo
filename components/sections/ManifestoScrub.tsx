"use client";

import { useRef, type ReactNode } from "react";
import { SplitText, gsap, registerGsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { onNearViewport } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Behaviour-only wrapper for the manifesto: it lifts the words from dim to
 * full as the passage crosses the viewport.
 *
 * Children are passed through, so the paragraph itself stays server-rendered
 * and this is the only piece that hydrates.
 *
 * It does not pin. The page already pins twice (the treatments rail and the
 * journey), and a third hijack in the first three screens is how a site
 * starts to feel like it is fighting the scroll wheel.
 */
export function ManifestoScrub({ children, className }: { children: ReactNode; className?: string }) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const copy = root.querySelector<HTMLElement>("[data-manifesto-copy]");
    if (!copy) return;

    registerGsap();

    let tween: gsap.core.Tween | null = null;
    let split: SplitText | null = null;
    let cancelled = false;

    const build = () => {
      if (cancelled) return;

      // aria:"none" because aria-label is prohibited on a <p>; the words
      // are read in order instead.
      split = SplitText.create(copy, { type: "words", aria: "none", wordsClass: "manifesto-word" });
      const words = split.words;

      if (prefersReducedMotion()) {
        gsap.set(words, { opacity: 1 });
        return;
      }

      // Floors chosen by measurement, not taste: at 39px this is large text,
      // which needs 3:1. Ink at 50% over paper is 3.3:1; the teal emphasis
      // words need 78% to clear the same bar.
      const floor = (_: number, el: Element) => (el.closest("em") ? 0.78 : 0.5);
      gsap.set(words, { opacity: floor });
      tween = gsap.to(words, {
        opacity: 1,
        ease: "none",
        stagger: 0.5,
        scrollTrigger: {
          trigger: copy,
          start: "top 82%",
          end: "bottom 48%",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
    };

    const stop = onNearViewport(root, () => {
      if (document.fonts?.status === "loaded") build();
      else void document.fonts?.ready.then(build);
    });

    return () => {
      cancelled = true;
      stop();
      tween?.scrollTrigger?.kill();
      tween?.kill();
      split?.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
