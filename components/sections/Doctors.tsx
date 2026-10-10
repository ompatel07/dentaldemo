"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { ThemeSection } from "@/components/motion/ThemeSection";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "./SectionHeader";
import { Button } from "@/components/ui/Button";
import { doctors } from "@/content/doctors";
import { sections } from "@/content/sections";
import type { Doctor } from "@/content/types";

/** Loaded on first open; nothing here is needed to render the cards. */
const DoctorDrawer = dynamic(() => import("./DoctorDrawer").then((m) => m.DoctorDrawer), { ssr: false });

/**
 * 09 - The dentists.
 *
 * Four portraits, because people choose a dentist by face long before they
 * read a credential. Each card rests in a quiet duotone and warms to full
 * colour on hover or focus, with the dentist's philosophy rising over the
 * photograph - the thing that actually distinguishes them.
 *
 * The earlier version was a list of names with a portrait chasing the
 * cursor: clever on a trackpad, and four lines of text on everything else.
 */
export function Doctors() {
  const [selected, setSelected] = useState<Doctor | null>(null);
  // Held through the close animation so the drawer does not empty mid-exit.
  const lastSelected = useRef<Doctor | null>(null);
  if (selected) lastSelected.current = selected;

  const { doctors: copy } = sections;

  return (
    <ThemeSection theme="paper" id="doctors" className="section-y">
      <div className="edge">
        <SectionHeader
          chapter={copy.chapter}
          label={copy.label}
          headline={copy.headline}
          emphasis={copy.emphasis}
          body={copy.body}
          aside={
            <Button href="/doctors" variant="outline" size="sm" cursorLabel="View">
              {copy.cta}
            </Button>
          }
        />

        <Reveal as="ul" className="mt-[clamp(2rem,5vh,3.5rem)] grid grid-cols-2 gap-[clamp(0.75rem,1.4vw,1.5rem)] lg:grid-cols-4" stagger={0.08} y={30}>
          {doctors.map((doctor) => (
            <li key={doctor.slug}>
              <button
                onClick={() => setSelected(doctor)}
                aria-haspopup="dialog"
                className="group/doc block w-full text-left"
                data-cursor-label="Meet"
              >
                <span className="relative block h-[min(54svh,480px)] overflow-hidden rounded-[var(--r-lg)] bg-surface max-sm:h-[38svh]">
                  <Image
                    src={doctor.portrait.src}
                    alt={doctor.portrait.alt}
                    fill
                    sizes="(max-width: 1024px) 46vw, 23vw"
                    className="object-cover grayscale-[0.85] transition-[filter,transform] duration-700 ease-[var(--ease-expo)] group-hover/doc:scale-[1.04] group-hover/doc:grayscale-0 group-focus-visible/doc:grayscale-0"
                    loading="lazy"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/80 via-[var(--ink)]/10 to-transparent" />

                  <span className="absolute left-3 top-3 rounded-pill bg-[var(--paper)]/90 px-3 py-1.5 text-xs font-medium text-[var(--ink)] backdrop-blur-sm">
                    {doctor.yearsExperience} yrs
                  </span>

                  {/* Philosophy rises over the photo. */}
                  <span className="absolute inset-x-4 bottom-4 block text-[var(--paper)]">
                    <span className="block translate-y-3 text-sm leading-snug opacity-0 transition-all duration-500 ease-[var(--ease-expo)] group-hover/doc:translate-y-0 group-hover/doc:opacity-100 group-focus-visible/doc:translate-y-0 group-focus-visible/doc:opacity-100 max-lg:hidden">
                      &ldquo;{doctor.philosophy}&rdquo;
                    </span>
                  </span>
                </span>

                <span className="mt-4 block">
                  <span className="display block text-[clamp(1.1rem,1.5vw,1.5rem)]">{doctor.name}</span>
                  <span className="mt-1 block text-sm text-muted">{doctor.role}</span>
                </span>
              </button>
            </li>
          ))}
        </Reveal>
      </div>

      {lastSelected.current ? (
        <DoctorDrawer doctor={lastSelected.current} open={Boolean(selected)} onClose={() => setSelected(null)} />
      ) : null}
    </ThemeSection>
  );
}
