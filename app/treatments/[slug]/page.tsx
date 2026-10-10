import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChapterLabel } from "@/components/ui/ChapterLabel";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ThemeSection } from "@/components/motion/ThemeSection";
import { CompareSlider } from "@/components/sections/CompareSlider";
import { TransitionLink } from "@/components/shell/PageTransition";
import { treatments, treatmentBySlug } from "@/content/treatments";
import { casesByTreatment } from "@/content/cases";
import { sections } from "@/content/sections";
import { site } from "@/content/site.config";
import { formatCurrency, fromPrice, monthlyEmi } from "@/lib/format";
import { pad2 } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const treatment = treatmentBySlug(slug);
  if (!treatment) return {};

  const description = `${treatment.tagline} ${site.copy.priceFrom} ${formatCurrency(treatment.priceFrom)} at ${site.brand.name}, ${site.contact.address.city}.`;

  return {
    title: treatment.name,
    description,
    alternates: { canonical: `/treatments/${treatment.slug}` },
    openGraph: {
      title: `${treatment.name} - ${site.brand.name}`,
      description,
      url: `${site.seo.url}/treatments/${treatment.slug}`,
      images: [{ url: treatment.image.src, width: treatment.image.width, height: treatment.image.height }],
    },
  };
}

/**
 * The treatment detail template.
 *
 * One file serves all six treatments, and every word of it comes from
 * content/treatments.ts - so a seventh treatment is a data edit, not a page
 * build. Its FAQ is emitted as FAQPage schema from the same array the
 * accordion renders.
 */
export default async function TreatmentPage({ params }: Params) {
  const { slug } = await params;
  const treatment = treatmentBySlug(slug);
  if (!treatment) notFound();

  const relatedCase = casesByTreatment(treatment.slug)[0];
  const index = treatments.findIndex((t) => t.slug === treatment.slug);
  const next = treatments[(index + 1) % treatments.length];
  const emi = monthlyEmi(treatment.priceFrom, site.finance.defaultMonths, site.finance.annualRatePct);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: treatment.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const facts = [
    { label: "Price", value: fromPrice(treatment.priceFrom), strong: true },
    { label: "Appointment", value: treatment.duration },
    { label: "Course", value: treatment.sessions },
    { label: site.copy.emiNote, value: `${formatCurrency(Math.round(emi))} / mo` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />

      <main id="main">
        {/* ---------------- Hero ---------------- */}
        <ThemeSection theme="paper" className="pt-[var(--nav-h)]">
          <div className="edge grid gap-x-[clamp(1.5rem,3vw,3.5rem)] gap-y-8 pb-[clamp(1.5rem,4vh,3rem)] pt-[clamp(1rem,3vh,2rem)] lg:min-h-[min(calc(100svh-var(--nav-h)),820px)] lg:grid-cols-12">
            <div className="flex flex-col justify-between gap-y-8 lg:col-span-7">
              <Reveal trigger="mount" y={12} className="flex flex-wrap items-center gap-2">
                <TransitionLink href="/#treatments" className="text-sm font-medium text-muted hover:text-accent">
                  ← {sections.treatments.cta}
                </TransitionLink>
                <ChapterLabel chapter={treatment.chapter}>{sections.treatments.label}</ChapterLabel>
              </Reveal>

              <div>
                <Reveal as="h1" trigger="mount" delay={0.1} className="display text-hero">
                  {treatment.name}
                </Reveal>
                <Reveal trigger="mount" delay={0.25} className="mt-5 max-w-[40rem]">
                  <p className="text-lead text-muted">{treatment.intro}</p>
                </Reveal>
                <Reveal trigger="mount" delay={0.35} className="mt-7 flex flex-wrap gap-3">
                  <Button href="/#book" variant="accent" size="lg" cursorLabel="Book">
                    {site.copy.bookCta}
                  </Button>
                  <Button href="/#quiz" variant="outline" size="lg" cursorLabel="Quiz">
                    {site.copy.quizCta}
                  </Button>
                </Reveal>
              </div>

              <Reveal trigger="mount" delay={0.45}>
                <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--r-lg)] border border-line bg-line md:grid-cols-4">
                  {facts.map((f) => (
                    <div key={f.label} className="bg-surface-2 p-4">
                      <dt className="text-sm text-muted">{f.label}</dt>
                      <dd className={`display mt-1.5 text-[clamp(1.05rem,1.4vw,1.4rem)] ${f.strong ? "text-accent" : ""}`}>{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            <Reveal trigger="mount" delay={0.2} y={30} className="relative min-h-[320px] lg:col-span-5">
              <div className="relative h-full min-h-[320px] overflow-hidden rounded-[var(--r-xl)] bg-surface">
                <Image src={treatment.image.src} alt={treatment.image.alt} fill priority sizes="(max-width: 1024px) 92vw, 40vw" className="object-cover" />
              </div>
            </Reveal>
          </div>
        </ThemeSection>

        {/* ---------------- What it is ---------------- */}
        <ThemeSection theme="paper" className="section-y">
          <div className="edge grid-editorial items-start gap-y-8">
            <div className="col-span-12 lg:col-span-6">
              <Reveal y={12}>
                <ChapterLabel>What it is</ChapterLabel>
              </Reveal>
              <SplitReveal as="h2" className="display mt-6 max-w-[16ch] text-h1">
                {treatment.tagline}
              </SplitReveal>
            </div>
            <Reveal className="col-span-12 lg:col-span-5 lg:col-start-8 lg:pt-14" y={20}>
              <p className="text-lead text-muted">{treatment.what}</p>
            </Reveal>
          </div>
        </ThemeSection>

        {/* ---------------- Process ---------------- */}
        <ThemeSection theme="sand" className="section-y">
          <div className="edge">
            <Reveal y={12}>
              <ChapterLabel>How it goes</ChapterLabel>
            </Reveal>

            <Reveal as="ol" className="mt-8 grid gap-[clamp(0.75rem,1.4vw,1.5rem)] sm:grid-cols-2 lg:grid-cols-4" stagger={0.08} y={24}>
              {treatment.process.map((step, i) => (
                <li key={step.title} className="flex flex-col rounded-[var(--r-lg)] border border-line bg-surface p-[clamp(1.1rem,1.8vw,1.75rem)]">
                  <span className="grid h-9 w-9 place-items-center rounded-pill bg-fg font-mono text-xs font-medium text-bg">{pad2(i + 1)}</span>
                  <h3 className="display mt-8 text-h3">{step.title}</h3>
                  <p className="mt-3 text-sm text-muted">{step.body}</p>
                </li>
              ))}
            </Reveal>

            <Reveal className="mt-[clamp(0.75rem,1.4vw,1.5rem)]" y={20}>
              <div data-theme="ink" className="grid gap-8 rounded-[var(--r-lg)] bg-bg p-[clamp(1.25rem,2.4vw,2.5rem)] text-fg lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div>
                  <p className="text-sm font-medium text-accent">What the price includes</p>
                  <ul className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                    {treatment.includes.map((inc) => (
                      <li key={inc} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-pill bg-accent-bright" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:text-right">
                  <p className="display text-h1 text-accent">{fromPrice(treatment.priceFrom)}</p>
                  <p className="mt-2 text-sm text-muted">or about {formatCurrency(Math.round(emi))} a month</p>
                </div>
              </div>
            </Reveal>
          </div>
        </ThemeSection>

        {/* ---------------- Before / after ---------------- */}
        {relatedCase ? (
          <ThemeSection theme="paper" className="section-y">
            <div className="edge grid-editorial items-center gap-y-8">
              <div className="col-span-12 lg:col-span-4">
                <Reveal y={12}>
                  <ChapterLabel>{sections.transformations.label}</ChapterLabel>
                </Reveal>
                <SplitReveal as="h2" className="display mt-6 max-w-[12ch] text-h1">
                  {relatedCase.label}
                </SplitReveal>
                <Reveal className="mt-6" y={16}>
                  <p className="text-sm font-medium text-accent">
                    {relatedCase.treatment} · {relatedCase.duration}
                  </p>
                  <p className="mt-3 max-w-[40ch] text-muted">{relatedCase.summary}</p>
                </Reveal>
              </div>
              <Reveal className="col-span-12 lg:col-span-8" y={26}>
                <CompareSlider item={relatedCase} caption={false} />
              </Reveal>
            </div>
          </ThemeSection>
        ) : null}

        {/* ---------------- FAQ ---------------- */}
        <ThemeSection theme="sand" className="section-y">
          <div className="edge grid-editorial items-start gap-y-8">
            <div className="col-span-12 lg:col-span-4">
              <Reveal y={12}>
                <ChapterLabel>{sections.faq.label}</ChapterLabel>
              </Reveal>
              <SplitReveal as="h2" className="display mt-6 max-w-[12ch] text-h1">
                {`${treatment.name}, answered.`}
              </SplitReveal>
            </div>
            <Reveal className="col-span-12 lg:col-span-7 lg:col-start-6" y={18}>
              <Accordion items={treatment.faqs} numbered={false} />
            </Reveal>
          </div>
        </ThemeSection>

        {/* ---------------- Next ---------------- */}
        <ThemeSection theme="paper" className="px-[clamp(0.75rem,1.6vw,1.5rem)] pb-[clamp(0.75rem,1.6vw,1.5rem)]">
          <TransitionLink
            href={`/treatments/${next.slug}`}
            data-theme="ink"
            data-cursor-label="Next"
            className="group/next relative isolate block overflow-hidden rounded-[var(--r-xl)] bg-bg text-fg"
          >
            <Image src={next.image.src} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-40 transition-transform duration-[1200ms] ease-[var(--ease-expo)] group-hover/next:scale-[1.04]" loading="lazy" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[var(--ink)] via-[var(--ink)]/75 to-transparent" />
            <div className="mx-auto w-full max-w-[var(--max-w)] px-[clamp(1.25rem,4vw,4.5rem)] py-[clamp(3rem,10vh,7rem)]">
              <p className="text-sm font-medium text-accent">Next treatment</p>
              <p className="display mt-4 text-hero">{next.name}</p>
              <p className="mt-4 max-w-[40ch] text-lead text-muted">{next.tagline}</p>
            </div>
          </TransitionLink>
        </ThemeSection>
      </main>
    </>
  );
}
