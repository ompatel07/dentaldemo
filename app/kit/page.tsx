import type { Metadata } from "next";
import Link from "next/link";
import { CountUp } from "@/components/motion/CountUp";
import { DrawPath } from "@/components/motion/DrawPath";
import { emphasize } from "@/components/motion/Emphasis";
import { Magnetic } from "@/components/motion/Magnetic";
import { Marquee } from "@/components/motion/Marquee";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { PinnedHorizontal } from "@/components/motion/PinnedHorizontal";
import { Reveal } from "@/components/motion/Reveal";
import { ScrubText } from "@/components/motion/ScrubText";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TextRoll } from "@/components/motion/TextRoll";
import { ThemeSection } from "@/components/motion/ThemeSection";
import { site } from "@/content/site.config";
import { sections } from "@/content/sections";
import { treatments } from "@/content/treatments";
import { fromPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Design system",
  description: "Tokens, type scale and motion primitives for the Aurelle template.",
  robots: { index: false, follow: false },
};

const SWATCHES = [
  { name: "ivory", hex: "#F5F1EA", use: "Base background" },
  { name: "ink", hex: "#14161A", use: "Text, dark sections" },
  { name: "pearl", hex: "#E8E4DC", use: "Cards, surfaces" },
  { name: "sage", hex: "#8A9A86", use: "Calm accent" },
  { name: "gold", hex: "#B8945A", use: "Single premium accent" },
];

const TYPE_SCALE = [
  { token: "--fs-hero", cls: "display text-hero", sample: "Aa" },
  { token: "--fs-display", cls: "display text-display", sample: "Dentistry, crafted" },
  { token: "--fs-h1", cls: "display text-h1", sample: "Smiles worth keeping" },
  { token: "--fs-h2", cls: "display text-h2", sample: "Six things we do, properly" },
  { token: "--fs-lead", cls: "text-lead", sample: "A lead paragraph sets the tone of a section." },
  { token: "--fs-body", cls: "text-body", sample: "Body copy runs at a generous line height for long reading." },
  { token: "--fs-label", cls: "label", sample: "( 02 — TREATMENTS )" },
];

function Row({ chapter, title, children }: { chapter: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rule-t py-[clamp(2.5rem,6vh,5rem)]">
      <div className="grid-editorial">
        <p className="label col-span-12 mb-8 md:col-span-3 md:mb-0">
          ( {chapter} &mdash; {title} )
        </p>
        <div className="col-span-12 md:col-span-9">{children}</div>
      </div>
    </div>
  );
}

export default function KitPage() {
  return (
    <main id="main">
      <ThemeSection theme="paper" className="edge pt-[calc(var(--nav-h)+4rem)]">
        <p className="label">( 00 &mdash; Design system )</p>
        <SplitReveal
          as="h1"
          by="chars"
          trigger="mount"
          className="display mt-6 text-display"
          stagger={0.02}
          aria-label="The Atelier kit"
        >
          The Atelier kit
        </SplitReveal>
        <p className="measure mt-6 text-lead text-muted">
          Every token, primitive and motion component in the template, on one page. Scroll slowly: the page
          background is driven by section theming, and each block below is the real component, not a picture of one.
        </p>
        <p className="mt-10">
          <Link href="/" className="label underline underline-offset-8">
            Back to the site
          </Link>
        </p>

        <div className="mt-[clamp(3rem,8vh,6rem)]">
          <Row chapter="01" title="Palette">
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {SWATCHES.map((s) => (
                <li key={s.name}>
                  <div
                    className="aspect-4/5 w-full rounded-md border border-line"
                    style={{ background: s.hex }}
                  />
                  <p className="label mt-3 text-fg">{s.name}</p>
                  <p className="label mt-1">{s.hex}</p>
                  <p className="mt-2 text-sm text-muted">{s.use}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted">
              Components never reference these directly. They read semantic tokens (<code className="font-mono">--bg</code>,{" "}
              <code className="font-mono">--fg</code>, <code className="font-mono">--accent</code>) which{" "}
              <code className="font-mono">[data-theme]</code> re-points per section.
            </p>
          </Row>

          <Row chapter="02" title="Type scale">
            <ul className="space-y-8">
              {TYPE_SCALE.map((t) => (
                <li key={t.token} className="grid-editorial items-baseline">
                  <p className="label col-span-12 md:col-span-3">{t.token}</p>
                  <p className={`col-span-12 md:col-span-9 ${t.cls}`}>{t.sample}</p>
                </li>
              ))}
            </ul>
          </Row>

          <Row chapter="03" title="Buttons">
            <div className="flex flex-wrap items-center gap-5">
              <Magnetic>
                <button className="group/roll rounded-pill bg-fg px-8 py-4 text-bg" data-cursor-label="Book">
                  <TextRoll>
                    <span className="label !text-[var(--bg)]">{site.copy.bookCta}</span>
                  </TextRoll>
                </button>
              </Magnetic>

              <Magnetic strength={10}>
                <button className="group/roll rounded-pill border border-line-strong px-8 py-4">
                  <TextRoll>
                    <span className="label !text-[var(--fg)]">{site.copy.quizCta}</span>
                  </TextRoll>
                </button>
              </Magnetic>

              <span className="label" data-cursor-label="View">
                Hover me for the cursor label
              </span>
            </div>
            <p className="mt-6 text-sm text-muted">
              Magnetic lean, text roll-over on hover and focus, and a cursor that reads{" "}
              <code className="font-mono">data-cursor-label</code>. All three disable themselves on touch and under
              reduced motion.
            </p>
          </Row>

          <Row chapter="04" title="Counters">
            <p className="display text-display">
              <CountUp value={site.proof.reviewCount} suffix="+" />
            </p>
            <p className="label mt-3">Reviews, tweened on entry</p>
          </Row>
        </div>
      </ThemeSection>

      <ThemeSection theme="ink" className="section-y">
        <div className="edge">
          <p className="label">( 05 &mdash; Theme inversion )</p>
          <SplitReveal as="h2" className="display mt-6 max-w-[16ch] text-h1">
            The same components, ink palette, no component changes.
          </SplitReveal>
          <p className="measure mt-6 text-muted">
            This section sets <code className="font-mono">data-theme=&quot;ink&quot;</code>. Semantic tokens flip, and
            the page background eases with it as the section crosses the viewport midpoint.
          </p>
        </div>

        <div className="mt-16 rule-t rule-b py-6">
          <Marquee speed={70}>
            {site.affiliations.map((a) => (
              <span key={a.wordmark} className="flex items-center">
                <span className="display whitespace-nowrap px-8 text-h2">{a.wordmark}</span>
                <span className="text-accent">&mdash;</span>
              </span>
            ))}
          </Marquee>
          <p className="edge label mt-6">Marquee: speed follows scroll velocity, direction flips with scroll</p>
        </div>
      </ThemeSection>

      <ThemeSection theme="paper" className="section-y">
        <div className="edge">
          <p className="label">( 06 &mdash; Scrubbed manifesto text )</p>
          <ScrubText className="display mt-8 text-h2">
            {emphasize(sections.manifesto.body, sections.manifesto.emphasis)}
          </ScrubText>
        </div>

        <div className="edge mt-[clamp(4rem,10vh,8rem)] grid-editorial gap-y-10">
          <div className="col-span-12 md:col-span-5">
            <p className="label">( 07 &mdash; Parallax mask )</p>
            <p className="mt-6 text-muted">
              The mask holds layout, the image drifts inside it and is overscanned so no edge is ever exposed. Entry
              reveal is a clip-path wipe; the circle variant is used by the transformations section.
            </p>
          </div>
          <div className="col-span-12 md:col-span-7">
            <ParallaxImage image={sections.manifesto.portrait} ratio="4/5" sizes="(max-width: 768px) 100vw, 58vw" />
          </div>
        </div>
      </ThemeSection>

      <ThemeSection theme="sand" className="section-y">
        <div className="edge">
          <p className="label">( 08 &mdash; Drawn path )</p>
          <DrawPath className="mx-auto mt-10 max-w-3xl">
            <svg viewBox="0 0 800 160" className="w-full" fill="none" aria-hidden="true">
              <path
                data-draw
                d="M20 120 C 160 120, 180 40, 300 40 S 480 120, 600 120 S 760 60, 780 40"
                stroke="var(--accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path data-draw d="M20 140 H 780" stroke="var(--line-strong)" strokeWidth="1" />
            </svg>
          </DrawPath>
          <p className="label mt-6 text-center">DrawSVG, scrubbed to scroll</p>
        </div>
      </ThemeSection>

      <ThemeSection theme="paper" className="overflow-hidden">
        <div className="edge pt-[clamp(4rem,10vh,8rem)]">
          <p className="label">( 09 &mdash; Pinned horizontal )</p>
          <p className="measure mt-6 text-muted">
            Pins and translates on desktop; becomes a native snap carousel below 768px and under reduced motion.
          </p>
        </div>

        <PinnedHorizontal className="mt-12 h-screen" trackClassName="h-full items-center gap-6 px-[var(--gutter)]">
          {treatments.map((t) => (
            <article
              key={t.slug}
              className="w-[78vw] shrink-0 snap-center sm:w-[46vw] lg:w-[30vw]"
              data-cursor-label="Drag"
            >
              <ParallaxImage image={t.image} ratio="4/5" amount={6} sizes="(max-width: 768px) 78vw, 30vw" />
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <p className="label">{t.chapter}</p>
                <p className="label">{fromPrice(t.priceFrom)}</p>
              </div>
              <h3 className="display mt-2 text-h3">{t.name}</h3>
              <p className="mt-2 text-sm text-muted">{t.tagline}</p>
            </article>
          ))}
        </PinnedHorizontal>
      </ThemeSection>

      <ThemeSection theme="mint" className="section-y">
        <div className="edge">
          <p className="label">( 10 &mdash; Staggered reveal )</p>
          <Reveal className="mt-10 grid gap-px overflow-hidden rounded-md bg-line sm:grid-cols-3" stagger={0.06}>
            {["Noise-cancelling headphones", "The raised hand", "Weighted blanket"].map((item) => (
              <div key={item} className="bg-bg p-8">
                <p className="display text-h3">{item}</p>
                <p className="label mt-4">Included</p>
              </div>
            ))}
          </Reveal>
          <p className="mt-10 text-sm text-muted">
            End of the kit. Phase 2 adds the shell: preloader, nav, menu overlay, floating dock, footer and page
            transitions.
          </p>
        </div>
      </ThemeSection>
    </main>
  );
}
