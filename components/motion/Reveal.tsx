"use client";

import { useRef, type ReactNode } from "react";
import { DUR, EASE, STAGGER, gsap, registerGsap } from "@/lib/gsap";
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
  /** Rise distance in px. */
  y?: number;
  delay?: number;
  duration?: number;
  /** Trigger point as an IntersectionObserver rootMargin. */
  rootMargin?: string;
  /** Stagger direct children instead of the wrapper itself. */
  stagger?: number | false;
  scale?: number;
  trigger?: "scroll" | "mount";
};

/**
 * The workhorse: a rise-and-fade for anything that is not a headline.
 *
 * Two deliberate choices:
 *
 *  - **Above the fold** (`trigger="mount"`) it is a CSS animation on
 *    server-rendered markup. `[data-reveal]{visibility:hidden}` cannot be
 *    painted until hydration unhides it, which pushed LCP from 2.5s to 4.7s
 *    on a throttled phone. The preloader holds the animation with
 *    `animation-play-state` when there is a curtain to hide behind.
 *  - **Below the fold** the trigger is an IntersectionObserver, not a
 *    ScrollTrigger. ScrollTrigger reads the element's document position,
 *    which is wrong inside a pinned horizontal track - those reveals never
 *    fired at all. The observer asks the browser where the element really
 *    is, so it behaves identically inside pins and transforms.
 *
 * Reduced motion collapses it to a short opacity fade with no travel.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  y = 28,
  delay = 0,
  duration = DUR.reveal,
  rootMargin,
  stagger = false,
  scale,
  trigger = "scroll",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const cssEntrance = trigger === "mount";

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || cssEntrance) return;

    registerGsap();

    const targets = stagger === false ? el : Array.from(el.children);
    if (Array.isArray(targets) && targets.length === 0) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }

    let ctx: gsap.Context | null = null;

    const build = () => {
      ctx = gsap.context(() => {
        gsap.set(el, { autoAlpha: 1 });

        if (reduced) {
          gsap.fromTo(
            targets,
            { autoAlpha: 0 },
            {
              autoAlpha: 1,
              duration: 0.5,
              delay,
              stagger: stagger === false ? 0 : STAGGER.tight,
            },
          );
          return;
        }

        gsap.from(targets, {
          autoAlpha: 0,
          y,
          ...(scale ? { scale } : {}),
          duration,
          delay,
          ease: EASE.reveal,
          stagger: stagger === false ? 0 : stagger,
        });
      }, el);
    };

    const stop = onEnterViewport(el, build, rootMargin);

    return () => {
      stop();
      ctx?.revert();
    };
  }, [cssEntrance, delay, duration, reduced, rootMargin, scale, stagger, y]);

  const Comp = Tag as unknown as React.FC<TagProps>;

  return (
    <Comp
      ref={ref}
      className={cx(className, cssEntrance && "reveal-rise")}
      data-reveal={cssEntrance ? undefined : true}
      style={cssEntrance && delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </Comp>
  );
}
