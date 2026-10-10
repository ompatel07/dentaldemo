"use client";

import { useMemo, useState } from "react";
import {
  addDays,
  formatDateLong,
  formatMonth,
  isBookable,
  isSameDay,
  monthGrid,
  startOfDay,
  weekdayInitials,
} from "@/lib/booking";
import { has, site } from "@/content/site.config";
import { cx } from "@/lib/utils";

/**
 * A calendar built rather than installed - a date picker is three hundred
 * lines and a dependency that will outlive the design.
 *
 * Availability is config, not code: `leadTimeDays`, `horizonDays` and
 * `closedWeekdays` in site.config decide what can be chosen, so a clinic
 * that opens on Sundays changes one array.
 */
export function BookingCalendar({
  value,
  onSelect,
}: {
  value: Date | null;
  onSelect: (date: Date) => void;
}) {
  const today = startOfDay(new Date());
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const days = useMemo(() => monthGrid(view), [view]);
  const initials = useMemo(weekdayInitials, []);

  const latest = addDays(today, site.booking.horizonDays);
  const canGoBack = view > new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoForward = new Date(view.getFullYear(), view.getMonth() + 1, 1) <= latest;

  const shift = (n: number) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1));

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => shift(-1)}
          disabled={!canGoBack}
          aria-label="Previous month"
          className="flex h-10 w-10 items-center justify-center rounded-pill border border-line transition-colors enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-30"
        >
          <span aria-hidden="true">&larr;</span>
        </button>

        <p className="display text-h3" aria-live="polite">
          {formatMonth(view)}
        </p>

        <button
          onClick={() => shift(1)}
          disabled={!canGoForward}
          aria-label="Next month"
          className="flex h-10 w-10 items-center justify-center rounded-pill border border-line transition-colors enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-30"
        >
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>

      <div className="mt-7 grid grid-cols-7 gap-1" role="grid" aria-label={formatMonth(view)}>
        {initials.map((d) => (
          <div key={d} className="label pb-3 text-center" role="columnheader" aria-hidden="true">
            {d.slice(0, 2)}
          </div>
        ))}

        {days.map((day) => {
          const inMonth = day.getMonth() === view.getMonth();
          const bookable = isBookable(day);
          const selected = value ? isSameDay(day, value) : false;
          const isToday = isSameDay(day, today);

          return (
            <button
              key={day.toISOString()}
              role="gridcell"
              disabled={!bookable}
              onClick={() => onSelect(day)}
              aria-selected={selected}
              aria-label={`${formatDateLong(day)}${bookable ? "" : ` - ${(site.booking.closedWeekdays as readonly number[]).includes(day.getDay()) ? "closed" : "unavailable"}`}`}
              className={cx(
                "relative aspect-square rounded-md text-sm transition-colors duration-200",
                !inMonth && "opacity-35",
                selected
                  ? "bg-accent-bright text-accent-fg"
                  : bookable
                    ? "border border-line hover:border-accent hover:text-accent"
                    : "cursor-not-allowed text-faint line-through decoration-line",
              )}
            >
              <span className="font-mono">{day.getDate()}</span>
              {isToday && !selected ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-pill bg-accent"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <p className="label mt-5">
        Sundays are emergency only{has.emergencyPhone ? <> &mdash; call {site.contact.emergencyPhone}</> : "."}
      </p>
    </div>
  );
}
