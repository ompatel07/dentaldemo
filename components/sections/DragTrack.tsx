"use client";

import { useRef, type ReactNode } from "react";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { gsap, registerExtra } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { site } from "@/content/site.config";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * A drag-with-inertia track that takes its contents as children, so the
 * cards inside stay server-rendered.
 *
 * The arrows are not a fallback bolted on afterwards: Draggable gives a
 * mouse user momentum and gives a keyboard user nothing, so the same track
 * is also steppable. Bounds are recalculated on resize rather than measured
 * once, which is the usual reason these carousels end up with dead space on
 * one end after an orientation change.
 */
export function DragTrack({
  children,
  hint,
  prevLabel,
  nextLabel,
}: {
  children: ReactNode;
  hint: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const instanceRef = useRef<Draggable | null>(null);

  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    const viewport = track?.parentElement;
    if (!track || !viewport) return;

    if (prefersReducedMotion()) return;

    registerExtra(Draggable, InertiaPlugin);

    const ctx = gsap.context(() => {
      const bounds = () => ({ minX: Math.min(0, viewport.clientWidth - track.scrollWidth), maxX: 0 });

      const [instance] = Draggable.create(track, {
        type: "x",
        inertia: true,
        edgeResistance: 0.9,
        bounds: bounds(),
        cursor: "grab",
        activeCursor: "grabbing",
        allowNativeTouchScrolling: true,
        dragClickables: false,
      });

      instanceRef.current = instance;

      const onResize = () => instance.applyBounds(bounds());
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        instance.kill();
        instanceRef.current = null;
      };
    }, track);

    return () => ctx.revert();
  }, []);

  const step = (dir: 1 | -1) => {
    const track = trackRef.current;
    const viewport = track?.parentElement;
    if (!track || !viewport) return;

    const card = track.querySelector<HTMLElement>("[data-review-card]");
    const amount = (card?.offsetWidth ?? 360) + 24;
    const limit = Math.min(0, viewport.clientWidth - track.scrollWidth);
    const current = (gsap.getProperty(track, "x") as number) || 0;
    const next = gsap.utils.clamp(limit, 0, current - dir * amount);

    gsap.to(track, {
      x: next,
      duration: 0.7,
      ease: "expo.out",
      onUpdate: () => instanceRef.current?.update(),
    });
  };

  return (
    <>
      <div className="overflow-hidden">
        <ul
          ref={trackRef}
          className="flex w-max cursor-grab items-stretch gap-[clamp(0.75rem,1.4vw,1.5rem)] px-[var(--gutter)] active:cursor-grabbing"
          data-cursor-label={site.copy.dragLabel}
        >
          {children}
        </ul>
      </div>

      <div className="edge mt-10 flex items-center justify-between gap-6">
        <p className="text-sm text-muted">{hint}</p>
        <div className="flex gap-2">
          <button
            onClick={() => step(-1)}
            aria-label={prevLabel}
            className="tap flex items-center justify-center rounded-pill border border-line px-4 transition-colors hover:border-accent hover:text-accent"
          >
            <span aria-hidden="true">&larr;</span>
          </button>
          <button
            onClick={() => step(1)}
            aria-label={nextLabel}
            className="tap flex items-center justify-center rounded-pill border border-line px-4 transition-colors hover:border-accent hover:text-accent"
          >
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </>
  );
}
