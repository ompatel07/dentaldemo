"use client";

import Image from "next/image";
import { useRef } from "react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { EASE, gsap, registerExtra } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { prefersReducedMotion } from "@/lib/motion";
import { ThemeSection } from "@/components/motion/ThemeSection";
import { SectionHeader } from "./SectionHeader";
import { journey } from "@/content/journey";
import { sections } from "@/content/sections";

/**
 * 06 - The journey.
 *
 * Four steps, each with a photograph, and a line that draws itself from
 * one to the next as you scroll. Each card lifts to full strength as the
 * line reaches it. While pinned, the block keeps its last row clear of the
 * corner dock - nothing else on the page sits under it for long.
 *
 * On a tall-enough desktop window the block pins while the line draws. It
 * only pins when it actually fits - `min-height` is part of the condition -
 * because a pinned block taller than the viewport hides its own lower half,
 * and that is the single most common way this pattern breaks on laptops.
 * Everywhere else the same timeline simply scrubs as the block passes.
 *
 * The path scales proportionally: with preserveAspectRatio="none" the
 * browser cannot measure a non-scaling stroke, and DrawSVG silently gets
 * nothing to animate.
 */
export function Journey() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const numeralRef = useRef<HTMLSpanElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerExtra(DrawSVGPlugin);

    const stroke = root.querySelector<SVGElement>("[data-draw]");
    const nodes = root.querySelectorAll<SVGElement>("[data-node]");
    const steps = root.querySelectorAll<HTMLElement>("[data-step]");

    if (prefersReducedMotion()) {
      if (stroke) gsap.set(stroke, { drawSVG: "100%" });
      if (numeralRef.current) numeralRef.current.textContent = String(journey.length).padStart(2, "0");
      return;
    }

    const mm = gsap.matchMedia();

    mm.add({ pin: "(min-width: 1024px) and (min-height: 700px)", flow: "(max-width: 1023px), (max-height: 699px)" }, (context) => {
      const pinned = Boolean(context.conditions?.pin) && root.offsetHeight <= window.innerHeight;

      // Step one is already lit when the block arrives - a row of four grey
      // photographs reads as images that failed to load. The line starts at
      // the first node and everything after it waits.
      const count = journey.length;
      const first = (100 * 0.5) / count;
      const later = <T,>(list: ArrayLike<T>) => Array.from(list).slice(1);
      // Where on the timeline the line reaches node i.
      const reach = (i: number) => (i * count) / (count - 0.5);

      if (stroke) gsap.set(stroke, { drawSVG: `0% ${first}%` });
      gsap.set(later(nodes), { scale: 0.5, autoAlpha: 0.4, transformOrigin: "center" });
      // The photographs wait in grey and the cards sit a little low; the
      // text is never dimmed - small muted copy at 60% opacity fails AA.
      const photos = root.querySelectorAll<HTMLElement>("[data-step-photo]");
      gsap.set(later(steps), { y: 14 });
      gsap.set(later(photos), { filter: "grayscale(1) opacity(0.45)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: pinned ? "top top" : "top 62%",
          end: pinned ? () => "+=" + Math.round(window.innerHeight * 1.2) : "bottom 78%",
          scrub: 0.6,
          pin: pinned ? root : false,
          anticipatePin: pinned ? 1 : 0,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!numeralRef.current) return;
            const i = Math.min(count, 1 + Math.floor(self.progress * (count - 0.5) + 0.04));
            const next = String(i).padStart(2, "0");
            if (numeralRef.current.textContent !== next) numeralRef.current.textContent = next;
          },
        },
      });

      // One unit of timeline per step keeps line, node and card in lockstep.
      if (stroke) tl.to(stroke, { drawSVG: "0% 100%", ease: "none", duration: count }, 0);
      steps.forEach((step, i) => {
        if (i === 0) return;
        const at = reach(i) - 0.3;
        if (nodes[i]) tl.to(nodes[i], { scale: 1, autoAlpha: 1, duration: 0.25, ease: EASE.expo }, at);
        tl.to(step, { y: 0, duration: 0.5, ease: EASE.expo }, at);
        if (photos[i]) tl.to(photos[i], { filter: "grayscale(0) opacity(1)", duration: 0.5, ease: "none" }, at);
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set([...steps, ...nodes, ...photos], { clearProps: "all" });
      };
    });

    return () => mm.revert();
  }, []);

  const { journey: copy } = sections;

  return (
    <ThemeSection theme="paper" id="journey" className="relative overflow-hidden">
      <div ref={rootRef} className="flex flex-col justify-center py-[clamp(2.5rem,7vh,5rem)] lg:min-h-svh lg:pb-[5.25rem] lg:pt-[calc(var(--nav-h)+1rem)]">
        <div className="edge">
          <SectionHeader
            chapter={copy.chapter}
            label={copy.label}
            headline={copy.headline}
            emphasis={copy.emphasis}
            body={copy.body}
            measure="max-w-[20ch]"
            aside={
              <p className="display flex items-start text-[clamp(2.25rem,3.6vw,3.5rem)] leading-none text-accent" aria-hidden="true">
                <span ref={numeralRef}>01</span>
                <span className="ml-1 mt-1 font-mono text-xs font-medium tracking-normal text-muted">/ {String(journey.length).padStart(2, "0")}</span>
              </p>
            }
          />

          {/* The line. Hidden on phones, where the cards stack. */}
          <svg viewBox="0 0 1200 70" className="mt-[clamp(1rem,3vh,2rem)] hidden h-auto w-full sm:block" fill="none" aria-hidden="true">
            <path
              d="M0 52 L150 52 C270 52, 330 18, 450 18 C570 18, 630 52, 750 52 C870 52, 930 18, 1050 18 L1200 18"
              stroke="var(--line-strong)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <path
              data-draw
              d="M0 52 L150 52 C270 52, 330 18, 450 18 C570 18, 630 52, 750 52 C870 52, 930 18, 1050 18 L1200 18"
              stroke="var(--accent-bright)"
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            {[
              [150, 52],
              [450, 18],
              [750, 52],
              [1050, 18],
            ].map(([cx, cy]) => (
              <circle key={cx} data-node cx={cx} cy={cy} r="6" fill="var(--accent-bright)" stroke="var(--bg)" strokeWidth="3" />
            ))}
          </svg>

          <ol className="mt-[clamp(0.75rem,2vh,1.25rem)] grid gap-[clamp(0.75rem,1.4vw,1.5rem)] sm:grid-cols-2 lg:grid-cols-4">
            {journey.map((step) => (
              <li key={step.chapter} data-step className="overflow-hidden rounded-[var(--r-lg)] border border-line bg-surface-2">
                <div data-step-photo className="relative h-[min(19svh,170px)] min-h-[110px]">
                  <Image src={step.image.src} alt={step.image.alt} fill sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 23vw" className="object-cover" loading="lazy" />
                  <span className="absolute left-3 top-3 grid h-8 min-w-8 place-items-center rounded-pill bg-[var(--paper)] px-2 font-mono text-xs font-medium text-[var(--ink)]">
                    {step.chapter}
                  </span>
                  <span className="absolute right-3 top-3 rounded-pill bg-[var(--ink)]/70 px-3 py-1.5 text-xs font-medium text-[var(--paper)] backdrop-blur-sm">
                    {step.duration}
                  </span>
                </div>
                <div className="p-[clamp(0.9rem,1.3vw,1.25rem)]">
                  <h3 className="display text-[clamp(1.15rem,1.5vw,1.45rem)]">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </ThemeSection>
  );
}
