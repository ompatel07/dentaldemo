import Image from "next/image";
import { ThemeSection } from "@/components/motion/ThemeSection";
import { StickyStack } from "./StickyStack";
import { SectionHeader } from "./SectionHeader";
import { technology } from "@/content/technology";
import { sections } from "@/content/sections";

/**
 * 07 - Technology.
 *
 * Dark section, sticky stacking cards. Each card sticks a little lower than
 * the one before it, so the stack keeps a visible edge rather than hiding
 * its own history, and each card shrinks and dims as the next arrives.
 *
 * Sticky does the layout; GSAP only handles scale and dim. Doing the
 * stacking itself in JS would mean fighting the browser for something CSS
 * already does correctly at 60fps.
 *
 * This is a server component. Only StickyStack - a wrapper with one ref and
 * one matchMedia block - hydrates, so four cards of copy, images and spec
 * tables cost the browser no React work at all.
 */
export function Technology() {
  const { technology: copy } = sections;

  return (
    <ThemeSection theme="ink" id="technology" className="section-y">
      <div className="edge">
        <SectionHeader
          chapter={copy.chapter}
          label={copy.label}
          headline={copy.headline}
          emphasis={copy.emphasis}
          body={copy.body}
        />

        <StickyStack className="mt-[clamp(3rem,8vh,6rem)]">
          {technology.map((item, i) => (
            <article
              key={item.name}
              data-tech-card
              className="mb-[clamp(1rem,4vh,3rem)] md:sticky"
              style={{ top: `calc(var(--nav-h) + 1rem + ${i * 14}px)` }}
            >
              <div
                data-tech-inner
                className="grid-editorial items-center gap-y-8 overflow-hidden rounded-mask border border-line bg-surface p-[clamp(1.25rem,3vw,2.5rem)]"
              >
                <div className="col-span-12 lg:col-span-5">
                  <div className="relative overflow-hidden rounded-md" style={{ aspectRatio: "4/3" }}>
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(max-width: 1024px) 90vw, 40vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-7 lg:pl-[clamp(1rem,3vw,3rem)]">
                  <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
                    <span className="label text-accent">{item.chapter}</span>
                    <span className="label">{copy.label}</span>
                  </div>

                  <h3 className="display mt-6 text-h2">{item.name}</h3>
                  <p className="mt-4 max-w-[52ch] text-muted">{item.body}</p>

                  <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-5">
                    {item.specs.map((spec) => (
                      <div key={spec.label}>
                        <dt className="label">{spec.label}</dt>
                        <dd className="mt-2 font-mono text-sm">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </article>
          ))}
        </StickyStack>
      </div>
    </ThemeSection>
  );
}
