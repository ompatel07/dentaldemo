"use client";

import { useRef, useState } from "react";
import { Flip } from "gsap/Flip";
import { EASE, gsap, registerExtra } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { prefersReducedMotion } from "@/lib/motion";
import { ThemeSection } from "@/components/motion/ThemeSection";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "./SectionHeader";
import { CompareSlider } from "./CompareSlider";
import { cases } from "@/content/cases";
import { sections } from "@/content/sections";
import { cx, pad2 } from "@/lib/utils";

/**
 * 05 - Smile transformations.
 *
 * Case list on the left, drag comparison on the right. The list is the tab
 * control, and it carries the story of each case next to its name - so the
 * column that used to be a row of bare buttons now does some explaining.
 *
 * The active marker is one element moved with Flip, so it travels between
 * rows instead of fading out in one place and in at another.
 */
export function Transformations() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const first = useRef(true);

  // Capture the marker's position before React moves it to the new row.
  const handleSelect = (index: number) => {
    if (index === active) return;
    const marker = tabsRef.current?.querySelector("[data-tab-marker]");
    if (marker) flipState.current = Flip.getState(marker);
    setActive(index);
  };

  useIsomorphicLayoutEffect(() => {
    registerExtra(Flip);

    if (first.current) {
      first.current = false;
      return;
    }

    const state = flipState.current;
    flipState.current = null;
    if (!state || prefersReducedMotion()) return;

    Flip.from(state, { duration: 0.55, ease: EASE.expo, absolute: true });

    const frame = frameRef.current;
    if (frame) gsap.fromTo(frame, { autoAlpha: 0.25, scale: 0.985 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: EASE.expo });
  }, [active]);

  const { transformations } = sections;
  const item = cases[active];

  return (
    <ThemeSection theme="paper" id="transformations" className="section-y overflow-hidden">
      <div className="edge">
        <SectionHeader
          chapter={transformations.chapter}
          label={transformations.label}
          headline={transformations.headline}
          emphasis={transformations.emphasis}
          body={transformations.body}
        />

        <div className="mt-[clamp(2rem,5vh,3.5rem)] grid-editorial items-start gap-y-8">
          {/* Case list */}
          <Reveal className="col-span-12 lg:col-span-4" y={22}>
            <div ref={tabsRef} role="tablist" aria-label={transformations.label} aria-orientation="vertical" className="flex flex-col gap-1.5">
              {cases.map((c, i) => {
                const on = i === active;
                return (
                  <button
                    key={c.id}
                    role="tab"
                    id={`case-tab-${c.id}`}
                    aria-selected={on}
                    aria-controls={`case-panel-${c.id}`}
                    onClick={() => handleSelect(i)}
                    className="group/tab relative rounded-[var(--r-md)] p-4 text-left"
                  >
                    {on ? <span data-tab-marker aria-hidden="true" className="absolute inset-0 rounded-[var(--r-md)] bg-surface" /> : null}

                    <span className="relative flex items-baseline gap-4">
                      <span className={cx("font-mono text-xs transition-colors", on ? "text-accent" : "text-muted")}>{pad2(i + 1)}</span>
                      <span className="flex-1">
                        <span className={cx("display block text-[clamp(1.15rem,1.5vw,1.45rem)] transition-colors", !on && "text-muted group-hover/tab:text-fg")}>
                          {c.label}
                        </span>
                        <span className="mt-1.5 block text-sm text-muted">
                          {c.treatment} · {c.duration}
                        </span>
                        {/* Grid-rows height animation: no JS, no guessing. */}
                        <span
                          className="grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-expo)]"
                          style={{ gridTemplateRows: on ? "1fr" : "0fr", opacity: on ? 1 : 0 }}
                        >
                          <span className="overflow-hidden">
                            <span className="block pt-3 text-sm leading-relaxed">{c.summary}</span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Comparison */}
          <Reveal className="col-span-12 lg:col-span-8" y={28}>
            <div ref={frameRef} role="tabpanel" id={`case-panel-${item.id}`} aria-labelledby={`case-tab-${item.id}`}>
              {/* Keyed so switching case resets the handle to centre. */}
              <CompareSlider key={item.id} item={item} caption={false} />
              <p className="mt-4 flex items-center gap-2 text-sm text-muted">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                  <path d="M9 6 3 12l6 6M15 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Drag the handle, or use the arrow keys.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </ThemeSection>
  );
}
