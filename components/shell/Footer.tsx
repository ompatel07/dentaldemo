"use client";

import { useRef } from "react";
import { EASE, ScrollTrigger, gsap, registerGsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { ThemeSection } from "@/components/motion/ThemeSection";
import { site, fullAddress, has } from "@/content/site.config";
import { sections } from "@/content/sections";
import { mapsHref, telHref, whatsappHref } from "@/lib/format";
import { TransitionLink } from "./PageTransition";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * The footer.
 *
 * The wordmark is the point: it rises from below the fold as the footer
 * enters, scrubbed to scroll, and is clipped by its own mask so it reads as
 * one letterpress impression rather than a logo sitting on a page.
 */
export function Footer() {
  const rootRef = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerGsap();

    const ctx = gsap.context(() => {
      const mark = root.querySelector<HTMLElement>("[data-footer-mark]");
      if (!mark) return;

      if (prefersReducedMotion()) {
        gsap.set(mark, { yPercent: 0 });
        return;
      }

      gsap.fromTo(
        mark,
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: EASE.quart,
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      );
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  const year = new Date().getFullYear();

  return (
    <ThemeSection theme="ink" as="footer" id="site-footer" className="relative overflow-hidden">
      <div ref={rootRef as never}>
        <div className="edge pb-10 pt-[clamp(4rem,10vh,8rem)]">
          <div className="grid-editorial gap-y-12">
            {has.address ? (
              <div className="col-span-12 lg:col-span-5">
                <p className="label">{sections.footer.findLabel}</p>
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
                {site.contact.parkingNote ? <p className="mt-4 text-sm text-muted">{site.contact.parkingNote}</p> : null}

                {has.map ? <MapEmbed className="mt-8" /> : null}
              </div>
            ) : (
              /* No address yet: the column says what the place is and
                 offers the one action, rather than standing empty. */
              <div className="col-span-12 lg:col-span-5">
                <p className="display max-w-[12ch] text-h1">{site.brand.tagline}</p>
                <p className="mt-5 max-w-[38ch] text-muted">{site.brand.concept}</p>
                <p className="mt-6 text-sm font-medium">
                  <OpenStatus />
                </p>
                <TransitionLink
                  href="/#book"
                  className="tap mt-6 inline-flex items-center gap-2 rounded-pill bg-accent-bright px-6 text-sm font-medium text-accent-fg transition-colors hover:bg-[var(--paper)]"
                  data-cursor-label="Book"
                >
                  {site.copy.bookCta}
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </TransitionLink>
              </div>
            )}

            <div className="col-span-6 lg:col-span-3">
              <p className="label">{sections.footer.hoursLabel}</p>
              <ul className="mt-5 space-y-1.5 text-sm">
                {site.hours.map((h) => (
                  <li key={h.day} className="flex justify-between gap-4">
                    <span className="text-muted">{h.day.slice(0, 3)}</span>
                    <span className={h.opens ? "" : "text-accent"}>{h.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-6 lg:col-span-2">
              <p className="label">{sections.footer.label}</p>
              <ul className="mt-5 space-y-1.5">
                {site.footerNav.map((item) => (
                  <li key={item.href}>
                    <TransitionLink href={item.href} className="hover:text-accent">
                      {item.label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
              <ul className="mt-6 space-y-1.5">
                {site.socials.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noreferrer noopener" className="text-muted hover:text-accent">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-12 lg:col-span-2">
              <p className="label">{has.emergencyPhone ? sections.footer.emergencyLabel : sections.footer.contactLabel}</p>
              {has.emergencyPhone ? (
                <a
                  href={telHref(site.contact.emergencyPhone)}
                  className="mt-5 block text-lead text-accent hover:underline"
                  data-cursor-label="Call"
                >
                  {site.contact.emergencyPhone}
                </a>
              ) : null}
              {has.phone ? (
                <a href={telHref(site.contact.phone)} className="mt-3 block text-sm text-muted hover:text-fg">
                  {site.contact.phone}
                </a>
              ) : null}
              {has.whatsapp ? (
                <a
                  href={whatsappHref(site.contact.whatsapp, "Hello " + site.brand.name + ", I would like to book a visit.")}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 block text-sm text-muted hover:text-fg"
                >
                  {site.copy.whatsappCta}
                </a>
              ) : null}
              <a href={"mailto:" + site.contact.email} className={(has.emergencyPhone ? "mt-3" : "mt-5") + " block break-words text-sm text-muted hover:text-fg"}>
                {site.contact.email}
              </a>
              <TransitionLink href="/contact" className="mt-3 block text-sm text-muted hover:text-fg">
                Send a message
              </TransitionLink>
            </div>
          </div>
        </div>

        {/* The wordmark: clipped by its own mask, rising on scrub. */}
        <div className="edge">
          <div className="overflow-hidden" aria-hidden="true">
            <p
              data-footer-mark
              className="display w-full text-center leading-[0.78] tracking-[-0.045em] will-change-transform"
              style={{ fontSize: "clamp(4rem, 21.5vw, 24rem)" }}
            >
              {site.brand.wordmark}
            </p>
          </div>
        </div>

        <div className="edge rule-t flex flex-wrap items-center justify-between gap-4 py-6">
          <p className="label">
            &copy; {year} {site.brand.name} {site.brand.suffix}
          </p>
          <p className="label">{sections.footer.legal}</p>
          <p className="label">{sections.footer.credit}</p>
        </div>
      </div>
    </ThemeSection>
  );
}
