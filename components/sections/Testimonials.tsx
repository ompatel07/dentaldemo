import { ThemeSection } from "@/components/motion/ThemeSection";
import { CountUp } from "@/components/motion/CountUp";
import { SectionHeader } from "./SectionHeader";
import { DragTrack } from "./DragTrack";
import { VideoTestimonial } from "./VideoTestimonial";
import { testimonials, reviewAggregate } from "@/content/testimonials";
import { sections } from "@/content/sections";
import type { Testimonial } from "@/content/types";

/**
 * 12 - Testimonials.
 *
 * A server component. Eight cards of quotes and attributions are plain
 * markup; only the drag track and the two video cards hydrate.
 */
export function Testimonials() {
  const { testimonials: copy } = sections;

  return (
    <ThemeSection theme="ink" id="testimonials" className="section-y overflow-hidden">
      <div className="edge">
        <SectionHeader
          chapter={copy.chapter}
          label={copy.label}
          headline={copy.headline}
          emphasis={copy.emphasis}
          aside={
            <div className="flex items-center gap-4">
              <p className="display text-[clamp(2.75rem,4.6vw,4.25rem)] leading-none text-accent">
                <CountUp value={reviewAggregate.average} decimals={1} duration={1.6} />
              </p>
              <p className="text-sm leading-snug text-muted">
                <span className="block text-[var(--coral)]" aria-hidden="true">★★★★★</span>
                {copy.aggregateLabel} <CountUp value={reviewAggregate.count} /> {copy.aggregateSuffix}
              </p>
            </div>
          }
        />
      </div>

      <div className="relative mt-[clamp(2.5rem,7vh,4.5rem)]">
        <DragTrack hint={copy.body} prevLabel="Previous reviews" nextLabel="More reviews">
          {testimonials.map((t) => (
            <li key={t.id} data-review-card className="w-[80vw] shrink-0 sm:w-[46vw] lg:w-[clamp(320px,26vw,400px)]">
              {t.video ? <VideoTestimonial item={t} /> : <QuoteCard item={t} />}
            </li>
          ))}
        </DragTrack>
      </div>
    </ThemeSection>
  );
}

function QuoteCard({ item }: { item: Testimonial }) {
  return (
    <figure className="flex h-full min-h-[320px] flex-col justify-between rounded-[var(--r-lg)] border border-line bg-surface p-[clamp(1.25rem,2vw,1.75rem)]">
      <div>
        <p className="text-sm text-[var(--coral)]">
          <span className="sr-only">Rated {item.rating} out of 5</span>
          <span aria-hidden="true">{"★".repeat(item.rating)}</span>
        </p>
        <blockquote className="mt-5 text-[clamp(1.05rem,1.3vw,1.3rem)] leading-snug">{item.quote}</blockquote>
      </div>
      <figcaption className="mt-8 border-t border-line pt-5">
        <p className="font-medium">{item.author}</p>
        <p className="mt-0.5 text-sm text-muted">{item.context}</p>
      </figcaption>
    </figure>
  );
}
