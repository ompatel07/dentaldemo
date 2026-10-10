import { ThemeSection } from "@/components/motion/ThemeSection";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "./SectionHeader";
import { EmiCalculator } from "./EmiCalculator";
import { pricingTiers, pricingNotes } from "@/content/pricing";
import { site } from "@/content/site.config";
import { sections } from "@/content/sections";
import { fromPrice } from "@/lib/format";
import { cx } from "@/lib/utils";

/**
 * 10 - Transparent pricing and EMI.
 *
 * Starting prices in public, because hiding them is a tactic rather than a
 * policy, and a monthly figure the visitor can reach without speaking to
 * anyone - "what will this cost me a month" is the question that actually
 * decides whether they book.
 *
 * A server component: the five tier cards, the partner row and the notes
 * are static markup, and only the calculator hydrates.
 */
export function Pricing() {
  const { pricing: copy } = sections;

  return (
    <ThemeSection theme="sand" id="pricing" className="section-y">
      <div className="edge">
        <SectionHeader
          chapter={copy.chapter}
          label={copy.label}
          headline={copy.headline}
          emphasis={copy.emphasis}
          body={copy.body}
        />

        <Reveal
          as="ul"
          className="mt-[clamp(2.5rem,7vh,4.5rem)] grid gap-px overflow-hidden rounded-[var(--r-xl)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.06}
          y={24}
        >
          {pricingTiers.map((t) => (
            <li
              key={t.name}
              /* The most-chosen tier flips to the dark palette: one card in
                 six breaking the grid is what gives the eye somewhere to land. */
              data-theme={t.highlight ? "ink" : undefined}
              className={cx("flex flex-col bg-bg p-[clamp(1.25rem,2.2vw,2rem)] text-fg", t.highlight && "relative")}
            >
              {t.highlight ? (
                <span className="absolute right-5 top-5 rounded-pill bg-accent-bright px-3 py-1.5 text-xs font-medium text-accent-fg">Most chosen</span>
              ) : null}

              <h3 className="display text-h3">{t.name}</h3>
              <p className="display mt-3 text-[clamp(1.5rem,2.2vw,2.1rem)] text-accent">{fromPrice(t.priceFrom)}</p>
              <p className="mt-4 text-sm text-muted">{t.summary}</p>

              <ul className="mt-6 flex-1 space-y-2.5 border-t border-line pt-5">
                {t.includes.map((inc) => (
                  <li key={inc} className="flex gap-3 text-sm">
                    <span aria-hidden="true" className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-pill bg-accent" />
                    <span className="text-muted">{inc}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
          {/* Filler: five tiers leave one empty cell in both the 2-column
              and 3-column layouts, and an empty cell shows the grid's
              hairline background as a grey block. */}
          <li aria-hidden="true" className="hidden items-end bg-surface-2 p-[clamp(1.25rem,2.2vw,2rem)] sm:flex">
            <p className="display text-h3 text-muted">Every estimate is written down, and it does not move.</p>
          </li>
        </Reveal>

        <Reveal className="mt-[clamp(2.5rem,6vh,4rem)]" y={24}>
          <EmiCalculator />
        </Reveal>

        <Reveal className="mt-[clamp(2.5rem,6vh,4rem)]" y={20}>
          <p className="text-sm font-medium">{copy.partnersLabel}</p>
          <ul className="mt-6 grid gap-x-8 gap-y-6 border-t border-line pt-7 sm:grid-cols-2 lg:grid-cols-4">
            {site.finance.partners.map((p) => (
              <li key={p.wordmark}>
                <p className="display text-h3">{p.wordmark}</p>
                <p className="mt-1.5 text-sm text-muted">{p.note}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <ul className="mt-10 space-y-1.5">
          {pricingNotes.map((n) => (
            <li key={n} className="text-sm text-muted">
              {n}
            </li>
          ))}
        </ul>
      </div>
    </ThemeSection>
  );
}
