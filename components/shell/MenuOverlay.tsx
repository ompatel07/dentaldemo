"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { EASE, gsap, registerGsap } from "@/lib/gsap";
import { useEscapeKey, useFocusTrap, useIsomorphicLayoutEffect, useScrollLock } from "@/lib/hooks";
import { has, site } from "@/content/site.config";
import { sections } from "@/content/sections";
import { telHref } from "@/lib/format";
import { TransitionLink } from "./PageTransition";
import { pad2 } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";
import { ToothMark } from "@/components/ui/ToothMark";
import { OpenStatus } from "@/components/ui/OpenStatus";

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Fullscreen menu.
 *
 * Links at display scale on the left, staggering in behind a clip-path wipe;
 * on the right a photograph that crossfades to match whichever link is
 * hovered, carrying the opening hours and the booking button. It is a modal
 * dialog: scroll locked, focus trapped, Escape closes, and the photographs
 * are decorative so they carry no alt text.
 *
 * Open and close are one timeline each, killed rather than reverted, so a
 * close that interrupts an open picks up from wherever the wipe had reached.
 */
export function MenuOverlay({ open, onClose }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRun = useRef(true);
  const [active, setActive] = useState<number | null>(null);

  const trapRef = useFocusTrap<HTMLDivElement>(open);
  useScrollLock(open);
  useEscapeKey(open, onClose);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    registerGsap();

    const reduced = prefersReducedMotion();
    const items = root.querySelectorAll<HTMLElement>("[data-menu-item] > *");
    const meta = root.querySelectorAll<HTMLElement>("[data-menu-meta]");

    tlRef.current?.kill();

    // Nothing to animate on the first pass - the menu starts closed.
    if (firstRun.current) {
      firstRun.current = false;
      gsap.set(root, { display: "none" });
      return;
    }

    if (reduced) {
      gsap.set(root, open ? { display: "block", autoAlpha: 1, clipPath: "none" } : { display: "none" });
      gsap.set([...items, ...meta], { autoAlpha: 1, yPercent: 0, y: 0 });
      return;
    }

    if (open) {
      tlRef.current = gsap
        .timeline()
        .set(root, { display: "block", autoAlpha: 1, clipPath: "inset(0% 0% 100% 0%)" })
        .set(items, { yPercent: 115 })
        .set(meta, { autoAlpha: 0, y: 18 })
        .to(root, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: EASE.reveal })
        .to(items, { yPercent: 0, duration: 0.95, ease: EASE.reveal, stagger: 0.055 }, "-=0.5")
        .to(meta, { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE.expo, stagger: 0.05 }, "-=0.6");
    } else {
      tlRef.current = gsap
        .timeline({
          onComplete: () => {
            gsap.set(root, { display: "none" });
            setActive(null);
          },
        })
        .to(items, { yPercent: -115, duration: 0.5, ease: EASE.reveal, stagger: 0.03 }, 0)
        .to(meta, { autoAlpha: 0, duration: 0.3 }, 0)
        .to(root, { clipPath: "inset(100% 0% 0% 0%)", duration: 0.6, ease: EASE.reveal }, 0.15);
    }

    return () => {
      tlRef.current?.kill();
    };
  }, [open]);

  // The picture never goes blank: with nothing hovered it shows the first.
  const shown = active ?? 0;

  return (
    <div
      ref={rootRef}
      data-theme="ink"
      className="fixed inset-0 hidden bg-bg text-fg"
      style={{ zIndex: "var(--z-overlay)" }}
      aria-hidden={!open}
      inert={!open}
    >
      <div ref={trapRef} role="dialog" aria-modal="true" aria-label={site.copy.menuOpen} className="relative flex h-full flex-col">
        <div className="edge flex h-[var(--nav-h)] shrink-0 items-center justify-between">
          <p className="flex items-center gap-2.5 text-[1.0625rem] font-semibold tracking-[-0.02em]">
            <span className="text-accent">
              <ToothMark className="h-6 w-auto" strokeWidth={1.6} showCrown={false} />
            </span>
            {site.brand.name}
          </p>
          <button
            onClick={onClose}
            className="tap flex items-center gap-2.5 rounded-pill border border-line-strong px-5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
            data-cursor-label="Close"
          >
            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {site.copy.menuClose}
          </button>
        </div>

        <div className="edge grid min-h-0 flex-1 items-stretch gap-x-[clamp(1.5rem,4vw,5rem)] py-[clamp(0.5rem,2vh,1.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)]">
          <nav className="flex flex-col justify-center gap-[clamp(1.5rem,4vh,2.5rem)]" aria-label="Main">
            <ul className="w-full" onMouseLeave={() => setActive(null)}>
              {site.nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden" data-menu-item>
                  <div>
                    <TransitionLink
                      href={item.href}
                      onClick={onClose}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      className="group/link flex items-baseline gap-4 py-[clamp(0.1rem,0.7vh,0.5rem)] transition-colors duration-500 hover:text-accent"
                      data-cursor-label={site.copy.viewLabel}
                    >
                      <span className="w-7 shrink-0 font-mono text-xs font-medium text-muted transition-colors group-hover/link:text-accent">
                        {pad2(i + 1)}
                      </span>
                      {/* Sized against height as well as width, so all six
                          fit a short laptop window with the footer row. */}
                      <span className="display text-[clamp(2rem,min(10vw,7.4svh),3.5rem)] leading-[1.04] lg:text-[clamp(2.1rem,min(6.4vw,9svh),5.5rem)]">{item.label}</span>
                    </TransitionLink>
                  </div>
                </li>
              ))}
            </ul>

            {/* On phones there is no photograph to carry the booking
                button, so it sits under the list at full width. */}
            <div data-menu-meta className="flex flex-wrap items-center gap-3 lg:hidden">
              <TransitionLink
                href="/#book"
                onClick={onClose}
                className="tap flex flex-1 items-center justify-center gap-2 rounded-pill bg-accent-bright px-6 font-medium text-accent-fg"
              >
                {site.copy.bookCta}
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </TransitionLink>
              <p className="text-sm font-medium">
                <OpenStatus />
              </p>
            </div>
          </nav>

          {/* The room, and the one thing most people opened the menu to do. */}
          <div data-menu-meta className="relative hidden min-h-0 overflow-hidden rounded-[var(--r-xl)] bg-surface lg:block">
            {site.nav.map((item, i) =>
              item.preview ? (
                <Image
                  key={item.href}
                  src={item.preview.src}
                  alt=""
                  fill
                  sizes="34vw"
                  loading="lazy"
                  className="object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-expo)]"
                  style={{ opacity: shown === i ? 1 : 0, transform: `scale(${shown === i ? 1 : 1.05})` }}
                />
              ) : null,
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/75 via-transparent to-transparent" />
            <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-end justify-between gap-3">
              <p className="rounded-pill bg-[var(--paper)]/92 px-4 py-2.5 text-sm font-medium text-[var(--ink)] backdrop-blur-md">
                <OpenStatus />
              </p>
              <TransitionLink
                href="/#book"
                onClick={onClose}
                className="tap flex items-center gap-2 rounded-pill bg-accent-bright px-5 text-sm font-medium text-accent-fg transition-colors hover:bg-[var(--paper)]"
                data-cursor-label="Book"
              >
                {site.copy.bookShort}
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </TransitionLink>
            </div>
          </div>
        </div>

        <div className="edge grid shrink-0 gap-x-8 gap-y-5 border-t border-line pb-[clamp(1.25rem,3vh,2.25rem)] pt-[clamp(1rem,2.4vh,1.75rem)] sm:grid-cols-3">
          {/* Phone and address appear once the clinic has supplied them;
              until then the same two columns carry email and hours. */}
          <div data-menu-meta>
            {has.phone || has.emergencyPhone ? (
              <>
                <p className="label mb-1.5">Call</p>
                {has.phone ? (
                  <a href={telHref(site.contact.phone)} className="block hover:text-accent">
                    {site.contact.phone}
                  </a>
                ) : null}
                {has.emergencyPhone ? (
                  <a href={telHref(site.contact.emergencyPhone)} className="mt-0.5 block text-accent">
                    {site.contact.emergencyPhone} &mdash; emergency
                  </a>
                ) : null}
              </>
            ) : (
              <>
                <p className="label mb-1.5">Write</p>
                <a href={"mailto:" + site.contact.email} className="block hover:text-accent">
                  {site.contact.email}
                </a>
              </>
            )}
          </div>

          <div data-menu-meta>
            {has.address ? (
              <>
                <p className="label mb-1.5">{sections.footer.findLabel}</p>
                <p>
                  {site.contact.address.line1}
                  <br />
                  {site.contact.address.line2}, {site.contact.address.city}
                </p>
              </>
            ) : (
              <>
                <p className="label mb-1.5">{sections.footer.hoursLabel}</p>
                <p>
                  <OpenStatus />
                </p>
                {has.city ? <p className="text-muted">{site.contact.address.city}</p> : null}
              </>
            )}
          </div>

          <div data-menu-meta>
            <p className="label mb-1.5">{sections.footer.socialLabel}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer noopener" className="hover:text-accent">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
