import { site } from "@/content/site.config";

/**
 * Booking: date helpers and the single submission seam.
 *
 * The form is front-end only by design. `submitBooking` is the one place to
 * wire a real destination - a CRM endpoint, a WhatsApp deep link, an email
 * service - and it is kept here rather than inside the component so that
 * swapping it never means touching the UI.
 */

export type BookingDraft = {
  treatment: string;
  date: string | null;
  time: string | null;
  name: string;
  phone: string;
  email: string;
  notes: string;
  firstVisit: boolean;
  anxious: boolean;
};

export const emptyDraft: BookingDraft = {
  treatment: "",
  date: null,
  time: null,
  name: "",
  phone: "",
  email: "",
  notes: "",
  firstVisit: false,
  anxious: false,
};

export type BookingResult = { ok: true; reference: string } | { ok: false; error: string };

/**
 * WIRE THIS UP AT LAUNCH.
 *
 * Set `site.booking.endpoint` to a URL and this POSTs the draft as JSON.
 * Leave it null and it resolves successfully after a short delay, which is
 * what the template demo does. Either way the UI contract is identical.
 */
export async function submitBooking(draft: BookingDraft): Promise<BookingResult> {
  const endpoint = site.booking.endpoint;

  if (!endpoint) {
    await new Promise((r) => setTimeout(r, 900));
    return { ok: true, reference: makeReference() };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!res.ok) return { ok: false, error: "That did not go through. Please call us instead." };
    const data = (await res.json().catch(() => ({}))) as { reference?: string };
    return { ok: true, reference: data.reference ?? makeReference() };
  } catch {
    return { ok: false, error: "No connection. Please call us instead." };
  }
}

function makeReference(): string {
  const n = Math.floor(Math.random() * 9000) + 1000;
  return `AUR-${new Date().getFullYear()}-${n}`;
}

/* ------------------------------------------------------------------ *
 * Dates
 * ------------------------------------------------------------------ */

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d: Date, n: number) => {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
};

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** ISO yyyy-mm-dd in local time - toISOString would shift across timezones. */
export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const formatDateLong = (d: Date) =>
  new Intl.DateTimeFormat(site.locale, { weekday: "long", day: "numeric", month: "long" }).format(d);

export const formatMonth = (d: Date) =>
  new Intl.DateTimeFormat(site.locale, { month: "long", year: "numeric" }).format(d);

/** Monday-first weekday initials, derived from the configured locale. */
export function weekdayInitials(): string[] {
  const fmt = new Intl.DateTimeFormat(site.locale, { weekday: "short" });
  // 2024-01-01 was a Monday.
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, 1 + i)));
}

/** A 6x7 grid covering the month, padded with neighbouring days. */
export function monthGrid(view: Date): Date[] {
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  // getDay(): 0 = Sunday. Shift so Monday is column 0.
  const offset = (first.getDay() + 6) % 7;
  const start = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

export function isBookable(date: Date): boolean {
  const today = startOfDay(new Date());
  const earliest = addDays(today, site.booking.leadTimeDays);
  const latest = addDays(today, site.booking.horizonDays);
  const day = startOfDay(date);

  if (day < earliest || day > latest) return false;
  if ((site.booking.closedWeekdays as readonly number[]).includes(day.getDay())) return false;
  return true;
}
