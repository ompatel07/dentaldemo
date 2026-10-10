"use client";

import { useMemo, useState } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { Button } from "@/components/ui/Button";
import { pricingTiers } from "@/content/pricing";
import { site } from "@/content/site.config";
import { sections } from "@/content/sections";
import { formatCurrency, monthlyEmi } from "@/lib/format";

/**
 * The EMI calculator - the only interactive part of the pricing section, so
 * the only part of it that hydrates.
 *
 * It is honest about two things the industry usually blurs: it applies the
 * real no-cost window from config rather than implying every term is
 * interest-free, and it shows total payable beside the monthly figure.
 */
export function EmiCalculator() {
  const { pricing: copy } = sections;
  const { finance } = site;

  const defaultTier = Math.max(0, pricingTiers.findIndex((t) => t.highlight));
  const [tierIndex, setTierIndex] = useState(defaultTier);
  const [months, setMonths] = useState<number>(finance.defaultMonths);

  const tier = pricingTiers[tierIndex];
  const principal = tier.emiPreset ?? tier.priceFrom;

  const { monthly, total, zeroCost } = useMemo(() => {
    const isZeroCost = months <= finance.zeroCostUpTo;
    const m = monthlyEmi(principal, months, isZeroCost ? 0 : finance.annualRatePct);
    return { monthly: m, total: m * months, zeroCost: isZeroCost };
  }, [finance.annualRatePct, finance.zeroCostUpTo, months, principal]);

  return (
    <div className="grid-editorial items-start gap-y-10 rounded-mask border border-line bg-bg p-[clamp(1.5rem,3vw,3rem)]">
      <div className="col-span-12 lg:col-span-5">
        <h3 className="display text-h2">{copy.emiTitle}</h3>
        <p className="mt-4 max-w-[40ch] text-muted">{copy.emiBody}</p>

        <div className="mt-9">
          <label htmlFor="emi-treatment" className="label">
            {copy.emiTreatmentLabel}
          </label>
          <select
            id="emi-treatment"
            value={tierIndex}
            onChange={(e) => setTierIndex(Number(e.target.value))}
            className="mt-3 w-full rounded-pill border border-line-strong bg-transparent px-5 py-3.5 text-body focus-visible:border-accent"
          >
            {pricingTiers.map((t, i) => (
              <option key={t.name} value={i}>
                {t.name} &mdash; {formatCurrency(t.emiPreset ?? t.priceFrom)}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-7">
          <div className="flex items-baseline justify-between">
            <label htmlFor="emi-months" className="label">
              {copy.emiMonthsLabel}
            </label>
            <output htmlFor="emi-months" className="font-mono text-sm">
              {months}
            </output>
          </div>

          <input
            id="emi-months"
            type="range"
            min={finance.monthOptions[0]}
            max={finance.monthOptions[finance.monthOptions.length - 1]}
            step={3}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="mt-4 w-full accent-[var(--accent)]"
            aria-describedby="emi-result"
          />

          <div aria-hidden="true" className="mt-3 flex justify-between">
            {finance.monthOptions.map((m) => (
              <span key={m} className="label">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-7 lg:pl-[clamp(1rem,4vw,4rem)]">
        <div className="rounded-md border border-line bg-surface p-[clamp(1.25rem,2.5vw,2rem)]">
          <p className="label">{copy.emiResultLabel}</p>

          <p id="emi-result" className="display mt-3 text-[clamp(2.5rem,6vw,4.5rem)] leading-none">
            <span className="text-accent">{site.currency.symbol}</span>
            <CountUp
              value={Math.round(monthly)}
              trigger="value"
              duration={0.7}
              locale={site.locale}
              className="tabular-nums"
            />
            <span className="label ml-3 align-middle">/ month</span>
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6">
            <div>
              <dt className="label">Treatment</dt>
              <dd className="mt-2 font-mono text-sm">{formatCurrency(principal)}</dd>
            </div>
            <div>
              <dt className="label">Total payable</dt>
              <dd className="mt-2 font-mono text-sm">{formatCurrency(Math.round(total))}</dd>
            </div>
            <div>
              <dt className="label">Term</dt>
              <dd className="mt-2 font-mono text-sm">{months} months</dd>
            </div>
            <div>
              <dt className="label">Interest</dt>
              <dd className="mt-2 font-mono text-sm text-accent">
                {zeroCost ? "No-cost EMI" : `${finance.annualRatePct}% p.a.`}
              </dd>
            </div>
          </dl>

          <p className="mt-6 text-sm text-muted">{finance.disclaimer}</p>

          <div className="mt-7">
            <Button href="/#book" size="sm" cursorLabel="Book">
              {sections.hero.primaryCta}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
