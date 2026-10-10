import type { Metadata } from "next";
import { ChapterLabel, TickRule } from "@/components/ui/ChapterLabel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ThemeSection } from "@/components/motion/ThemeSection";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { ContactForm } from "@/components/sections/ContactForm";
import { site, fullAddress } from "@/content/site.config";
import { mapsHref, telHref, whatsappHref } from "@/lib/format";

export const metadata: Metadata = {
  title: "Contact",
  description: `Where to find ${site.brand.name} in ${site.contact.address.city}, when it is open, and how to reach a dentist out of hours.`,
  alternates: { canonical: "/contact" },
};

/**
 * Contact.
 *
 * The emergency route is the first thing on the page rather than a line in
 * the footer - someone arriving here at 9pm with a cracked molar should not
 * have to read a form first.
 */
export default function ContactPage() {
  return (
    <main id="main">
      <ThemeSection theme="paper" className="pt-[calc(var(--nav-h)+clamp(2rem,6vh,5rem))]">
        <div className="edge">
          <Reveal trigger="mount" y={12}>
            <ChapterLabel>Contact</ChapterLabel>
          </Reveal>

          <div className="mt-[clamp(1.5rem,4vh,2.5rem)] grid-editorial items-end gap-y-10">
            <div className="col-span-12 lg:col-span-7">
              <SplitReveal as="h1" trigger="mount" delay={0.1} className="display text-display">
                Come and see the bench.
              </SplitReveal>

              <Reveal trigger="mount" delay={0.35} className="mt-7 max-w-[44ch]">
                <p className="text-lead text-muted">
                  Walk in, call, or send a message and we will call you back. First visits are usually available
                  within two or three working days.
                </p>
              </Reveal>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <ParallaxImage
                image={{
                  src: "/images/contact-exterior.jpg",
                  alt: "The street entrance to the atelier at dusk",
                  width: 1600,
                  height: 1000,
                }}
                ratio="16/10"
                priority
                amount={8}
                sizes="(max-width: 1024px) 92vw, 40vw"
              />
            </div>
          </div>

          <TickRule className="mt-[clamp(2rem,5vh,3rem)]" />
        </div>
      </ThemeSection>

      {/* Emergency first. */}
      <ThemeSection theme="ink" className="py-[clamp(2rem,6vh,4rem)]">
        <div className="edge flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="relative flex h-2 w-2 shrink-0 rounded-pill bg-accent">
              <span className="absolute inset-0 animate-ping rounded-pill bg-accent opacity-60 reduce:animate-none" />
            </span>
            <div>
              <p className="label">In pain right now?</p>
              <p className="mt-2 max-w-[48ch] text-muted">
                We hold emergency slots every day. Out of hours, this number reaches a dentist rather than an
                answering service.
              </p>
            </div>
          </div>

          <a
            href={telHref(site.contact.emergencyPhone)}
            className="display text-h1 text-accent hover:underline"
            data-cursor-label="Call"
          >
            {site.contact.emergencyPhone}
          </a>
        </div>
      </ThemeSection>

      <ThemeSection theme="paper" className="section-y">
        <div className="edge grid-editorial gap-y-14">
          {/* Details */}
          <div className="col-span-12 lg:col-span-5">
            <p className="label">Find us</p>
            <a
              href={mapsHref(site.brand.name + ", " + fullAddress)}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-5 block text-lead leading-snug hover:text-accent"
              data-cursor-label="Map"
            >
              {site.contact.address.line1}
              <br />
              {site.contact.address.line2}
              <br />
              {site.contact.address.city} {site.contact.address.postalCode}
            </a>
            <p className="mt-4 text-sm text-muted">{site.contact.parkingNote}</p>

            <div className="mt-8 overflow-hidden rounded-mask border border-line">
              <iframe
                src={site.contact.mapEmbedSrc}
                title={"Map to " + site.brand.name}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[320px] w-full"
              />
            </div>

            <dl className="mt-10 space-y-5 border-t border-line pt-7">
              <div>
                <dt className="label">Reception</dt>
                <dd className="mt-2">
                  <a href={telHref(site.contact.phone)} className="text-lead hover:text-accent">
                    {site.contact.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label">WhatsApp</dt>
                <dd className="mt-2">
                  <a
                    href={whatsappHref(site.contact.whatsapp, `Hello ${site.brand.name}, I have a question.`)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-lead hover:text-accent"
                  >
                    {site.contact.whatsapp}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label">Email</dt>
                <dd className="mt-2">
                  <a href={"mailto:" + site.contact.email} className="text-lead hover:text-accent">
                    {site.contact.email}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-10">
              <p className="label">Hours</p>
              <ul className="mt-5 space-y-2 border-t border-line pt-5">
                {site.hours.map((h) => (
                  <li key={h.day} className="flex justify-between gap-6">
                    <span className="text-muted">{h.day}</span>
                    <span className={h.opens ? "font-mono text-sm" : "font-mono text-sm text-accent"}>
                      {h.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <p className="label">Send a message</p>
            <SplitReveal as="h2" className="display mt-5 max-w-[16ch] text-h1">
              We reply within two working hours.
            </SplitReveal>

            <Reveal className="mt-10" y={20}>
              <ContactForm />
            </Reveal>

            <div className="mt-12 border-t border-line pt-7">
              <p className="label">Would rather just book?</p>
              <div className="mt-5">
                <Button href="/#book" cursorLabel="Book">
                  {site.copy.bookCta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ThemeSection>
    </main>
  );
}
