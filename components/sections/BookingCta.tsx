"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { ThemeSection } from "@/components/motion/ThemeSection";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ChapterLabel } from "@/components/ui/ChapterLabel";
import { Button } from "@/components/ui/Button";
import { has, site } from "@/content/site.config";
import { sections } from "@/content/sections";
import { telHref, whatsappHref } from "@/lib/format";

/**
 * The flow is several hundred lines of calendar, form and presence
 * animation that nobody sees until they click. Loading it on demand keeps
 * it - and Framer with it - out of the first-load bundle.
 */
const BookingModal = dynamic(() => import("@/components/booking/BookingModal").then((m) => m.BookingModal), { ssr: false });

/**
 * 14 - Booking.
 *
 * One dark card over a photograph of the chair itself, with the headline as
 * the button: it is an actual <button> at display scale, and it opens the
 * flow. The largest thing on the screen is the primary action.
 *
 * Any link to #book-now opens the flow directly, so a campaign or a QR code
 * can land someone straight in the calendar.
 */
export function BookingCta() {
  const [open, setOpen] = useState(false);
  // Mounted on first open and kept there, so closing can animate out.
  const [loaded, setLoaded] = useState(false);
  const { book } = sections;

  const show = useCallback(() => {
    setLoaded(true);
    setOpen(true);
  }, []);

  useEffect(() => {
    const fromHash = () => {
      if (window.location.hash === "#book-now") show();
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [show]);

  return (
    <ThemeSection theme="paper" id="book" className="px-[clamp(0.75rem,1.6vw,1.5rem)] pb-[clamp(0.75rem,1.6vw,1.5rem)] pt-[var(--section-y)]">
      <div data-theme="ink" className="relative isolate overflow-hidden rounded-[var(--r-xl)] bg-bg text-fg">
        <Image src="/images/booking-room.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-45" loading="lazy" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[var(--ink)] via-[var(--ink)]/80 to-[var(--ink)]/20" />

        <div className="mx-auto w-full max-w-[var(--max-w)] px-[clamp(1.25rem,4vw,4.5rem)] py-[clamp(3rem,9vh,6.5rem)]">
          <Reveal y={14}>
            <ChapterLabel chapter={book.chapter}>{book.label}</ChapterLabel>
          </Reveal>

          <button
            onClick={show}
            className="group/book mt-6 block text-left"
            data-cursor-label="Book"
            /* SplitText splits this into characters, so it needs a name. */
            aria-label={book.headline}
          >
            <SplitReveal as="span" by="chars" stagger={0.025} className="display block text-hero transition-colors duration-500 group-hover/book:text-accent">
              {book.headline}
            </SplitReveal>
          </button>

          <div className="mt-[clamp(1.5rem,4vh,2.75rem)] grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,42rem)_1fr] lg:items-end">
            <div>
              <Reveal y={18}>
                <p className="max-w-[34rem] text-lead text-muted">{book.body}</p>
              </Reveal>

              <Reveal className="mt-7 flex flex-wrap items-center gap-3" y={16}>
                <Button onClick={show} variant="accent" size="lg" cursorLabel="Book">
                  {site.copy.bookCta}
                </Button>
                {has.phone ? (
                  <Button href={telHref(site.contact.phone)} variant="outline" size="lg" cursorLabel="Call">
                  {site.copy.callCta}
                </Button>
                ) : null}
                {has.whatsapp ? (
                  <Button
                  href={whatsappHref(site.contact.whatsapp, `Hello ${site.brand.name}, I would like to book a visit.`)}
                  variant="ghost"
                  size="lg"
                  cursorLabel="Chat"
                >
                  {site.copy.whatsappCta}
                </Button>
                ) : null}
              </Reveal>
            </div>

            <Reveal as="dl" className="grid gap-px overflow-hidden rounded-[var(--r-lg)] bg-line sm:grid-cols-3 lg:justify-self-end" stagger={0.06} y={14}>
              {book.promises.map((p) => (
                <div key={p.label} className="bg-surface/80 p-5 backdrop-blur-md">
                  <dt className="text-sm font-medium text-accent">{p.label}</dt>
                  <dd className="mt-2 max-w-[22ch] text-sm text-muted">{p.body}</dd>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>

      {loaded ? <BookingModal open={open} onClose={() => setOpen(false)} /> : null}
    </ThemeSection>
  );
}
