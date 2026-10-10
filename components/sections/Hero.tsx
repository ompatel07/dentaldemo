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
import { cx } from "@/lib/utils";

const AVATARS = ["/images/patient-01.jpg", "/images/patient-02.jpg", "/images/patient-03.jpg"];

/** The words that travel round the molar's badge on phones. */
const RING = `${site.brand.tagline.replace(/\.$/, "")} · ${site.brand.name} · `.repeat(2);

/** The overlapping patient portraits beside the rating. */
function Faces({ className }: { className: string }) {
  return (
    <span className="flex -space-x-2.5">
      {AVATARS.map((src) => (
        <Image key={src} src={src} alt="" width={36} height={36} className={cx("rounded-pill border-2 border-[var(--paper)] object-cover", className)} />
      ))}
    </span>
  );
}

/**
 * 01 - Hero.
 *
 * A dental site has to look like dentistry in the first second, so the hero
 * is built around the chair itself - the room a visitor is actually deciding
 * whether to walk into. The 3D molar is the second voice, and the small live
 * details around it (today's hours, the review count) are what make the page
 * feel like a clinic that exists.
 *
 * The label, headline, copy, proof strip and photograph are all direct
 * children of ONE grid, and the two layouts are just two ways of placing
 * them:
 *
 * Desktop - copy stacked down the left seven columns, the photograph filling
 * the right five at full height, the molar over its lower-left corner. The
 * headline is sized against viewport height as well as width, so on a short
 * laptop window the buttons still sit above the fold.
 *
 * Phones - the photograph and the headline share the first grid cell. The
 * picture fills it; the headline sits at its foot in white over a dark
 * fade, so the first screen is one tall image with the words on it, the
 * molar turning on a stamped badge at its corner, and the copy, buttons and
 * proof numbers beneath. Because the headline is a real grid item aligned to
 * the bottom of the cell, it can run to any number of lines and still sit
 * inside the photograph.
 *
 * Everything here is a CSS entrance on server-rendered markup (see Reveal),
 * so it paints before hydration and waits politely behind the preloader.
 */
export function Hero() {
  const { hero } = sections;

  return (
    <ThemeSection theme="paper" id="hero" className="relative overflow-hidden pt-[var(--nav-h)]">
      <div className="edge grid grid-cols-1 gap-x-[clamp(1.5rem,3vw,3.5rem)] gap-y-6 pb-[clamp(1.25rem,3.5vh,2.5rem)] pt-[clamp(0.5rem,2vh,2rem)] lg:h-[calc(100svh-var(--nav-h))] lg:max-h-[940px] lg:min-h-[600px] lg:grid-cols-12 lg:content-between lg:gap-y-7">
        {/* ---------------- label (on phones it rides on the photograph) ---------------- */}
        <Reveal trigger="mount" delay={0.05} y={12} className="max-lg:hidden lg:col-span-7 lg:col-start-1 lg:row-start-1">
          <ChapterLabel>{hero.label}</ChapterLabel>
        </Reveal>

        {/* ---------------- headline ---------------- */}
        <h1 className="display relative z-10 col-start-1 row-start-1 self-end px-5 pb-6 text-[clamp(2rem,10vw,2.75rem)] text-[var(--paper)] max-lg:[text-shadow:0_1px_28px_rgb(11_31_28/0.6)] max-lg:[&_em]:text-[var(--mint-strong)] sm:px-8 sm:pb-9 sm:text-[clamp(3rem,8vw,4.75rem)] lg:col-span-7 lg:row-start-2 lg:self-auto lg:p-0 lg:text-[clamp(2.75rem,min(6vw,12.6svh),7.5rem)] lg:text-fg">
          {hero.headlineLines.map((line, i) => (
            <Reveal key={line} as="span" trigger="mount" delay={0.12 + i * 0.1} className="block">
              {emphasize(line, hero.emphasis)}
            </Reveal>
          ))}
        </h1>

        {/* ---------------- copy and actions ---------------- */}
        <div className="row-start-2 flex flex-col gap-y-[clamp(1rem,2.6vh,1.75rem)] lg:col-span-7 lg:col-start-1 lg:row-start-3">
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

          {/* Reviews and today's hours. On desktop both live on the photograph. */}
          <Reveal trigger="mount" delay={0.66} className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 lg:hidden">
            <p className="flex items-center gap-3 text-sm">
              <Faces className="h-8 w-8" />
              <span>
                <span className="font-semibold">{site.proof.rating}</span> <span className="text-[var(--coral)]">★</span>
                <span className="sr-only"> out of 5,</span>
                <span className="text-muted">
                  {" "}
                  · {site.proof.reviewCount.toLocaleString(site.locale)} reviews
                </span>
              </span>
            </p>
            <p className="text-sm font-medium">
              <OpenStatus />
            </p>
            {has.emergencyPhone ? (
              <a href={telHref(site.contact.emergencyPhone)} className="w-full text-sm text-muted underline-offset-4 hover:underline">
                Emergency: {site.contact.emergencyPhone}
              </a>
            ) : null}
          </Reveal>
        </div>

        {/* ---------------- proof strip: a dark card on phones, a ruled row on desktop ---------------- */}
        <Reveal trigger="mount" delay={0.72} className="row-start-3 lg:col-span-7 lg:col-start-1 lg:row-start-4">
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

        {/* ---------------- picture ---------------- */}
        <Reveal trigger="mount" delay={0.25} y={30} className="relative col-start-1 row-start-1 min-h-0 lg:col-span-5 lg:col-start-8 lg:row-span-4 lg:row-start-1">
          <div className="relative h-[min(64svh,560px)] min-h-[400px] overflow-hidden rounded-[var(--r-xl)] bg-surface sm:h-[min(62svh,680px)] lg:h-full lg:min-h-0">
            <Image
              src="/images/hero-chair.jpg"
              alt="The treatment chair in its room, lamp raised, between patients"
              fill
              /* In the first screen at every width. Eager and high priority
                 rather than `priority`: the tag is in the first kilobytes
                 of the document, so a preload on top of it only competes
                 with the stylesheet and measured slower. */
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 1024px) 92vw, 40vw"
              className="object-cover object-[50%_60%] lg:object-[50%_72%]"
            />
            {/* Phones: a deep fade for the headline to sit on. Desktop: a light one. */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] from-0% via-[var(--ink)]/72 via-28% to-transparent to-62% lg:hidden" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/55 via-transparent to-transparent max-lg:hidden" />

            {/* What this is, on phones - the desktop label sits above the headline. */}
            <p className="absolute left-3 top-3 flex items-center gap-2 rounded-pill bg-[var(--paper)]/92 py-2 pl-3 pr-3.5 text-[0.8125rem] font-medium text-[var(--ink)] backdrop-blur-md lg:hidden">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-pill bg-[var(--coral)]" />
              {hero.label}
            </p>

            {/* What the photograph is of. */}
            <p className="absolute right-4 top-4 rounded-pill bg-[var(--ink)]/45 px-3.5 py-2 text-[0.8125rem] font-medium text-[var(--paper)] backdrop-blur-md max-lg:hidden">
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

          {/* Review chip, floating by the frame's top-left corner. Desktop
              only - phones carry the rating in the copy instead. */}
          <div className="float-y absolute -left-6 top-6 flex items-center gap-3 rounded-pill bg-[var(--paper)] py-2 pl-2 pr-5 shadow-[var(--shadow-lift)] max-lg:hidden">
            <Faces className="h-9 w-9" />
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

          {/* The molar. Phones: a stamped badge over the photograph's top
              corner, tagline turning round it. Desktop: bare, over the
              lower-left corner. One element, placed twice by CSS, so only
              one WebGL context ever exists. */}
          <div className="pointer-events-none absolute -right-2 -top-2 aspect-square w-[36%] max-w-[200px] lg:-left-[31%] lg:bottom-[-6%] lg:right-auto lg:top-auto lg:w-[56%] lg:max-w-none">
            <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[var(--paper)] shadow-[var(--shadow-lift)] lg:hidden" />
            <span aria-hidden="true" className="absolute inset-[17%] rounded-full bg-[var(--mint)] lg:hidden" />
            <svg viewBox="0 0 200 200" aria-hidden="true" className="spin-slow absolute inset-0 h-full w-full lg:hidden">
              <defs>
                <path id="hero-ring" d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0" />
              </defs>
              <text className="fill-[var(--ink)] font-mono text-[12.5px] font-medium uppercase">
                <textPath href="#hero-ring" textLength="520" lengthAdjust="spacing">
                  {RING}
                </textPath>
              </text>
            </svg>
            <HeroObject className="absolute inset-[15%] lg:inset-0" />
          </div>
        </Reveal>
      </div>
    </ThemeSection>
  );
}
