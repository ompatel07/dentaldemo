import type { Metadata } from "next";
import Image from "next/image";
import { NotFoundTooth } from "@/components/sections/NotFoundTooth";
import { ChapterLabel } from "@/components/ui/ChapterLabel";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ThemeSection } from "@/components/motion/ThemeSection";
import { TransitionLink } from "@/components/shell/PageTransition";
import { treatments } from "@/content/treatments";
import { has, site } from "@/content/site.config";
import { telHref } from "@/lib/format";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * 404.
 *
 * The tooth replaces the zero and drifts out of its socket. It is the one
 * place on this site where a joke is appropriate - and even here it stays
 * inside the brand: the mark draws rather than bounces, and the page still
 * offers the two things a lost visitor might actually want.
 */
export default function NotFound() {
  return (
    <main id="main">
      <ThemeSection
        theme="paper"
        className="flex min-h-svh flex-col justify-center pt-[var(--nav-h)] section-y"
      >
        <div className="edge">
          <ChapterLabel chapter="404">Not found</ChapterLabel>

          <div className="mt-[clamp(1.5rem,4vh,3rem)] grid gap-x-[clamp(1.5rem,3vw,3.5rem)] gap-y-10 lg:grid-cols-12 lg:items-stretch">
            <div className="lg:col-span-7">
              <NotFoundTooth />

              <SplitReveal as="h1" trigger="mount" delay={0.2} className="display mt-10 max-w-[18ch] text-h1">
            This one came out.
          </SplitReveal>

          <Reveal trigger="mount" delay={0.45} className="mt-6 max-w-[46ch]">
            <p className="text-lead text-muted">
              The page you were after is not here. Nothing we can re-implant, unfortunately - but everything else
              is one click away.
            </p>
          </Reveal>

          <Reveal trigger="mount" delay={0.6} className="mt-10 flex flex-wrap gap-3" stagger={0.07}>
            <Button href="/" cursorLabel="Home">
              {site.copy.backHome}
            </Button>
            {has.emergencyPhone ? (
              <Button href={telHref(site.contact.emergencyPhone)} variant="outline" cursorLabel="Call">
                {site.copy.emergencyCta}
              </Button>
            ) : (
              <Button href="/#book" variant="outline" cursorLabel="Book">
                {site.copy.bookCta}
              </Button>
            )}
          </Reveal>
            </div>

            {/* The room is still where you left it. */}
            <Reveal trigger="mount" delay={0.3} y={30} className="relative hidden min-h-[360px] lg:col-span-5 lg:block">
              <div className="relative h-full overflow-hidden rounded-[var(--r-xl)] bg-surface">
                <Image src="/images/hero-clinic.jpg" alt="The consultation room at the atelier" fill sizes="40vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/55 via-transparent to-transparent" />
                <p className="absolute bottom-4 left-4 rounded-pill bg-[var(--paper)]/92 px-4 py-2.5 text-sm font-medium text-[var(--ink)] backdrop-blur-md">
                  <OpenStatus />
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-[clamp(3rem,8vh,5rem)] border-t border-line pt-7" y={18}>
            <p className="label">Or pick up where you meant to be</p>
            <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-3">
              {treatments.map((t) => (
                <li key={t.slug}>
                  <TransitionLink href={`/treatments/${t.slug}`} className="display text-h3 hover:text-accent">
                    {t.name}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </ThemeSection>
    </main>
  );
}
