"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site.config";
import { cx } from "@/lib/utils";

type Status = { open: boolean; text: string };

/** Current weekday and HH:MM in the clinic's own timezone, not the visitor's. */
function clinicNow(): { day: string; time: string } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: site.timezone,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { day: get("weekday"), time: `${get("hour")}:${get("minute")}` };
}

function compute(): Status {
  const { day, time } = clinicNow();
  const index = site.hours.findIndex((h) => h.day === day);
  const today = site.hours[index];

  if (today?.opens && today.closes && time >= today.opens && time < today.closes) {
    return { open: true, text: `Open now, until ${today.closes}` };
  }
  if (today?.opens && time < today.opens) {
    return { open: false, text: `Opens today at ${today.opens}` };
  }
  // Find the next day that opens at all.
  for (let step = 1; step <= 7; step++) {
    const next = site.hours[(index + step) % site.hours.length];
    if (next?.opens) return { open: false, text: `Opens ${step === 1 ? "tomorrow" : next.day} at ${next.opens}` };
  }
  return { open: false, text: "Closed" };
}

/**
 * "Open now, until 19:30" - computed from site.config hours in the clinic's
 * timezone. It answers the first question anyone has about a clinic, and it
 * is the kind of small live detail that stops a page feeling like a mock-up.
 *
 * Rendered after mount only: the server cannot know what time it is for the
 * visitor's request without making the page dynamic.
 */
export function OpenStatus({ className }: { className?: string }) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    setStatus(compute());
    const id = window.setInterval(() => setStatus(compute()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={cx("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden="true"
        className={cx(
          "relative block h-2 w-2 shrink-0 rounded-pill",
          status?.open ? "bg-[var(--mint-strong)]" : "bg-[var(--coral)]",
        )}
      >
        {status?.open ? (
          <span className="absolute inset-0 animate-ping rounded-pill bg-[var(--mint-strong)] opacity-70 reduce:animate-none" />
        ) : null}
      </span>
      <span>{status?.text ?? site.hours[0].label}</span>
    </span>
  );
}
