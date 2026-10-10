import { ChapterLabel } from "@/components/ui/ChapterLabel";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { emphasize } from "@/components/motion/Emphasis";
import { cx } from "@/lib/utils";

type Props = {
  chapter: string;
  label: string;
  headline?: string;
  emphasis?: readonly string[];
  body?: string;
  className?: string;
  /** Right-hand slot under the body: a CTA, a counter, a control. */
  aside?: React.ReactNode;
  /** Narrower headline measure for long sentences. */
  measure?: string;
};

/**
 * Every chapter opens the same way: marker, headline on the left, and the
 * supporting paragraph set against the headline's baseline on the right.
 *
 * The earlier version parked the marker alone in a three-column gutter and
 * pushed everything else right, which left a quarter of every section empty.
 * Here the headline owns the left edge and the paragraph fills the rest.
 *
 * The measure sits on the heading itself: `ch` resolves against the
 * element's own font size, so a ch-width on a wrapper div is far too narrow
 * for display type.
 */
export function SectionHeader({ chapter, label, headline, emphasis, body, className, aside, measure = "max-w-[17ch]" }: Props) {
  return (
    <header className={cx("grid-editorial items-end gap-y-7", className)}>
      <div className="col-span-12 lg:col-span-8">
        <Reveal y={14}>
          <ChapterLabel chapter={chapter}>{label}</ChapterLabel>
        </Reveal>

        {headline ? (
          <SplitReveal as="h2" className={cx("display mt-6 text-h1", measure)}>
            {emphasis?.length ? emphasize(headline, emphasis) : headline}
          </SplitReveal>
        ) : null}
      </div>

      {body || aside ? (
        <div className="col-span-12 lg:col-span-4 lg:pb-1.5">
          {body ? (
            <Reveal y={18}>
              <p className="max-w-[44ch] text-muted">{body}</p>
            </Reveal>
          ) : null}
          {aside ? <div className={body ? "mt-6" : ""}>{aside}</div> : null}
        </div>
      ) : null}
    </header>
  );
}
