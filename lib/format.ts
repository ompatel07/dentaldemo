import { site } from "@/content/site.config";

/**
 * Currency and number formatting, always driven by site.config, so pointing
 * the template at another market changes symbol, grouping and locale once.
 */

export function formatCurrency(amount: number, opts: { compact?: boolean } = {}): string {
  const { currency, locale } = site;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.code,
      maximumFractionDigits: 0,
      notation: opts.compact ? "compact" : "standard",
    }).format(amount);
  } catch {
    return currency.symbol + formatNumber(amount);
  }
}

export function formatNumber(n: number): string {
  try {
    return new Intl.NumberFormat(site.locale, { maximumFractionDigits: 0 }).format(n);
  } catch {
    return String(Math.round(n));
  }
}

/** "from 24,000" with the configured symbol - the transparent-pricing pattern. */
export function fromPrice(amount: number): string {
  return site.copy.priceFrom + " " + formatCurrency(amount);
}

export function priceRange(min: number, max: number): string {
  return formatCurrency(min) + " - " + formatCurrency(max);
}

/**
 * Reducing-balance EMI, the way Indian clinic finance partners quote it.
 * Indicative only - the UI says so next to every number it produces.
 */
export function monthlyEmi(principal: number, months: number, annualRatePct: number): number {
  if (months <= 0) return principal;
  if (annualRatePct <= 0) return principal / months;
  const r = annualRatePct / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export function telHref(phone: string): string {
  return "tel:" + phone.replace(/[^\d+]/g, "");
}

export function whatsappHref(phone: string, message: string): string {
  return "https://wa.me/" + phone.replace(/[^\d]/g, "") + "?text=" + encodeURIComponent(message);
}

export function mapsHref(query: string): string {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
}
