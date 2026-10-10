"use client";

import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import { type ReactNode } from "react";
import { useEscapeKey, useFocusTrap, useMounted, useReducedMotion, useScrollLock } from "@/lib/hooks";
import { cx } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  label: string;
  /** "drawer" slides from the right on desktop; "sheet" rises on mobile. */
  variant?: "drawer" | "panel";
  className?: string;
};

/**
 * The one modal in the system, used by the doctor drawer and the booking
 * flow.
 *
 * It renders through a portal to document.body on purpose: this page pins
 * sections, and a `position: fixed` element inside a transformed ancestor is
 * positioned against that ancestor instead of the viewport. A modal that
 * works everywhere except inside the pinned rail is not a modal.
 *
 * Framer handles the enter/exit here rather than GSAP - presence animation
 * on a conditionally rendered tree is exactly what AnimatePresence is for,
 * and GSAP owns scroll, not UI state.
 */
export function Modal({ open, onClose, children, label, variant = "drawer", className }: Props) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const trapRef = useFocusTrap<HTMLDivElement>(open);

  useScrollLock(open);
  useEscapeKey(open, onClose);

  if (!mounted) return null;

  const isDrawer = variant === "drawer";

  const enter = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : {
        initial: isDrawer ? { x: "100%" } : { y: "4%", opacity: 0 },
        animate: isDrawer ? { x: 0 } : { y: 0, opacity: 1 },
        exit: isDrawer ? { x: "100%" } : { y: "3%", opacity: 0 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
      };

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0" style={{ zIndex: "var(--z-overlay)" }}>
          <motion.div
            className="absolute inset-0 bg-[var(--ink)]/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={trapRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            data-theme="paper"
            className={cx(
              "absolute bg-bg text-fg shadow-[var(--shadow-lift)]",
              isDrawer
                ? "inset-y-0 right-0 w-full max-w-[560px] overflow-y-auto"
                : "inset-x-0 bottom-0 max-h-[92svh] overflow-y-auto rounded-t-[var(--r-xl)] sm:inset-0 sm:m-auto sm:h-fit sm:max-h-[90svh] sm:max-w-[680px] sm:rounded-[var(--r-xl)]",
              className,
            )}
            data-lenis-prevent
            {...enter}
          >
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

/** Shared modal chrome: a sticky header with the close control. */
export function ModalHeader({ eyebrow, title, onClose }: { eyebrow?: string; title: string; onClose: () => void }) {
  return (
    <div className="sticky top-0 z-10 flex items-start justify-between gap-6 border-b border-line bg-bg/90 px-[clamp(1.25rem,3vw,2.5rem)] py-5 backdrop-blur-xl">
      <div>
        {eyebrow ? <p className="label">{eyebrow}</p> : null}
        <p className="display mt-1 text-h3">{title}</p>
      </div>
      <button onClick={onClose} className="label shrink-0 pt-1 hover:text-accent" data-cursor-label="Close">
        Close
      </button>
    </div>
  );
}
