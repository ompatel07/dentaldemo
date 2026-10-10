import { Fragment, type ReactNode } from "react";

/**
 * Turns a config string plus a list of emphasis phrases into nodes, so copy
 * stays as plain strings in /content while still rendering the house accent:
 * the one serif italic, in the section's accent colour.
 *
 * Matching is case-insensitive and whole-phrase. Phrases that do not appear
 * are ignored rather than throwing, so copy can be edited freely.
 */
export function emphasize(text: string, phrases: readonly string[] = []): ReactNode {
  if (phrases.length === 0) return text;

  const escaped = phrases
    .filter(Boolean)
    .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length);

  if (escaped.length === 0) return text;

  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(re);

  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="accent-italic text-accent">
        {part}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** Component form, for JSX-heavy sections. */
export function Emphasize({ text, phrases }: { text: string; phrases?: readonly string[] }) {
  return <>{emphasize(text, phrases)}</>;
}
