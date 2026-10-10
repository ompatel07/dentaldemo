import { Bricolage_Grotesque, Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";

/**
 * TYPE SWITCHBOARD - the second file to touch on a rebrand.
 * Swap the imported families here; the CSS variable names stay the same,
 * so styles/tokens.css and every component keep working untouched.
 *
 *   display - a tight grotesk that carries every headline
 *   accent  - the one serif, used in italic for single emphasised words
 *   body    - reading text and UI
 *   mono    - prices, specs, counters
 */

export const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-face-display",
  display: "swap",
});

export const accent = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-face-accent",
  display: "swap",
  // Preloaded: the emphasised word in the hero headline is set in it, and
  // on a phone connection a late swap there is the first thing you see.
});

export const body = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-face-body",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-face-mono",
  display: "swap",
  // 11px labels have no business competing with the hero for bandwidth.
  preload: false,
});

export const fontVariables = [display.variable, accent.variable, body.variable, mono.variable].join(" ");
