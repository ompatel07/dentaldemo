"use client";

import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Text roll-over: the label slides up out of view while an identical copy
 * slides in from below. Pure CSS (group-hover + focus-within) so it costs
 * nothing at runtime and keeps working if JS fails.
 *
 * The duplicate is aria-hidden, so screen readers hear the label once.
 */
export function TextRoll({ children, className }: Props) {
  return (
    <span className={cx("relative inline-block overflow-hidden align-middle", className)} data-text-roll>
      <span className="block transition-transform duration-[var(--dur-ui)] ease-[var(--ease-expo)] group-hover/roll:-translate-y-full group-focus-visible/roll:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full transition-transform duration-[var(--dur-ui)] ease-[var(--ease-expo)] group-hover/roll:translate-y-0 group-focus-visible/roll:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}
