"use client";

import Image from "next/image";
import { Modal, ModalHeader } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { sections } from "@/content/sections";
import type { Doctor } from "@/content/types";

/**
 * The doctor drawer. Split out of Doctors.tsx so it can be code-split: the
 * list renders without it, and it arrives on the first click.
 */
export function DoctorDrawer({
  doctor,
  open,
  onClose,
}: {
  doctor: Doctor | null;
  open: boolean;
  onClose: () => void;
}) {
  const labels = sections.doctors.modalLabels;

  return (
    <Modal open={open} onClose={onClose} label={doctor?.name ?? ""} variant="drawer">
      {doctor ? (
        <>
          <ModalHeader eyebrow={doctor.role} title={doctor.name} onClose={onClose} />

          <div className="px-[clamp(1.25rem,3vw,2.5rem)] pb-[clamp(2rem,5vh,3rem)] pt-8">
            <div className="relative overflow-hidden rounded-mask bg-surface" style={{ aspectRatio: "4/5" }}>
              <Image
                src={doctor.portrait.src}
                alt={doctor.portrait.alt}
                fill
                sizes="(max-width: 640px) 90vw, 520px"
                className="object-cover"
              />
            </div>

            <p className="label mt-10">{labels.philosophy}</p>
            <blockquote className="display mt-4 text-h3 italic">{doctor.philosophy}</blockquote>

            <p className="mt-8 text-muted">{doctor.bio}</p>

            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-line pt-7">
              <div className="col-span-2">
                <dt className="label">{labels.credentials}</dt>
                <dd className="mt-3">
                  <ul className="space-y-1.5 text-sm">
                    {doctor.credentials.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </dd>
              </div>

              <div>
                <dt className="label">{labels.languages}</dt>
                <dd className="mt-3 text-sm">{doctor.languages.join(", ")}</dd>
              </div>

              <div>
                <dt className="label">{labels.experience}</dt>
                <dd className="mt-3 font-mono text-sm">{doctor.yearsExperience}</dd>
              </div>

              <div className="col-span-2">
                <dt className="label">{labels.focus}</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {doctor.focus.map((f) => (
                    <span key={f} className="label rounded-pill border border-line px-3 py-1.5">
                      {f}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="mt-10">
              <Button href="/#book" cursorLabel="Book" onClick={onClose}>
                {labels.book} {doctor.name.replace("Dr. ", "")}
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </Modal>
  );
}
