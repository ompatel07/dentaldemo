import Image from "next/image";
import { ChapterLabel } from "@/components/ui/ChapterLabel";
import { Button } from "@/components/ui/Button";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { ThemeSection } from "@/components/motion/ThemeSection";
import { emphasize } from "@/components/motion/Emphasis";
import { HeroObject } from "@/components/hero/HeroObject";
import { site } from "@/content/site.config";
import { sections } from "@/content/sections";
import { telHref } from "@/lib/format";

const AVATARS = ["/images/patient-01.jpg", "/images/patient-02.jpg", "/images/patient-03.jpg"];

/**
 * 01 - Hero.
 *
 * A dental site has to look like dentistry in the first second, so the hero
 * is built around a real patient mid-laugh rather than around an abstract
 * object. The 3D molar is the second voice: it overlaps the photograph's
 * corner and turns slowly, and the small live details around it - today's
 * opening hours, the review count, the emergency line - are what make the
 * page feel like a clinic that exists.
 *
 * The headline is sized against viewport height as well as width, so on a
 * short laptop window the buttons still sit above the fold.
 *
 * Everything here is a CSS entrance on server-rendered markup (see Reveal),
 * so it paints before hydration and waits politely behind the preloader.
 */
export function Hero() {
  const { hero } = sections;

  return (
    <ThemeSection theme="paper" id="hero" className="relative overflow-hidden pt-[var(--nav-h)]">
      <div className="edge grid gap-x-[clamp(1.5rem,3vw,3.5rem)] gap-y-7 pb-[clamp(1.25rem,3.5vh,2.5rem)] pt-[clamp(0.75rem,2vh,2rem)] lg:h-[calc(100svh-var(--nav-h))] lg:max-h-[940px] lg:min-h-[600px] lg:grid-cols-12">
        {/* ---------------- copy ---------------- */}
        {/* On phones the copy takes only the room it needs, so the top of the
            photograph is already in the first screen. Stretching it to a full
            viewport left three empty bands and no picture. */}
        <div className="flex flex-col justify-between gap-y-[clamp(1.25rem,3vh,2.5rem)] lg:col-span-7">
          <Reveal trigger="mount" delay={0.05} y={12}>
            <ChapterLabel>{hero.label}</ChapterLabel>
          </Reveal>

          <h1 className="display text-[clamp(2.75rem,min(6vw,12.6svh),7.5rem)]">
            {hero.headlineLines.map((line, i) => (
              <Reveal key={line} as="span" trigger="mount" delay={0.12 + i * 0.1} className="block">
                {emphasize(line, hero.emphasis)}
              </Reveal>
            ))}
          </h1>

          <div className="flex flex-col gap-y-[clamp(1rem,2.6vh,1.75rem)]">
            <Reveal trigger="mount" delay={0.5} className="max-w-[40rem]">
              <p className="text-lead text-muted">{emphasize(hero.body, hero.bodyEmphasis)}</p>
            </Reveal>

            <Reveal trigger="mount" delay={0.6} className="flex flex-wrap items-center gap-3">
              <Button href="/#book" variant="accent" size="lg" cursorLabel="Book">
                {hero.primaryCta}
              </Button>
              <Button href="/#quiz" variant="outline" size="lg" cursorLabel="Quiz">
                {hero.secondaryCta}
              </Button>
            </Reveal>
          </div>

          {/* Proof strip: numbers, not adjectives. */}
          <Reveal trigger="mount" delay={0.72}>
            <dl className="grid grid-cols-3 border-t border-line pt-5">
              {hero.stats.map((stat) => (
                <div key={stat.label} className="pr-4">
                  <dd className="display text-[clamp(1.6rem,2.6vw,2.6rem)]">
                    <CountUp value={stat.value} suffix={stat.suffix} duration={1.8} />
                  </dd>
                  <dt className="mt-1.5 text-sm text-muted">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* ---------------- picture ---------------- */}
        <Reveal trigger="mount" delay={0.25} y={30} className="relative min-h-0 lg:col-span-5">
          <div className="relative h-[min(72svh,560px)] overflow-hidden rounded-[var(--r-xl)] bg-surface lg:h-full">
            <Image
              src="/images/hero-portrait.jpg"
              alt="A patient laughing, a year after her aligner treatment"
              fill
              /* In the first screen at every width. Eager and high priority
                 rather than `priority`: the tag is in the first kilobytes
                 of the document, so a preload on top of it only competes
                 with the stylesheet and measured slower. */
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 1024px) 92vw, 40vw"
              className="object-cover object-[50%_35%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/55 via-transparent to-transparent" />

            {/* What the photograph is of. Dropped on phones, where the review chip
                needs the same corner. */}
            <p className="absolute right-4 top-4 rounded-pill max-sm:hidden bg-[var(--ink)]/45 px-3.5 py-2 text-[0.8125rem] font-medium text-[var(--paper)] backdrop-blur-md">
              {hero.photoCaption}
            </p>

            <div className="absolute inset-x-4 bottom-4 flex justify-end">
              <div className="rounded-[var(--r-md)] bg-[var(--paper)]/92 px-4 py-3 text-[var(--ink)] backdrop-blur-md">
                <p className="text-sm font-medium">
                  <OpenStatus />
                </p>
                <a
                  href={telHref(site.contact.emergencyPhone)}
                  className="mt-1.5 block text-sm text-[color-mix(in_oklab,var(--ink)_66%,var(--paper))] underline-offset-4 hover:underline"
                >
                  Emergency: {site.contact.emergencyPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Review chip, pinned to the frame's top-left corner. */}
          <div className="float-y absolute -left-3 top-6 flex items-center gap-3 rounded-pill bg-[var(--paper)] py-2 pl-2 pr-5 shadow-[var(--shadow-lift)] sm:-left-6">
            <span className="flex -space-x-2.5">
              {AVATARS.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-pill border-2 border-[var(--paper)] object-cover"
                />
              ))}
            </span>
            <span className="leading-tight text-[var(--ink)]">
              <span className="block text-sm font-semibold">
                {site.proof.rating} <span className="text-[var(--coral)]">★</span>
                <span className="sr-only"> out of 5</span>
              </span>
              <span className="block text-xs text-[color-mix(in_oklab,var(--ink)_66%,var(--paper))]">
                {site.proof.reviewCount.toLocaleString(site.locale)} {site.proof.reviewSource} reviews
              </span>
            </span>
          </div>

          {/* The molar, overlapping the frame's lower-left corner. Desktop only. */}
          <HeroObject className="pointer-events-none absolute -left-[31%] bottom-[-6%] hidden aspect-square w-[56%] lg:block" />
        </Reveal>
      </div>
    </ThemeSection>
  );
}
