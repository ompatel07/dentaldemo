"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { EASE, gsap, prefersReducedMotion, registerGsap, scrollToTarget, ScrollTrigger } from "@/lib/gsap";
import { ToothMark } from "@/components/ui/ToothMark";

type NavigateFn = (href: string) => void;

const TransitionContext = createContext<NavigateFn | null>(null);

export const useAppNavigate = (): NavigateFn => {
  const fn = useContext(TransitionContext);
  const router = useRouter();
  return fn ?? ((href: string) => router.push(href));
};

/** Clearance for the fixed nav when jumping to an anchor. */
function navOffset(): number {
  if (typeof window === "undefined") return -80;
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--nav-h");
  const parsed = parseFloat(raw);
  return -(Number.isFinite(parsed) && parsed > 0 ? parsed + 16 : 80);
}

/** Splits "/treatments#faq" into its path and hash. */
function parse(href: string): { path: string; hash: string } {
  const [path, hash] = href.split("#");
  return { path: path || "/", hash: hash ? `#${hash}` : "" };
}

/**
 * Curtain page transitions.
 *
 * A link click raises an ink curtain, pushes the route behind it, then lowers
 * the curtain once the new page is mounted - so the viewer never sees a blank
 * frame or a layout settling. Same-page hash links skip all of it and simply
 * scroll, and cross-page hash links scroll once the curtain is clear.
 *
 * Under reduced motion the curtain never appears; navigation is instant.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const curtainRef = useRef<HTMLDivElement | null>(null);
  const pendingHash = useRef<string | null>(null);
  const covering = useRef(false);
  const mounted = useRef(false);

  const navigate = useCallback<NavigateFn>(
    (href) => {
      const { path, hash } = parse(href);
      const samePage = path === pathname;

      // In-page anchor: Lenis does the work, no route change at all.
      //
      // Deferred by a frame on purpose. A link inside the menu overlay runs
      // this in the same tick as the click that closes the menu, and the
      // scroll lock is only released in the effect that follows - so a
      // synchronous scrollTo would be issued to a stopped Lenis and quietly
      // do nothing.
      if (samePage) {
        requestAnimationFrame(() => scrollToTarget(hash || 0, hash ? navOffset() : 0));
        return;
      }

      const curtain = curtainRef.current;
      if (!curtain || prefersReducedMotion()) {
        pendingHash.current = hash || null;
        router.push(href);
        return;
      }

      registerGsap();
      pendingHash.current = hash || null;
      covering.current = true;

      gsap
        .timeline()
        .set(curtain, { display: "block", yPercent: 100, autoAlpha: 1 })
        .to(curtain, { yPercent: 0, duration: 0.55, ease: EASE.reveal })
        .to(curtain.querySelector("[data-curtain-mark]"), { autoAlpha: 1, duration: 0.3 }, "-=0.25")
        .add(() => router.push(href));
    },
    [pathname, router],
  );

  useEffect(() => {
    // Skip the mount pass: there is no curtain to lower on first paint.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    const finish = () => {
      // Every page opens ivory. Without this, leaving the home page from a
      // dark section carries data-theme="ink" onto a page whose first
      // section is ivory, and the new page flashes dark until its own
      // ScrollTrigger corrects it.
      document.documentElement.dataset.theme = "paper";

      if (pendingHash.current) {
        scrollToTarget(pendingHash.current, navOffset());
        pendingHash.current = null;
      }
      ScrollTrigger.refresh();
    };

    const curtain = curtainRef.current;
    if (!covering.current || !curtain) {
      finish();
      return;
    }
    covering.current = false;

    gsap
      .timeline({
        onComplete: () => {
          gsap.set(curtain, { display: "none" });
          finish();
        },
      })
      .to(curtain.querySelector("[data-curtain-mark]"), { autoAlpha: 0, duration: 0.2 })
      .to(curtain, { yPercent: -100, duration: 0.8, ease: EASE.reveal }, "-=0.1");
  }, [pathname]);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 hidden bg-[var(--ink)]"
        style={{ zIndex: "var(--z-overlay)" }}
      >
        <div data-curtain-mark className="grid h-full place-items-center opacity-0">
          <ToothMark className="h-16 w-auto text-[var(--mint-strong)]" strokeWidth={1} />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

type LinkProps = { href: string; children: ReactNode } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

/**
 * A real <Link> - prefetching, middle-click, cmd-click and right-click all
 * behave normally - that routes plain left clicks through the curtain.
 */
export function TransitionLink({ href, children, onClick, ...rest }: LinkProps) {
  const navigate = useAppNavigate();

  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
