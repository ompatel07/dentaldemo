"use client";

import { useRef, type ReactNode } from "react";
import { DUR, EASE, STAGGER, gsap, registerGsap, SplitText } from "@/lib/gsap";
import { useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/hooks";
import { cx, onEnterViewport } from "@/lib/utils";

/**
 * Polymorphic tag without the cost: React Three Fiber augments the global JSX
 * namespace with every three.js object, which makes a bare `ElementType`
 * union resolve its props to `never`. Narrowing to the handful of HTML tags
 * these components actually render keeps the types honest and fast.
 */
type RevealTag =
  | "div"
  | "span"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "ul"
  | "ol"
  | "li"
  | "dl"
  | "section"
  | "blockquote"
  | "figure";

type TagProps = React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> };

type Props = {
  children: ReactNode;
  as?: RevealTag;
  className?: string;
  /** Lines read as editorial; chars are for short display words only. */
  by?: "lines" | "words" | "chars";
  /** "scroll" reveals on entry; "mount" is the CSS entrance, above the fold. */
  trigger?: "scroll" | "mount";
  /** Trigger point as an IntersectionObserver rootMargin. */
  rootMargin?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  /** Vertical travel as a fraction of the mask height. */
  from?: number;
  /** Needed on character splits, which read as alphabet soup otherwise. */
  "aria-label"?: string;
};

/**
 * The house headline reveal: text split into lines, each line masked by its
 * own overflow-hidden wrapper, rising on the signature curve.
 *
 * Splitting happens after fonts are ready - otherwise lines break against
 * the fallback metrics - and re-splits on resize via GSAP's own autoSplit.
 *
 * The reveal is driven by an IntersectionObserver rather than a one-shot
 * ScrollTrigger. ScrollTrigger resolves its start from the element's
 * document position, which is the wrong answer inside a pinned horizontal
 * track: those headlines never revealed at all. See lib/utils.
 *
 * With reduced motion the element simply fades and the DOM is never split.
 */
export function SplitReveal({
  children,
  as: Tag = "div",
  className,
  by = "lines",
  trigger = "scroll",
  rootMargin,
  delay = 0,
  duration = DUR.reveal,
  stagger = STAGGER.base,
  from = 1.05,
  "aria-label": ariaLabel,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const cssEntrance = trigger === "mount";

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || cssEntrance) return;

    registerGsap();

    if (reduced) {
      const stop = onEnterViewport(el, () => {
        gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, delay });
      }, rootMargin);
      return stop;
    }

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    const build = () => {
      if (cancelled || !ref.current) return;
      ctx = gsap.context(() => {
        const split = SplitText.create(el, {
          type: by,
          mask: by,
          autoSplit: true,
          // SplitText's aria:"auto" writes an aria-label onto the element it
          // splits. That is fine on a heading, but aria-label is prohibited
          // on <p> and <span> (generic role), so we turn it off and let the
          // split pieces be read in order - which they are, being words and
          // whole lines rather than characters.
          aria: "none",
          linesClass: "split-piece",
          wordsClass: "split-piece",
          charsClass: "split-piece",
          onSplit: (self) => {
            const pieces = by === "lines" ? self.lines : by === "words" ? self.words : self.chars;
            gsap.set(el, { autoAlpha: 1 });
            return gsap.from(pieces, {
              yPercent: from * 100,
              duration,
              delay,
              ease: EASE.reveal,
              stagger,
            });
          },
        });
        return () => split.revert();
      }, el);
    };

    // Fonts first: splitting against fallback metrics produces wrong lines.
    const start = () => {
      if (document.fonts?.status === "loaded") build();
      else void document.fonts?.ready.then(build);
    };

    const stop = onEnterViewport(el, start, rootMargin);

    return () => {
      cancelled = true;
      stop();
      ctx?.revert();
    };
  }, [by, cssEntrance, delay, duration, from, reduced, rootMargin, stagger]);

  const Comp = Tag as unknown as React.FC<TagProps>;

  return (
    <Comp
      ref={ref}
      className={cx(className, cssEntrance && "reveal-rise")}
      data-reveal={cssEntrance ? undefined : true}
      style={cssEntrance && delay ? { animationDelay: `${delay}s` } : undefined}
      aria-label={ariaLabel}
    >
      {children}
    </Comp>
  );
}
