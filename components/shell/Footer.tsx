"use client";

import { useRef } from "react";
import { EASE, ScrollTrigger, gsap, registerGsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { ThemeSection } from "@/components/motion/ThemeSection";
import { site, fullAddress } from "@/content/site.config";
import { sections } from "@/content/sections";
import { mapsHref, telHref, whatsappHref } from "@/lib/format";
import { TransitionLink } from "./PageTransition";
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
              <p className="mt-4 text-sm text-muted">{site.contact.parkingNote}</p>

              <div className="mt-8 overflow-hidden rounded-mask border border-line">
                <iframe
                  src={site.contact.mapEmbedSrc}
                  title={"Map to " + site.brand.name}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[220px] w-full grayscale-[0.4] contrast-[1.05]"
                />
              </div>
            </div>

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
              <p className="label">{sections.footer.emergencyLabel}</p>
              <a
                href={telHref(site.contact.emergencyPhone)}
                className="mt-5 block text-lead text-accent hover:underline"
                data-cursor-label="Call"
              >
                {site.contact.emergencyPhone}
              </a>
              <a href={telHref(site.contact.phone)} className="mt-3 block text-sm text-muted hover:text-fg">
                {site.contact.phone}
              </a>
              <a
                href={whatsappHref(site.contact.whatsapp, "Hello " + site.brand.name + ", I would like to book a visit.")}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 block text-sm text-muted hover:text-fg"
              >
                {site.copy.whatsappCta}
              </a>
              <a href={"mailto:" + site.contact.email} className="mt-3 block text-sm text-muted hover:text-fg">
                {site.contact.email}
              </a>
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
