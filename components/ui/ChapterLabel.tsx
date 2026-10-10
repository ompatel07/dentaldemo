import { cx } from "@/lib/utils";

/**
 * The chapter marker: a small pill with the chapter number in a filled chip.
 *
 * It replaces the mono "( 01 - LABEL )" device, which had become the
 * signature of every generated landing page. A pill reads as part of the
 * interface rather than as decoration, and it holds its own over a photo.
 */
export function ChapterLabel({
  chapter,
  children,
  className,
  as: Tag = "p",
}: {
  chapter?: string;
  children: React.ReactNode;
  className?: string;
  as?: "p" | "h2" | "span" | "div";
}) {
  return (
    <Tag
      className={cx(
        "inline-flex w-fit items-center gap-2.5 rounded-pill border border-line bg-surface-2/70 py-1 pl-1 pr-3.5 text-[0.8125rem] font-medium leading-none text-fg backdrop-blur-sm",
        className,
      )}
    >
      {chapter ? (
        <span className="grid h-6 min-w-6 place-items-center rounded-pill bg-fg px-1.5 font-mono text-[0.6875rem] font-medium text-bg">
          {chapter}
        </span>
      ) : (
        <span aria-hidden="true" className="ml-1.5 block h-1.5 w-1.5 rounded-pill bg-accent-bright" />
      )}
      <span>{children}</span>
    </Tag>
  );
}

/** A hairline with measurement ticks, used sparingly as a divider. */
export function TickRule({ count = 32, className }: { count?: number; className?: string }) {
  return (
    <div className={cx("relative h-3 w-full border-t border-line", className)} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="absolute top-0 w-px bg-current opacity-20"
          style={{ left: `${(i / (count - 1)) * 100}%`, height: i % 4 === 0 ? "9px" : "4px" }}
        />
      ))}
    </div>
  );
}
