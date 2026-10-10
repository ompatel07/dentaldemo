"use client";

import { useRef } from "react";
import { EASE, ScrollTrigger, gsap, registerGsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { site } from "@/content/site.config";
import { telHref } from "@/lib/format";
import { TransitionLink } from "./PageTransition";

/**
 * The persistent dock: booking is one tap from anywhere, and the emergency
 * number never requires navigation.
 *
 * It lives in the bottom-right corner on desktop. Centred, it sat on top of
 * whatever the reader was looking at - card captions, buttons, the last line
 * of a paragraph - and read as a layout bug. In the corner it is out of the
 * reading column; on a phone it becomes a full-width bar, which is where a
 * thumb expects it.
 *
 * It appears once the hero is behind you and steps aside at the footer,
 * which already offers both actions at full size.
 */
export function Dock() {
  const dockRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;

    registerGsap();

    const ctx = gsap.context(() => {
      gsap.set(dock, { yPercent: 140, autoAlpha: 0 });

      const reveal = gsap.to(dock, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: EASE.expo, paused: true });

      let shown = false;
      let pastHero = false;
      let atFooter = false;

      const sync = () => {
        const next = pastHero && !atFooter;
        if (next === shown) return;
        shown = next;
        if (next) reveal.play();
        else reveal.reverse();
      };

      const heroTrigger = ScrollTrigger.create({
        start: () => window.innerHeight * 0.7,
        end: "max",
        onToggle: (self) => {
          pastHero = self.isActive;
          sync();
        },
      });

      const footer = document.getElementById("site-footer");
      const footerTrigger = footer
        ? ScrollTrigger.create({
            trigger: footer,
            start: "top bottom-=15%",
            end: "max",
            onToggle: (self) => {
              atFooter = self.isActive;
              sync();
            },
          })
        : null;

      return () => {
        heroTrigger.kill();
        footerTrigger?.kill();
      };
    }, dock);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={dockRef}
      data-theme="ink"
      className="invisible fixed inset-x-3 bottom-3 flex items-center gap-1.5 rounded-pill bg-bg p-1.5 text-fg shadow-[var(--shadow-lift)] print:hidden sm:inset-x-auto sm:bottom-5 sm:right-5"
      style={{ zIndex: "var(--z-dock)" }}
    >
      <TransitionLink
        href="/#book"
        className="tap flex flex-1 items-center justify-center gap-2 rounded-pill bg-accent-bright px-5 text-[0.875rem] font-medium text-accent-fg transition-colors hover:bg-[var(--paper)] sm:flex-none"
        data-cursor-label="Book"
      >
        {site.copy.bookShort}
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </TransitionLink>

      <a
        href={telHref(site.contact.emergencyPhone)}
        className="tap flex items-center justify-center gap-2.5 rounded-pill px-4 text-[0.875rem] font-medium transition-colors hover:text-accent"
        data-cursor-label="Call"
        aria-label={site.copy.emergencyCta}
      >
        <span aria-hidden="true" className="relative flex h-2 w-2 shrink-0 rounded-pill bg-accent-bright">
          <span className="absolute inset-0 animate-ping rounded-pill bg-accent-bright opacity-60 reduce:animate-none" />
        </span>
        {/* The short word, at every width: a floating control should take as
            little of the page as it can. The full phrase is the link's name. */}
        <span>{site.copy.emergencyShort}</span>
      </a>
    </div>
  );
}
