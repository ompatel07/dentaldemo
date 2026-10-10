"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { doctors } from "@/content/doctors";
import { sections } from "@/content/sections";
import { pad2 } from "@/lib/utils";
import type { Doctor } from "@/content/types";

const DoctorDrawer = dynamic(() => import("./DoctorDrawer").then((m) => m.DoctorDrawer), { ssr: false });

/**
 * The team grid on /doctors.
 *
 * Deliberately not the same component as the home-page list: that one is an
 * index that teases, this one is the page people arrive at from a search
 * for a name, so the philosophy quote is visible without interaction and
 * the drawer only adds credentials and the longer bio.
 */
export function DoctorGrid() {
  const [selected, setSelected] = useState<Doctor | null>(null);
  const lastSelected = useRef<Doctor | null>(null);
  if (selected) lastSelected.current = selected;

  const labels = sections.doctors.modalLabels;

  return (
    <>
      <Reveal as="ul" className="grid gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-[clamp(3rem,7vh,5rem)] sm:grid-cols-2" stagger={0.08} y={28}>
        {doctors.map((doctor, i) => (
          <li key={doctor.slug}>
            <article className="group/doc">
              <button
                onClick={() => setSelected(doctor)}
                aria-haspopup="dialog"
                className="block w-full text-left"
                data-cursor-label="Open"
              >
                <div className="relative overflow-hidden rounded-mask bg-surface" style={{ aspectRatio: "4/5" }}>
                  <Image
                    src={doctor.portrait.src}
                    alt={doctor.portrait.alt}
                    fill
                    sizes="(max-width: 640px) 92vw, 46vw"
                    className="object-cover transition-transform duration-[900ms] ease-[var(--ease-expo)] group-hover/doc:scale-[1.04] reduce:transition-none reduce:group-hover/doc:scale-100"
                  />
                  <span className="label absolute left-5 top-5 rounded-pill bg-bg/85 px-3 py-1.5 backdrop-blur-sm">
                    {pad2(i + 1)}
                  </span>
                </div>

                <div className="mt-6 flex items-baseline justify-between gap-4 border-b border-line pb-3">
                  <h2 className="display text-h2 transition-colors group-hover/doc:text-accent">{doctor.name}</h2>
                  <span aria-hidden="true" className="label text-accent opacity-0 transition-opacity group-hover/doc:opacity-100">
                    &rarr;
                  </span>
                </div>

                <p className="label mt-4">{doctor.role}</p>
              </button>

              <blockquote className="display mt-5 max-w-[40ch] text-h3 italic text-muted">
                {doctor.philosophy}
              </blockquote>

              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
                <div className="flex items-baseline gap-2">
                  <dt className="label">{labels.languages}</dt>
                  <dd className="label !text-fg">{doctor.languages.join(", ")}</dd>
                </div>
                <div className="flex items-baseline gap-2">
                  <dt className="label">{labels.experience}</dt>
                  <dd className="label !text-fg">{doctor.yearsExperience}</dd>
                </div>
              </dl>
            </article>
          </li>
        ))}
      </Reveal>

      {lastSelected.current ? (
        <DoctorDrawer doctor={lastSelected.current} open={Boolean(selected)} onClose={() => setSelected(null)} />
      ) : null}
    </>
  );
}
