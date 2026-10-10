"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ToothMark } from "@/components/ui/ToothMark";
import { BookingCalendar } from "./BookingCalendar";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { EASE, gsap, registerExtra } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { emptyDraft, formatDateLong, submitBooking, toISODate, type BookingDraft } from "@/lib/booking";
import { treatments } from "@/content/treatments";
import { has, site } from "@/content/site.config";
import { sections } from "@/content/sections";
import { telHref } from "@/lib/format";
import { cx } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";

const STEPS = sections.book.steps;
const L = sections.book.labels;

/**
 * The booking flow: treatment, date, time, details, confirmation.
 *
 * Five short steps rather than one long form. Each screen asks for one
 * thing, the step cannot be advanced until that thing exists, and the
 * commitment escalates: nobody is asked for a phone number until they have
 * already chosen a slot.
 *
 * Nothing is sent anywhere by default. lib/booking.ts holds the single
 * submission seam.
 */
export function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const reduced = useReducedMotion();

  // A reopened modal should be a fresh booking, not a half-filled one.
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setStep(0);
      setDraft(emptyDraft);
      setReference(null);
      setError(null);
      setTouched(false);
    }, 500);
    return () => clearTimeout(t);
  }, [open]);

  const set = <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const detailsValid = draft.name.trim().length > 1 && draft.phone.trim().length > 5;

  const canAdvance =
    step === 0 ? Boolean(draft.treatment) : step === 1 ? Boolean(draft.date) : step === 2 ? Boolean(draft.time) : detailsValid;

  const next = () => {
    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }
    setTouched(true);
    if (!detailsValid) return;
    void send();
  };

  const send = async () => {
    setSubmitting(true);
    setError(null);
    const result = await submitBooking(draft);
    setSubmitting(false);
    if (result.ok) {
      setReference(result.reference);
      setStep(4);
    } else {
      setError(result.error);
    }
  };

  const slide = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, x: 28 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -28 },
        transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
      };

  const selectedDate = draft.date ? new Date(draft.date) : null;

  return (
    <Modal open={open} onClose={onClose} label={sections.book.headline} variant="panel">
      {/* Header: steps double as the progress indicator. */}
      <div className="sticky top-0 z-10 border-b border-line bg-bg/90 px-[clamp(1.25rem,3vw,2.5rem)] py-5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-6">
          <p className="display text-[1.125rem]">{sections.book.label}</p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="tap grid h-10 w-10 place-items-center rounded-pill border border-line-strong transition-colors hover:border-accent hover:text-accent"
            data-cursor-label="Close"
          >
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* One bar per step, filled as far as you have got. */}
        <ol className="mt-4 grid grid-cols-5 gap-1.5">
          {STEPS.map((s, i) => (
            <li key={s} className="min-w-0" aria-current={i === step ? "step" : undefined}>
              <span
                aria-hidden="true"
                className={cx("block h-1 rounded-pill transition-colors duration-500", i <= step ? "bg-accent-bright" : "bg-line")}
              />
              <span className={cx("mt-2 block truncate text-xs font-medium transition-colors", i === step ? "text-fg" : "text-muted")}>
                {s}
                {i < step ? <span className="sr-only"> (done)</span> : null}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="px-[clamp(1.25rem,3vw,2.5rem)] py-[clamp(1.5rem,4vh,2.5rem)]">
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 ? (
            <motion.div key="treatment" {...slide}>
              <h3 className="display text-h3">What are we booking?</h3>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {[...treatments.map((t) => ({ value: t.slug, label: t.name, hint: t.tagline })), {
                  value: "unsure",
                  label: "I am not sure yet",
                  hint: "A first visit will work that out together.",
                }].map((option) => (
                  <li key={option.value}>
                    <button
                      onClick={() => {
                        set("treatment", option.value);
                        setStep(1);
                      }}
                      aria-pressed={draft.treatment === option.value}
                      className={cx(
                        "w-full rounded-md border p-4 text-left transition-colors",
                        draft.treatment === option.value
                          ? "border-accent bg-accent/10"
                          : "border-line hover:border-line-strong",
                      )}
                    >
                      <span className="block">{option.label}</span>
                      <span className="label mt-2 block">{option.hint}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : step === 1 ? (
            <motion.div key="date" {...slide}>
              <h3 className="display text-h3">Pick a day</h3>
              <div className="mt-6">
                <BookingCalendar
                  value={selectedDate}
                  onSelect={(d) => {
                    set("date", toISODate(d));
                    setStep(2);
                  }}
                />
              </div>
            </motion.div>
          ) : step === 2 ? (
            <motion.div key="time" {...slide}>
              <h3 className="display text-h3">Pick a time</h3>
              {selectedDate ? <p className="label mt-3">{formatDateLong(selectedDate)}</p> : null}

              <ul className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {site.booking.slots.map((slot) => (
                  <li key={slot}>
                    <button
                      onClick={() => {
                        set("time", slot);
                        setStep(3);
                      }}
                      aria-pressed={draft.time === slot}
                      className={cx(
                        "w-full rounded-pill border py-3 font-mono text-sm transition-colors",
                        draft.time === slot
                          ? "border-accent bg-accent-bright text-accent-fg"
                          : "border-line hover:border-accent hover:text-accent",
                      )}
                    >
                      {slot}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : step === 3 ? (
            <motion.div key="details" {...slide}>
              <h3 className="display text-h3">How do we reach you?</h3>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field
                  id="bk-name"
                  label={L.name}
                  value={draft.name}
                  onChange={(v) => set("name", v)}
                  required
                  invalid={touched && draft.name.trim().length < 2}
                  autoComplete="name"
                />
                <Field
                  id="bk-phone"
                  label={L.phone}
                  value={draft.phone}
                  onChange={(v) => set("phone", v)}
                  required
                  invalid={touched && draft.phone.trim().length < 6}
                  type="tel"
                  autoComplete="tel"
                />
                <div className="sm:col-span-2">
                  <Field
                    id="bk-email"
                    label={L.email}
                    value={draft.email}
                    onChange={(v) => set("email", v)}
                    type="email"
                    autoComplete="email"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="bk-notes" className="label">
                    {L.notes}
                  </label>
                  <textarea
                    id="bk-notes"
                    rows={3}
                    value={draft.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    className="mt-3 w-full resize-none rounded-md border border-line bg-transparent px-4 py-3 focus-visible:border-accent"
                  />
                  <p className="label mt-2">{L.notesHint}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Check
                  id="bk-first"
                  label={L.firstTime}
                  checked={draft.firstVisit}
                  onChange={(v) => set("firstVisit", v)}
                />
                <Check
                  id="bk-anxious"
                  label={L.anxious}
                  checked={draft.anxious}
                  onChange={(v) => set("anxious", v)}
                />
              </div>

              {error ? (
                <p role="alert" className="mt-5 text-sm text-accent">
                  {error}{" "}
                  {has.phone ? (
                    <a href={telHref(site.contact.phone)} className="underline underline-offset-4">
                      {site.contact.phone}
                    </a>
                  ) : null}
                </p>
              ) : null}
            </motion.div>
          ) : (
            <motion.div key="done" {...slide}>
              <Success reference={reference} draft={draft} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {step < 4 ? (
        <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-line bg-bg/90 px-[clamp(1.25rem,3vw,2.5rem)] py-4 backdrop-blur-xl">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="label transition-opacity hover:text-accent disabled:opacity-30"
          >
            {L.back}
          </button>

          <Button onClick={next} magnetic={false} size="sm" cursorLabel="Next" disabled={!canAdvance || submitting}>
            {submitting ? "Sending" : step === 3 ? L.submit : L.next}
          </Button>
        </div>
      ) : null}
    </Modal>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required,
  invalid,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  invalid?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-err` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cx(
          "mt-3 w-full rounded-md border bg-transparent px-4 py-3 focus-visible:border-accent",
          invalid ? "border-accent" : "border-line",
        )}
      />
      {invalid ? (
        <p id={`${id}-err`} className="label mt-2 text-accent">
          {L.required}
        </p>
      ) : null}
    </div>
  );
}

function Check({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
      />
      <label htmlFor={id} className="text-sm text-muted">
        {label}
      </label>
    </div>
  );
}

/**
 * Confirmation. The tooth mark draws itself once - quiet, and in keeping
 * with the preloader - rather than firing confetti at someone who has just
 * booked a medical appointment.
 */
function Success({ reference, draft }: { reference: string | null; draft: BookingDraft }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerExtra(DrawSVGPlugin);

    const strokes = el.querySelectorAll("[data-draw]");
    if (prefersReducedMotion()) {
      gsap.set(strokes, { drawSVG: "100%" });
      return;
    }

    const tl = gsap
      .timeline()
      .set(strokes, { drawSVG: "0%" })
      .to(strokes, { drawSVG: "100%", duration: 1.1, ease: EASE.reveal, stagger: 0.12 });

    return () => {
      tl.kill();
    };
  }, []);

  const date = draft.date ? formatDateLong(new Date(draft.date)) : null;
  const treatment = treatments.find((t) => t.slug === draft.treatment);

  return (
    <div ref={ref} className="py-4 text-center">
      <div className="mx-auto w-fit text-accent">
        <ToothMark className="h-20 w-auto" draw strokeWidth={1} />
      </div>

      <h3 className="display mt-8 text-h2">{site.booking.successTitle}</h3>
      <p className="mx-auto mt-4 max-w-[46ch] text-muted">{site.booking.successBody}</p>

      <dl className="mx-auto mt-9 grid max-w-sm gap-3 border-y border-line py-6 text-left">
        <Row label="Treatment" value={treatment?.name ?? "First visit"} />
        {date ? <Row label="Day" value={date} /> : null}
        {draft.time ? <Row label="Time" value={draft.time} /> : null}
        {reference ? <Row label="Reference" value={reference} /> : null}
      </dl>

      {has.phone ? (
        <p className="label mt-7">
          Need to change it? Call{" "}
          <a href={telHref(site.contact.phone)} className="text-accent underline underline-offset-4">
            {site.contact.phone}
          </a>
        </p>
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <dt className="label">{label}</dt>
      <dd className="font-mono text-sm">{value}</dd>
    </div>
  );
}
