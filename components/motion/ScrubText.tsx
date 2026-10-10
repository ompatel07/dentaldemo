"use client";

import { useRef, type ReactNode } from "react";
import { SplitText, gsap, registerGsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { cx, onNearViewport } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Opacity the words start at before they are read. */
  dim?: number;
  start?: string;
  end?: string;
};

/**
 * The manifesto effect: words lift from dim to full as the passage is read,
 * scrubbed to scroll. Split by words rather than characters, because the eye
 * reads words and character-scrubbing reads as a gimmick.
 *
 * Reduced motion leaves the paragraph at full contrast, static.
 */
export function ScrubText({ children, className, dim = 0.15, start = "top 80%", end = "bottom 55%" }: Props) {
  const ref = useRef<HTMLParagraphElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerGsap();

    if (prefersReducedMotion()) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    const build = () => {
      if (cancelled || !ref.current) return;
      ctx = gsap.context(() => {
        const split = SplitText.create(el, {
          type: "words",
          autoSplit: true,
          aria: "none",
          wordsClass: "scrub-word",
          onSplit: (self) => {
            gsap.set(el, { autoAlpha: 1 });
            return gsap.fromTo(
              self.words,
              { opacity: dim },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.4,
                scrollTrigger: {
                  trigger: el,
                  start,
                  end,
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              },
            );
          },
        });
        return () => split.revert();
      }, el);
    };

    const stop = onNearViewport(el, () => {
      if (document.fonts?.status === "loaded") build();
      else void document.fonts?.ready.then(build);
    });

    return () => {
      cancelled = true;
      stop();
      ctx?.revert();
    };
  }, [dim, end, start]);

  return (
    <p ref={ref} className={cx(className)} data-reveal>
      {children}
    </p>
  );
}
