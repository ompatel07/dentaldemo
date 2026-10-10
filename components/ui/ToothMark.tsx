import { cx } from "@/lib/utils";

/**
 * The house mark: a tooth drawn as a single open outline so DrawSVGPlugin can
 * trace it. Used by the preloader, the 404 and anywhere the brand needs a
 * glyph. Decorative everywhere, so it is always aria-hidden.
 */
export function ToothMark({
  className,
  strokeWidth = 1.2,
  draw = false,
  showCrown = true,
}: {
  className?: string;
  strokeWidth?: number;
  /** Tags the strokes for DrawPath to trace. */
  draw?: boolean;
  /** The inner crown line - omitted at small sizes. */
  showCrown?: boolean;
}) {
  const mark = draw ? { "data-draw": true } : {};

  return (
    <svg viewBox="0 0 32 32" className={cx("overflow-visible", className)} fill="none" aria-hidden="true">
      <path
        {...mark}
        d="M16 5.5c-5.2 0-8.6 3.2-8.6 7.6 0 4.1 2.6 5.9 3.5 10.2.5 2.4 2.3 2.4 2.7 0l.9-5.1c.4-2.1 2.6-2.1 3 0l.9 5.1c.4 2.4 2.2 2.4 2.7 0 .9-4.3 3.5-6.1 3.5-10.2 0-4.4-3.4-7.6-8.6-7.6Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {showCrown ? (
        <path
          {...mark}
          d="M10.4 11.4c1.6-1.5 3.4-2.2 5.6-2.2s4 .7 5.6 2.2"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity="0.5"
          vectorEffect="non-scaling-stroke"
        />
      ) : null}
    </svg>
  );
}
