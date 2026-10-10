"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { TextRoll } from "@/components/motion/TextRoll";
import { cx } from "@/lib/utils";

type Variant = "solid" | "accent" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Lean toward the pointer. Off inside tight layouts and long lists. */
  magnetic?: boolean;
  /** Label shown by the custom cursor on hover. */
  cursorLabel?: string;
  /** The trailing arrow chip. On by default for filled buttons. */
  arrow?: boolean;
};

/**
 * Semantic tokens only, so every variant follows its section's palette.
 * `accent` is the coral fill - the one loud thing on the page, reserved for
 * the primary action.
 */
const VARIANTS: Record<Variant, string> = {
  solid: "bg-fg text-bg hover:bg-accent-bright hover:text-accent-fg",
  accent: "bg-accent-bright text-accent-fg hover:bg-fg hover:text-bg",
  outline: "border border-line-strong text-fg hover:border-fg hover:bg-fg hover:text-bg",
  ghost: "text-fg hover:text-accent",
};

const SIZES: Record<Size, string> = {
  sm: "h-11 pl-5 pr-5 text-[0.875rem]",
  md: "h-[3.25rem] pl-6 pr-6 text-[0.9375rem]",
  lg: "h-[3.75rem] pl-8 pr-8 text-base",
};

/** With an arrow chip the right padding tightens so the chip sits inset. */
const SIZES_ARROW: Record<Size, string> = {
  sm: "h-11 pl-5 pr-1.5 text-[0.875rem]",
  md: "h-[3.25rem] pl-6 pr-2 text-[0.9375rem]",
  lg: "h-[3.75rem] pl-8 pr-2.5 text-base",
};

const CHIP: Record<Size, string> = { sm: "h-8 w-8", md: "h-9 w-9", lg: "h-10 w-10" };

const base =
  "group/roll tap relative inline-flex items-center justify-center gap-3 rounded-pill font-medium leading-none transition-colors duration-[var(--dur-ui)] ease-[var(--ease-expo)] select-none disabled:pointer-events-none disabled:opacity-40";

function Arrow({ size }: { size: Size }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "grid shrink-0 place-items-center overflow-hidden rounded-pill bg-bg/15 transition-transform duration-[var(--dur-ui)] ease-[var(--ease-expo)] group-hover/roll:translate-x-0.5",
        CHIP[size],
      )}
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

type AnchorProps = BaseProps & { href: string } & Omit<ComponentPropsWithoutRef<"a">, keyof BaseProps | "href">;
type ButtonProps = BaseProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps>;

/**
 * The one button in the system: pill, magnetic lean, label roll-over on
 * hover and keyboard focus, and an arrow chip on the filled variants.
 *
 * Renders an <a> when given `href` and a <button> otherwise, so a link is
 * never faked with a click handler.
 */
export function Button(props: AnchorProps | ButtonProps) {
  const { children, variant = "solid", size = "md", className, magnetic = true, cursorLabel, arrow, ...rest } = props;

  const withArrow = arrow ?? (variant === "solid" || variant === "accent");
  const classes = cx(base, VARIANTS[variant], withArrow ? SIZES_ARROW[size] : SIZES[size], className);
  const cursor = cursorLabel ? { "data-cursor-label": cursorLabel } : {};

  const inner = (
    <>
      <TextRoll>
        <span className="whitespace-nowrap">{children}</span>
      </TextRoll>
      {withArrow ? <Arrow size={size} /> : null}
    </>
  );

  const node =
    "href" in props && props.href !== undefined ? (
      <Link href={props.href} className={classes} {...cursor} {...(rest as Omit<ComponentPropsWithoutRef<"a">, "href">)}>
        {inner}
      </Link>
    ) : (
      <button className={classes} {...cursor} {...(rest as ComponentPropsWithoutRef<"button">)}>
        {inner}
      </button>
    );

  return magnetic ? <Magnetic strength={8}>{node}</Magnetic> : node;
}
