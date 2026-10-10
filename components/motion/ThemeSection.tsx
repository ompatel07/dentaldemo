"use client";

import { useRef, type ReactNode } from "react";
import { ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { cx } from "@/lib/utils";

export type Theme = "paper" | "ink" | "mint" | "sand";

type Props = {
  children: ReactNode;
  theme?: Theme;
  id?: string;
  className?: string;
  as?: "section" | "div" | "footer";
  /** Fraction of the viewport at which this section takes over the page. */
  switchAt?: number;
  label?: string;
};

/**
 * A top-level section that owns its palette.
 *
 * `data-theme` re-points the semantic tokens for everything inside, so child
 * components never know which palette they are in. As the section crosses the
 * viewport midpoint it also sets the same theme on <html>, which is what makes
 * the page background glide between ivory and ink instead of cutting.
 */
export function ThemeSection({
  children,
  theme = "paper",
  id,
  className,
  as: Tag = "section",
  switchAt = 0.55,
  label,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerGsap();

    const apply = () => {
      if (document.documentElement.dataset.theme !== theme) {
        document.documentElement.dataset.theme = theme;
      }
    };

    const st = ScrollTrigger.create({
      trigger: el,
      start: `top ${switchAt * 100}%`,
      end: `bottom ${switchAt * 100}%`,
      onEnter: apply,
      onEnterBack: apply,
      invalidateOnRefresh: true,
    });

    return () => st.kill();
  }, [switchAt, theme]);

  return (
    <Tag
      ref={ref as never}
      id={id}
      data-theme={theme}
      aria-label={label}
      className={cx("relative bg-bg text-fg", className)}
    >
      {children}
    </Tag>
  );
}
