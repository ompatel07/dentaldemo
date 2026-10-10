"use client";

import { useRef, useState } from "react";
import { EASE, ScrollTrigger, gsap, registerGsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { site } from "@/content/site.config";
import { TransitionLink } from "./PageTransition";
import { MenuOverlay } from "./MenuOverlay";
import { ScrollProgress } from "./ScrollProgress";
import { ToothMark } from "@/components/ui/ToothMark";
import { telHref } from "@/lib/format";

/**
 * The top bar.
 *
 * Minimal by design: wordmark, a short set of inline links on large screens,
 * and the menu toggle. Booking lives in the dock, which is always on screen,
 * so the bar does not need to carry it.
 *
 * It hides on scroll down and returns on scroll up - the standard behaviour,
 * but gated so it never hides inside the hero, and never while the menu is
 * open. The blurred backdrop only appears once the page has actually moved.
 */
export function Nav() {
  const barRef = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuOpenRef = useRef(false);
  menuOpenRef.current = menuOpen;

  useIsomorphicLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    registerGsap();

    const ctx = gsap.context(() => {
      const show = gsap.quickTo(bar, "yPercent", { duration: 0.45, ease: EASE.expo });
      let hidden = false;

      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          bar.dataset.scrolled = y > 24 ? "true" : "false";

          if (menuOpenRef.current || y < 120) {
            if (hidden) {
              hidden = false;
              show(0);
            }
            return;
          }

          const down = self.direction === 1;
          if (down && !hidden) {
            hidden = true;
            show(-100);
          } else if (!down && hidden) {
            hidden = false;
            show(0);
          }
        },
      });

      return () => st.kill();
    }, bar);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <ScrollProgress />

      <header
        ref={barRef}
        data-scrolled="false"
        className="group/nav fixed inset-x-0 top-0 h-[var(--nav-h)] will-change-transform"
        style={{ zIndex: "var(--z-nav)" }}
      >
        {/* Backdrop is a sibling so the bar's own transform never blurs twice. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 border-b border-line/0 bg-bg/0 backdrop-blur-0 transition-[background-color,backdrop-filter,border-color] duration-500 ease-[var(--ease-expo)] group-data-[scrolled=true]/nav:border-line group-data-[scrolled=true]/nav:bg-bg/70 group-data-[scrolled=true]/nav:backdrop-blur-xl"
        />

        <div className="edge relative flex h-full items-center justify-between gap-6">
          <TransitionLink href="/" className="tap flex shrink-0 items-center gap-2.5">
            <ToothMark className="h-6 w-auto text-accent" strokeWidth={1.6} showCrown={false} />
            <span className="display text-[1.35rem] leading-none">{site.brand.name}</span>
            {/* The visible wordmark is the link's name; a separate aria-label
                would have to repeat it verbatim to satisfy WCAG 2.5.3. */}
            <span className="sr-only">, home</span>
          </TransitionLink>

          {/* A pill of links, so the bar reads as an object rather than as
              words floating over a photograph. */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-pill border border-line bg-surface-2/70 p-1 backdrop-blur-md">
              {site.nav.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <TransitionLink
                    href={item.href}
                    className="block rounded-pill px-4 py-2 text-[0.875rem] font-medium leading-none text-fg/80 transition-colors hover:bg-fg hover:text-bg"
                  >
                    {item.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={telHref(site.contact.phone)}
              className="hidden h-11 items-center rounded-pill px-4 text-[0.875rem] font-medium hover:text-accent xl:flex"
            >
              {site.contact.phone}
            </a>
            <TransitionLink
              href="/#book"
              className="hidden h-11 items-center rounded-pill bg-fg px-5 text-[0.875rem] font-medium text-bg transition-colors hover:bg-accent-bright hover:text-accent-fg sm:flex"
              data-cursor-label="Book"
            >
              {site.copy.bookShort}
            </TransitionLink>
            <button
              onClick={() => setMenuOpen(true)}
              className="tap flex h-11 items-center gap-2.5 rounded-pill border border-line-strong px-4 text-[0.875rem] font-medium transition-colors hover:bg-fg hover:text-bg"
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              data-cursor-label={site.copy.menuOpen}
            >
              <span className="flex flex-col gap-[4px]" aria-hidden="true">
                <span className="block h-[1.5px] w-4 bg-current" />
                <span className="block h-[1.5px] w-4 bg-current" />
              </span>
              {site.copy.menuOpen}
            </button>
          </div>
        </div>
      </header>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
