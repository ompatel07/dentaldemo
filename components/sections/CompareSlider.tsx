"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { clamp, cx } from "@/lib/utils";
import type { SmileCase } from "@/content/types";

/**
 * Before/after drag comparison.
 *
 * Two accessibility decisions worth stating:
 *
 *   1. The control is a real <input type="range">, stretched invisibly over
 *      the whole frame. That buys keyboard support, arrow-key stepping and a
 *      sane screen-reader announcement for free, instead of a div with a
 *      hand-rolled role="slider" that never quite behaves.
 *   2. Dragging writes a CSS custom property through a ref, not React state.
 *      Re-rendering two next/image trees on every pointermove is how these
 *      sliders end up janky.
 */
export function CompareSlider({
  item,
  priority = false,
  caption = true,
  className,
}: {
  item: SmileCase;
  priority?: boolean;
  /** The treatment / summary line under the frame. */
  caption?: boolean;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragging = useRef(false);

  const setPos = useCallback((pct: number) => {
    const next = clamp(pct, 0, 100);
    frameRef.current?.style.setProperty("--compare", String(next));
    if (inputRef.current) inputRef.current.value = String(Math.round(next));
  }, []);

  const fromClientX = useCallback(
    (clientX: number) => {
      const rect = frameRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPos(((clientX - rect.left) / rect.width) * 100);
    },
    [setPos],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    fromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    fromClientX(e.clientX);
  };

  const endDrag = (e: React.PointerEvent) => {
    dragging.current = false;
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  };

  return (
    <figure className={cx("m-0", className)}>
      <div
        ref={frameRef}
        className="relative aspect-[4/3] max-h-[72svh] w-full touch-pan-y select-none overflow-hidden rounded-[var(--r-xl)] bg-surface has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-[var(--accent)]"
        style={{ ["--compare" as string]: 50 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        data-cursor-label="Drag"
      >
        {/* After: the full frame. */}
        <Image
          src={item.after.src}
          alt={item.after.alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 92vw, 62vw"
          className="object-cover"
          draggable={false}
          loading={priority ? undefined : "lazy"}
        />

        {/* Before: clipped to the handle position. */}
        <div className="absolute inset-0" style={{ clipPath: "inset(0 calc(100% - var(--compare) * 1%) 0 0)" }}>
          <Image
            src={item.before.src}
            alt={item.before.alt}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 92vw, 62vw"
            className="object-cover"
            draggable={false}
            loading={priority ? undefined : "lazy"}
          />
        </div>

        <span aria-hidden="true" className="absolute left-4 top-4 rounded-pill bg-[var(--ink)]/70 px-3.5 py-2 text-[0.8125rem] font-medium text-[var(--paper)] backdrop-blur-sm">
          Before
        </span>
        <span aria-hidden="true" className="absolute right-4 top-4 rounded-pill bg-[var(--paper)]/90 px-3.5 py-2 text-[0.8125rem] font-medium text-[var(--ink)] backdrop-blur-sm">
          After
        </span>

        {/* Handle */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0.5 bg-[var(--paper)]" style={{ left: "calc(var(--compare) * 1%)" }}>
          <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-pill bg-[var(--paper)] text-[var(--ink)] shadow-[var(--shadow-lift)]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path d="M9 6 3 12l6 6M15 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        {/* The actual control. Invisible, full-frame, fully keyboard-driven. */}
        <input
          ref={inputRef}
          type="range"
          min={0}
          max={100}
          defaultValue={50}
          step={1}
          aria-label={`Reveal the before and after of ${item.label}. Left is before treatment, right is after.`}
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0 focus-visible:outline-none"
        />
      </div>

      {caption ? (
        <figcaption className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <p className="text-sm font-medium text-accent">
            {item.treatment} · {item.duration}
          </p>
          <p className="max-w-[60ch] text-sm text-muted">{item.summary}</p>
        </figcaption>
      ) : null}
    </figure>
  );
}
