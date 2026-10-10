import Image from "next/image";
import { ChapterLabel } from "@/components/ui/ChapterLabel";
import { Button } from "@/components/ui/Button";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { ThemeSection } from "@/components/motion/ThemeSection";
import { emphasize } from "@/components/motion/Emphasis";
import { HeroObject } from "@/components/hero/HeroObject";
import { has, site } from "@/content/site.config";
import { sections } from "@/content/sections";
import { telHref } from "@/lib/format";

const AVATARS = ["/images/patient-01.jpg", "/images/patient-02.jpg", "/images/patient-03.jpg"];

/** The words that travel round the molar's badge on phones. */
const RING = `${site.brand.tagline.replace(/\.$/, "")} · ${site.brand.name} · `.repeat(2);

/**
 * 01 - Hero.
 *
 * A dental site has to look like dentistry in the first second, so the hero
 * is built around a real patient mid-laugh rather than around an abstract
 * object. The 3D molar is the second voice: it overlaps the photograph's
 * corner and turns slowly, and the small live details around it - today's
 * opening hours, the review count - are what make the page feel like a
 * clinic that exists.
 *
 * Two layouts share one set of elements.
 *
 * Desktop: copy on the left, the photograph on the right at full height,
 * the molar over its lower-left corner. The headline is sized against
 * viewport height as well as width, so on a short laptop window the buttons
 * still sit above the fold.
 *
 * Phones: the photograph comes FIRST. Copy-first left a phone looking at a
 * page of text; here the first thing on screen is a face, with the review
 * chip and the molar (on a mint badge with the tagline turning round it)
 * hanging off the photograph's lower edge so the picture and the headline
 * overlap instead of stacking. The proof numbers close the block as a dark
 * card.
 *
 * Everything here is a CSS entrance on server-rendered markup (see Reveal),
 * so it paints before hydration and waits politely behind the preloader.
 */
export function Hero() {
  const { hero } = sections;

  return (
    <ThemeSection theme="paper" id="hero" className="relative overflow-hidden pt-[var(--nav-h)]">
      <div className="edge grid gap-x-[clamp(1.5rem,3vw,3.5rem)] gap-y-7 pb-[clamp(1.25rem,3.5vh,2.5rem)] pt-[clamp(0.5rem,2vh,2rem)] lg:h-[calc(100svh-var(--nav-h))] lg:max-h-[940px] lg:min-h-[600px] lg:grid-cols-12">
        {/* ---------------- copy ---------------- */}
        <div className="relative flex flex-col justify-between gap-y-[clamp(1.25rem,3vh,2.5rem)] max-lg:pt-3 lg:col-span-7">
          {/* On phones the label rides on the photograph instead. */}
          <Reveal trigger="mount" delay={0.05} y={12} className="max-lg:hidden">
            <ChapterLabel>{hero.label}</ChapterLabel>
          </Reveal>

          <h1 className="display text-[clamp(2.25rem,11.4vw,2.9rem)] sm:text-[clamp(3rem,8vw,4.75rem)] lg:text-[clamp(2.75rem,min(6vw,12.6svh),7.5rem)]">
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

            {/* Full-width on phones: two thumb-sized targets, one above the
                other, rather than two pills of slightly different widths. */}
            <Reveal trigger="mount" delay={0.6} className="flex flex-wrap items-center gap-3 max-sm:[&>span]:w-full">
              <Button href="/#book" variant="accent" size="lg" cursorLabel="Book" className="max-sm:w-full max-sm:justify-between">
                {hero.primaryCta}
              </Button>
              <Button href="/#quiz" variant="outline" size="lg" cursorLabel="Quiz" className="max-sm:w-full">
                {hero.secondaryCta}
              </Button>
            </Reveal>

            {/* Today's hours. On desktop this lives on the photograph. */}
            <Reveal trigger="mount" delay={0.66} className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm font-medium lg:hidden">
              <OpenStatus />
              {has.emergencyPhone ? (
                <a href={telHref(site.contact.emergencyPhone)} className="text-muted underline-offset-4 hover:underline">
                  Emergency: {site.contact.emergencyPhone}
                </a>
              ) : null}
            </Reveal>
          </div>

          {/* Proof strip: numbers, not adjectives. A dark card on phones, a
              ruled row on desktop. */}
          <Reveal trigger="mount" delay={0.72}>
            <dl className="grid grid-cols-3 max-lg:rounded-[var(--r-lg)] max-lg:bg-[var(--ink)] max-lg:px-5 max-lg:py-5 lg:border-t lg:border-line lg:pt-5">
              {hero.stats.map((stat) => (
                <div key={stat.label} className="pr-3">
                  <dd className="display text-[clamp(1.35rem,6.4vw,1.75rem)] max-lg:text-[var(--mint-strong)] sm:text-[2rem] lg:text-[clamp(1.6rem,2.6vw,2.6rem)]">
                    <CountUp value={stat.value} suffix={stat.suffix} duration={1.8} />
                  </dd>
                  <dt className="mt-1.5 text-sm text-muted max-lg:text-[color-mix(in_oklab,var(--paper)_74%,var(--ink))]">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* ---------------- picture ---------------- */}
        <Reveal trigger="mount" delay={0.25} y={30} className="relative min-h-0 max-lg:order-first lg:col-span-5">
          <div className="relative h-[min(46svh,420px)] overflow-hidden rounded-[var(--r-xl)] bg-surface sm:h-[min(56svh,560px)] lg:h-full">
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
              className="object-cover object-[50%_32%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/55 via-transparent to-transparent" />

            {/* Where you are, on phones - the desktop label sits above the headline. */}
            <p className="absolute left-3 top-3 flex items-center gap-2 rounded-pill bg-[var(--paper)]/92 py-2 pl-3 pr-3.5 text-[0.8125rem] font-medium text-[var(--ink)] backdrop-blur-md lg:hidden">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-pill bg-[var(--coral)]" />
              {hero.label}
            </p>

            {/* What the photograph is of. */}
            <p className="absolute right-4 top-4 rounded-pill bg-[var(--ink)]/45 px-3.5 py-2 text-[0.8125rem] font-medium text-[var(--paper)] backdrop-blur-md max-sm:hidden">
              {hero.photoCaption}
            </p>

            <div className="absolute inset-x-4 bottom-4 flex justify-end max-lg:hidden">
              <div className="rounded-[var(--r-md)] bg-[var(--paper)]/92 px-4 py-3 text-[var(--ink)] backdrop-blur-md">
                <p className="text-sm font-medium">
                  <OpenStatus />
                </p>
                {has.emergencyPhone ? (
                  <a
                    href={telHref(site.contact.emergencyPhone)}
                    className="mt-1.5 block text-sm text-[color-mix(in_oklab,var(--ink)_66%,var(--paper))] underline-offset-4 hover:underline"
                  >
                    Emergency: {site.contact.emergencyPhone}
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          {/* Review chip. Phones: hanging off the photograph's lower-left
              edge. Desktop: floating by its top-left corner. */}
          <div className="float-y absolute bottom-0 left-3 flex translate-y-1/2 items-center gap-3 rounded-pill bg-[var(--paper)] py-2 pl-2 pr-5 shadow-[var(--shadow-lift)] max-sm:pr-4 lg:-left-6 lg:bottom-auto lg:top-6 lg:translate-y-0">
            <span className="flex -space-x-2.5">
              {AVATARS.map((src, i) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={36}
                  height={36}
                  /* Two faces on a phone: the chip shares its edge with the badge. */
                  className={"h-9 w-9 rounded-pill border-2 border-[var(--paper)] object-cover" + (i === 2 ? " max-sm:hidden" : "")}
                />
              ))}
            </span>
            <span className="leading-tight text-[var(--ink)]">
              <span className="block text-sm font-semibold">
                {site.proof.rating} <span className="text-[var(--coral)]">★</span>
                <span className="sr-only"> out of 5</span>
              </span>
              <span className="block text-xs text-[color-mix(in_oklab,var(--ink)_66%,var(--paper))]">
                {site.proof.reviewCount.toLocaleString(site.locale)} <span className="max-sm:hidden">{site.proof.reviewSource} </span>reviews
              </span>
            </span>
          </div>

          {/* The molar. Phones: on a mint badge over the photograph's
              lower-right edge, beside the short first line of the headline.
              Desktop: bare, over the lower-left corner. One element, placed
              twice by CSS, so only one WebGL context ever exists. */}
          <div className="pointer-events-none absolute -right-[2%] bottom-0 aspect-square w-[44%] max-w-[230px] translate-y-[42%] lg:-left-[31%] lg:right-auto lg:bottom-[-6%] lg:w-[56%] lg:max-w-none lg:translate-y-0">
            <span aria-hidden="true" className="absolute inset-[7%] rounded-full bg-[var(--mint)] shadow-[var(--shadow-lift)] lg:hidden" />
            <svg viewBox="0 0 200 200" aria-hidden="true" className="spin-slow absolute -inset-[5%] h-[110%] w-[110%] lg:hidden">
              <defs>
                <path id="hero-ring" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
              </defs>
              <text className="fill-[var(--ink)] font-mono text-[11.5px] font-medium uppercase">
                <textPath href="#hero-ring" textLength="546" lengthAdjust="spacing">
                  {RING}
                </textPath>
              </text>
            </svg>
            <HeroObject className="absolute inset-[6%] lg:inset-0" />
          </div>
        </Reveal>
      </div>
    </ThemeSection>
  );
}
