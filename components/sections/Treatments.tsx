import { PinnedHorizontal } from "@/components/motion/PinnedHorizontal";
import { ThemeSection } from "@/components/motion/ThemeSection";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { emphasize } from "@/components/motion/Emphasis";
import { ChapterLabel } from "@/components/ui/ChapterLabel";
import { Button } from "@/components/ui/Button";
import { TreatmentCard } from "./TreatmentCard";
import { treatments } from "@/content/treatments";
import { sections } from "@/content/sections";

/**
 * 04 - Treatments.
 *
 * A pinned horizontal rail on desktop, a native snap carousel on phones.
 * The chapter header is the first panel of the track rather than a block
 * above it: the rail reads as one continuous spread, and the viewer learns
 * that the section scrolls sideways by watching its title leave.
 */
export function Treatments() {
  const { treatments: copy } = sections;

  return (
    <ThemeSection theme="sand" id="treatments" className="relative overflow-hidden">
      <PinnedHorizontal
        /* Viewport height only where it pins; on a phone the rail is a
           carousel and takes the height of its cards. */
        className="py-[clamp(3rem,8vh,5rem)] lg:h-svh lg:py-0"
        trackClassName="h-full items-center gap-[clamp(1rem,1.8vw,2rem)] px-[var(--gutter)]"
      >
        {/* Panel 00 - the chapter opening. */}
        <div className="flex w-[80vw] shrink-0 snap-center flex-col justify-center pr-[clamp(0rem,2vw,3rem)] sm:w-[52vw] lg:w-[clamp(340px,27vw,480px)]">
          <ChapterLabel chapter={copy.chapter}>{copy.label}</ChapterLabel>

          <SplitReveal as="h2" className="display mt-6 text-h1">
            {emphasize(copy.headline, copy.emphasis)}
          </SplitReveal>

          <Reveal className="mt-6 max-w-[38ch]" y={18}>
            <p className="text-muted">{copy.body}</p>
          </Reveal>

          <Reveal className="mt-8 flex items-center gap-4" y={14}>
            <Button href="/#book" size="sm" cursorLabel="Book">
              {sections.hero.primaryCta}
            </Button>
            <p className="hidden items-center gap-2 text-sm text-muted lg:flex">
              Scroll
              <svg viewBox="0 0 24 10" className="h-2.5 w-6" fill="none" aria-hidden="true">
                <path d="M0 5h22M18 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </p>
          </Reveal>
        </div>

        {treatments.map((t) => (
          <TreatmentCard key={t.slug} treatment={t} />
        ))}

        {/* Closing panel - the rail ends on an action, not on a card edge. */}
        <div className="flex w-[70vw] shrink-0 snap-center flex-col justify-center sm:w-[40vw] lg:w-[clamp(260px,19vw,320px)]">
          <p className="display text-h2">{copy.cta}</p>
          <p className="mt-3 text-sm text-muted">{sections.pricing.body}</p>
          <div className="mt-6">
            <Button href="/#pricing" variant="outline" size="sm" cursorLabel="View">
              {sections.pricing.label}
            </Button>
          </div>
        </div>
      </PinnedHorizontal>
    </ThemeSection>
  );
}
