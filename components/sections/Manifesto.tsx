import Image from "next/image";
import { ThemeSection } from "@/components/motion/ThemeSection";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { ChapterLabel } from "@/components/ui/ChapterLabel";
import { emphasize } from "@/components/motion/Emphasis";
import { ManifestoScrub } from "./ManifestoScrub";
import { sections } from "@/content/sections";

/**
 * 03 - Manifesto.
 *
 * The statement lights up word by word as it is read, beside a photograph
 * of the bench it describes. The pictures are doing real work here: "one
 * case at a time" is a claim, and hands polishing a single crown are the
 * evidence.
 *
 * A server component - only ManifestoScrub hydrates.
 */
export function Manifesto() {
  const { manifesto } = sections;

  return (
    <ThemeSection theme="paper" id="manifesto" className="section-y">
      <div className="edge grid-editorial items-center gap-y-12">
        {/* Picture stack */}
        <div className="relative col-span-12 lg:col-span-5">
          <ParallaxImage
            image={manifesto.portrait}
            ratio="4/5"
            amount={10}
            sizes="(max-width: 1024px) 92vw, 38vw"
            className="w-[82%]"
          />
          <Reveal y={36} delay={0.15} className="absolute bottom-[-8%] right-0 w-[46%]">
            <div className="relative overflow-hidden rounded-[var(--r-lg)] border-[6px] border-bg shadow-[var(--shadow-lift)]" style={{ aspectRatio: "1/1" }}>
              <Image src={manifesto.detail.src} alt={manifesto.detail.alt} fill sizes="(max-width: 1024px) 42vw, 18vw" className="object-cover" loading="lazy" />
            </div>
          </Reveal>
        </div>

        {/* Statement */}
        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <Reveal y={14}>
            <ChapterLabel chapter={manifesto.chapter}>{manifesto.label}</ChapterLabel>
          </Reveal>

          <ManifestoScrub className="mt-7">
            <p data-manifesto-copy className="display text-[clamp(1.35rem,2.05vw,2.15rem)] !leading-[1.24] !tracking-[-0.03em]">
              {emphasize(manifesto.body, manifesto.emphasis)}
            </p>
          </ManifestoScrub>

          <Reveal y={14} className="mt-9 flex items-center gap-4 border-t border-line pt-6">
            <Image
              src="/images/doctor-ira-mehta.jpg"
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 rounded-pill object-cover object-top"
            />
            <p className="leading-tight">
              <span className="block font-medium">{manifesto.signatureName}</span>
              <span className="block text-sm text-muted">{manifesto.signatureRole}</span>
            </p>
          </Reveal>
        </div>
      </div>
    </ThemeSection>
  );
}
