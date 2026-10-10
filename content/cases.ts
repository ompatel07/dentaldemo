import type { SmileCase } from "./types";

/**
 * Before/after pairs for the drag comparison slider. Keep both images in a
 * pair identically framed and identically lit, or the slider looks dishonest.
 * Fictional demo data.
 */

export const cases: SmileCase[] = [
  {
    id: "case-01",
    label: "Closing a lifelong gap",
    treatment: "Aligners + bonding",
    treatmentSlug: "aligners",
    duration: "11 months",
    summary:
      "A midline gap she had been told to live with since she was fourteen. Aligners did the moving, and a half-millimetre of composite finished the edges.",
    before: {
      src: "/images/case-01-before.jpg",
      alt: "Before: a visible gap between the upper front teeth",
      width: 1400,
      height: 1050,
    },
    after: {
      src: "/images/case-01-after.jpg",
      alt: "After: the gap closed and the edges blended",
      width: 1400,
      height: 1050,
    },
  },
  {
    id: "case-02",
    label: "Two teeth, rebuilt",
    treatment: "Implants + zirconia crowns",
    treatmentSlug: "implants",
    duration: "4 months",
    summary:
      "Two upper premolars lost to an old bridge failure. Guided placement, four months of healing, and crowns matched to the canine beside them.",
    before: {
      src: "/images/case-02-before.jpg",
      alt: "Before: two missing upper premolars",
      width: 1400,
      height: 1050,
    },
    after: {
      src: "/images/case-02-after.jpg",
      alt: "After: implant-supported crowns in place",
      width: 1400,
      height: 1050,
    },
  },
  {
    id: "case-03",
    label: "Restraint, in porcelain",
    treatment: "Six veneers",
    treatmentSlug: "veneers",
    duration: "3 weeks",
    summary:
      "He arrived asking for a full set in the brightest shade available. Six veneers, two shades up, and the asymmetry at the canines deliberately kept.",
    before: {
      src: "/images/case-03-before.jpg",
      alt: "Before: worn and chipped upper front teeth",
      width: 1400,
      height: 1050,
    },
    after: {
      src: "/images/case-03-after.jpg",
      alt: "After: six hand-layered porcelain veneers",
      width: 1400,
      height: 1050,
    },
  },
  {
    id: "case-04",
    label: "Nine years away",
    treatment: "Hygiene + whitening",
    treatmentSlug: "whitening",
    duration: "2 visits",
    summary:
      "No treatment beyond a deep clean, a whitening cycle and a plan she could keep. Not every transformation needs porcelain.",
    before: {
      src: "/images/case-04-before.jpg",
      alt: "Before: heavy staining along the gum line",
      width: 1400,
      height: 1050,
    },
    after: {
      src: "/images/case-04-after.jpg",
      alt: "After: cleaned and whitened by five shades",
      width: 1400,
      height: 1050,
    },
  },
];

export const caseById = (id: string) => cases.find((c) => c.id === id);

export const casesByTreatment = (slug: string) => cases.filter((c) => c.treatmentSlug === slug);
