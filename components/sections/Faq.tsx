import { ThemeSection } from "@/components/motion/ThemeSection";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { emphasize } from "@/components/motion/Emphasis";
import { ChapterLabel } from "@/components/ui/ChapterLabel";
import { Accordion } from "@/components/ui/Accordion";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { faqs } from "@/content/faqs";
import { has, site } from "@/content/site.config";
import { sections } from "@/content/sections";
import { telHref, whatsappHref } from "@/lib/format";
import { TransitionLink } from "@/components/shell/PageTransition";

/**
 * 13 - FAQ.
 *
 * Questions on the right, and on the left the thing an FAQ is really for:
 * a way to ask a person. The card stays in view while the answers scroll.
 *
 * The accordion lives in components/ui so treatment pages use the identical
 * control, and the same content is emitted as FAQPage JSON-LD from the page.
 */
export function Faq() {
  const { faq: copy } = sections;

  return (
    <ThemeSection theme="sand" id="faq" className="section-y">
      <div className="edge grid-editorial items-start gap-y-10">
        <div className="col-span-12 lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)] lg:col-span-4">
          <Reveal y={14}>
            <ChapterLabel chapter={copy.chapter}>{copy.label}</ChapterLabel>
          </Reveal>

          <SplitReveal as="h2" className="display mt-6 max-w-[12ch] text-h1">
            {emphasize(copy.headline, copy.emphasis)}
          </SplitReveal>

          <Reveal className="mt-6 max-w-[40ch]" y={16}>
            <p className="text-muted">{copy.body}</p>
          </Reveal>

          <Reveal className="mt-8" y={18}>
            <div data-theme="ink" className="rounded-[var(--r-lg)] bg-bg p-6 text-fg">
              <p className="text-sm font-medium">
                <OpenStatus />
              </p>
              {has.phone ? (
                <a href={telHref(site.contact.phone)} className="display mt-4 block text-[clamp(1.5rem,2.2vw,2.1rem)] hover:text-accent">
                  {site.contact.phone}
                </a>
              ) : (
                <a href={"mailto:" + site.contact.email} className="display mt-4 block break-words text-[clamp(1.25rem,1.9vw,1.75rem)] hover:text-accent">
                  {site.contact.email}
                </a>
              )}
              {has.whatsapp ? (
                <a
                  href={whatsappHref(site.contact.whatsapp, `Hello ${site.brand.name}, I have a question.`)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-4 inline-flex h-11 items-center rounded-pill border border-line-strong px-5 text-sm font-medium transition-colors hover:bg-fg hover:text-bg"
                >
                  {site.copy.whatsappCta}
                </a>
              ) : (
                <TransitionLink
                  href="/contact"
                  className="mt-4 inline-flex h-11 items-center rounded-pill border border-line-strong px-5 text-sm font-medium transition-colors hover:bg-fg hover:text-bg"
                >
                  Send a message
                </TransitionLink>
              )}
            </div>
          </Reveal>
        </div>

        <Reveal className="col-span-12 lg:col-span-7 lg:col-start-6" y={20}>
          <Accordion items={faqs} />
        </Reveal>
      </div>
    </ThemeSection>
  );
}
