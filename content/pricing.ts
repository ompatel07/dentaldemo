import type { PricingTier } from "./types";

/**
 * Starting prices for section 10. `emiPreset` is the amount the EMI
 * calculator loads when that tier is selected.
 */

export const pricingTiers: PricingTier[] = [
  {
    name: "First visit",
    priceFrom: 800,
    summary: "Forty minutes, a full examination, and a written plan before anything is booked.",
    includes: [
      "Examination and photographs",
      "Digital X-rays as needed",
      "Written estimate, fixed",
      "No-treatment option for anxious patients",
    ],
    emiPreset: 800,
  },
  {
    name: "Hygiene & whitening",
    priceFrom: 9500,
    summary: "The cheapest transformation on this page, and the one most people actually need.",
    includes: [
      "Scaling and polishing",
      "Calibrated shade record",
      "Three in-chair whitening cycles",
      "Custom home trays",
    ],
    emiPreset: 14000,
  },
  {
    name: "Smile design",
    priceFrom: 18000,
    summary: "Per tooth, hand-layered porcelain. Most cases are six to eight teeth.",
    includes: [
      "Photographic design and mock-up",
      "Hand-layered veneers",
      "Gum contouring where needed",
      "Night guard included",
    ],
    emiPreset: 144000,
    highlight: true,
  },
  {
    name: "Implants",
    priceFrom: 32000,
    summary: "Per implant, including the CBCT plan, the guide and the final crown.",
    includes: [
      "CBCT scan and digital plan",
      "Guided placement",
      "Temporary tooth while healing",
      "Zirconia crown and two years of reviews",
    ],
    emiPreset: 64000,
  },
  {
    name: "Aligners",
    priceFrom: 145000,
    summary: "Full course, all reviews, retainers and finishing whitening included.",
    includes: [
      "Scan and outcome simulation",
      "Complete tray series",
      "Every review visit",
      "Fixed and removable retainers",
    ],
    emiPreset: 145000,
  },
];

/** Shown as a quiet note under the grid. */
export const pricingNotes = [
  "Prices are starting prices for the Ahmedabad atelier and include GST.",
  "Your written estimate is issued after the scan and does not change mid-treatment.",
  "Emergency examination is charged at the first-visit rate, never a premium.",
];
