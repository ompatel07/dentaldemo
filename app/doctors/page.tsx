import type { Metadata } from "next";
import { ChapterLabel, TickRule } from "@/components/ui/ChapterLabel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ThemeSection } from "@/components/motion/ThemeSection";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { DoctorGrid } from "@/components/sections/DoctorGrid";
import { doctors } from "@/content/doctors";
import { sections } from "@/content/sections";
import { site } from "@/content/site.config";

export const metadata: Metadata = {
  title: "Dentists",
  description: `The ${doctors.length} dentists of ${site.brand.name}, each led by how they work rather than by a list of degrees.`,
  alternates: { canonical: "/doctors" },
};

/**
 * The team page.
 *
 * Each profile leads with a philosophy of care, because "MDS Prosthodontics"
 * tells a frightened patient nothing and "I would rather talk you out of
 * eight veneers" tells them everything.
 */
export default function DoctorsPage() {
  const { doctors: copy } = sections;
  const languages = Array.from(new Set(doctors.flatMap((d) => d.languages)));
  const years = doctors.reduce((sum, d) => sum + d.yearsExperience, 0);

  return (
    <main id="main">
      <ThemeSection theme="paper" className="pt-[calc(var(--nav-h)+clamp(2rem,6vh,5rem))]">
        <div className="edge">
          <Reveal trigger="mount" y={12}>
            <ChapterLabel chapter={copy.chapter}>{copy.label}</ChapterLabel>
          </Reveal>

          <div className="mt-[clamp(1.5rem,4vh,2.5rem)] grid-editorial items-end gap-y-10">
            <div className="col-span-12 lg:col-span-7">
              <SplitReveal as="h1" trigger="mount" delay={0.1} className="display text-display">
                {copy.headline}
              </SplitReveal>
              <Reveal trigger="mount" delay={0.35} className="mt-7 max-w-[46ch]">
                <p className="text-lead text-muted">{site.brand.concept}</p>
              </Reveal>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <ParallaxImage
                image={{
                  src: "/images/doctors-group.jpg",
                  alt: "The four dentists at the bench",
                  width: 1600,
                  height: 1000,
                }}
                ratio="16/10"
                priority
                amount={8}
                sizes="(max-width: 1024px) 92vw, 40vw"
              />
            </div>
          </div>

          <TickRule className="mt-[clamp(2rem,5vh,3rem)]" />

          <dl className="grid grid-cols-2 gap-y-7 py-7 md:grid-cols-4">
            <div>
              <dt className="label">Dentists</dt>
              <dd className="display mt-3 text-h2">{doctors.length}</dd>
            </div>
            <div>
              <dt className="label">Years, combined</dt>
              <dd className="display mt-3 text-h2">{years}</dd>
            </div>
            <div>
              <dt className="label">Languages</dt>
              <dd className="display mt-3 text-h2">{languages.length}</dd>
            </div>
            <div>
              <dt className="label">Chairs double-booked</dt>
              <dd className="display mt-3 text-h2 text-accent">0</dd>
            </div>
          </dl>
        </div>
      </ThemeSection>

      <ThemeSection theme="paper" className="section-y">
        <div className="edge">
          <DoctorGrid />
        </div>
      </ThemeSection>

      <ThemeSection theme="ink" className="section-y">
        <div className="edge grid-editorial items-end gap-y-10">
          <div className="col-span-12 lg:col-span-8">
            <ChapterLabel>{sections.book.label}</ChapterLabel>
            <SplitReveal as="p" className="display mt-6 text-display">
              {sections.book.headline}
            </SplitReveal>
            <Reveal className="mt-7 max-w-[46ch]" y={18}>
              <p className="text-muted">
                Tell us who you would like to see, or let us match you. Either is fine, and neither costs extra.
              </p>
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <Reveal className="flex flex-wrap gap-3" stagger={0.07} y={16}>
              <Button href="/#book" cursorLabel="Book">
                {site.copy.bookCta}
              </Button>
              <Button href="/contact" variant="outline">
                Contact
              </Button>
            </Reveal>
          </div>
        </div>
      </ThemeSection>
    </main>
  );
}
