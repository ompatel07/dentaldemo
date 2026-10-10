import Image from "next/image";
import { ThemeSection } from "@/components/motion/ThemeSection";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { emphasize } from "@/components/motion/Emphasis";
import { ChapterLabel } from "@/components/ui/ChapterLabel";
import { Button } from "@/components/ui/Button";
import { comfort } from "@/content/comfort";
import { sections } from "@/content/sections";

/**
 * 08 - For the nervous ones.
 *
 * The differentiator, and the one section that must not perform. Motion
 * here is slower and shorter than anywhere else on the page - 1.4s reveals,
 * 12px of travel, nothing pinned - because the subject is fear, and a
 * section about fear should not startle anyone.
 *
 * The photograph stays put while the menu scrolls past it: an empty chair
 * by a window, which is the whole promise in one image. The menu is set
 * like a spa menu, and the right-hand column where a price would go almost
 * always reads "Included".
 */
export function Comfort() {
  const { comfort: copy } = sections;

  return (
    <ThemeSection theme="mint" id="comfort" className="section-y">
      <div className="edge grid-editorial items-start gap-y-12">
        {/* The room - sticky beside the menu on desktop. */}
        <div className="col-span-12 lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)] lg:col-span-5">
          <div className="relative">
            <ParallaxImage image={copy.image} ratio="4/5" amount={8} sizes="(max-width: 1024px) 92vw, 38vw" className="max-h-[78svh] w-full" />

            <Reveal y={12} duration={1.4} className="absolute inset-x-4 bottom-4">
              <blockquote className="rounded-[var(--r-lg)] bg-[var(--paper)]/92 p-5 text-[var(--ink)] backdrop-blur-md">
                <p className="display text-[clamp(1.05rem,1.35vw,1.35rem)] !leading-[1.2] !tracking-[-0.025em]">{copy.promise}</p>
              </blockquote>
            </Reveal>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <Reveal y={10} duration={1.4}>
            <ChapterLabel chapter={copy.chapter}>{copy.label}</ChapterLabel>
          </Reveal>

          <SplitReveal as="h2" className="display mt-6 max-w-[16ch] text-h1" duration={1.4} stagger={0.08}>
            {emphasize(copy.headline, copy.emphasis)}
          </SplitReveal>

          <Reveal className="mt-7 max-w-[54ch]" y={12} duration={1.4}>
            <p className="text-lead text-muted">{copy.body}</p>
          </Reveal>

          <Reveal as="ul" className="mt-10 border-t border-line" stagger={0.07} y={12} duration={1.3}>
            {comfort.map((item) => (
              <li key={item.name} className="grid gap-x-6 gap-y-1.5 border-b border-line py-5 sm:grid-cols-[1fr_auto] sm:items-baseline">
                <div>
                  <h3 className="display text-[clamp(1.1rem,1.4vw,1.35rem)]">{item.name}</h3>
                  <p className="mt-2 max-w-[52ch] text-sm text-muted">{item.body}</p>
                </div>
                <p className="w-fit rounded-pill bg-surface-2 px-3 py-1.5 text-xs font-medium text-accent sm:justify-self-end">{item.note}</p>
              </li>
            ))}
          </Reveal>

          <Reveal className="mt-9 flex flex-wrap items-center gap-5" y={12} duration={1.4}>
            <Button href="/#book" cursorLabel="Book">
              {copy.cta}
            </Button>
            <span className="flex items-center gap-3 text-sm text-muted">
              <Image src="/images/comfort-detail.jpg" alt="" width={44} height={44} className="h-11 w-11 rounded-pill object-cover" />
              About a third of our patients start this way.
            </span>
          </Reveal>
        </div>
      </div>
    </ThemeSection>
  );
}
