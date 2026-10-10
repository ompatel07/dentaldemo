"use client";

import { useId, useState } from "react";
import { pad2 } from "@/lib/utils";
import type { Faq } from "@/content/types";

/**
 * The accordion, shared by the home FAQ and every treatment page.
 *
 * The height animation is pure CSS: a grid whose single row eases between
 * `0fr` and `1fr`. That beats both of the usual approaches - a guessed
 * max-height either clips long answers or eases against empty space, and a
 * JS presence library costs ~40kB on every page that has an FAQ, which here
 * is all seven of them.
 *
 * The icon is a single plus whose bars rotate 135 degrees into a cross: one
 * element in two states rather than two icons swapped.
 */
export function Accordion({
  items,
  defaultOpen = 0,
  numbered = true,
}: {
  items: readonly Faq[];
  /** Index open on mount, or null for all closed. */
  defaultOpen?: number | null;
  numbered?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <ul className="border-t border-line">
      {items.map((item, i) => (
        <AccordionRow
          key={item.q}
          item={item}
          index={i}
          numbered={numbered}
          open={open === i}
          onToggle={() => setOpen(open === i ? null : i)}
        />
      ))}
    </ul>
  );
}

function AccordionRow({
  item,
  index,
  open,
  numbered,
  onToggle,
}: {
  item: Faq;
  index: number;
  open: boolean;
  numbered: boolean;
  onToggle: () => void;
}) {
  const id = useId();

  return (
    <li className="border-b border-line">
      <h3>
        <button
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-trigger`}
          className="group/faq flex w-full items-start gap-5 py-7 text-left transition-colors hover:text-accent"
        >
          {numbered ? (
            <span className="label w-8 shrink-0 pt-1.5 transition-colors group-hover/faq:text-accent">
              {pad2(index + 1)}
            </span>
          ) : null}

          <span className="flex-1 text-lead leading-snug">{item.q}</span>

          <span
            aria-hidden="true"
            className="relative mt-2 block h-3.5 w-3.5 shrink-0 transition-transform duration-[450ms] ease-[var(--ease-expo)] reduce:transition-none"
            style={{ transform: open ? "rotate(135deg)" : "rotate(0deg)" }}
          >
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
          </span>
        </button>
      </h3>

      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        className="grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-expo)] reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
      >
        <div className="overflow-hidden">
          <p className={`max-w-[62ch] pb-8 pr-8 text-muted ${numbered ? "pl-[calc(2rem+1.25rem)]" : ""}`}>
            {item.a}
          </p>
        </div>
      </div>
    </li>
  );
}
