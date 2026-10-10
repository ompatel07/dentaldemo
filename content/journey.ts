import type { JourneyStep } from "./types";

/** The four steps the drawn line connects in section 06. */

export const journey: JourneyStep[] = [
  {
    chapter: "01",
    title: "Consult",
    body: "Forty minutes, no instruments unless you want them. We listen first and examine second.",
    duration: "40 min",
    image: { src: "/images/hero-clinic.jpg", alt: "The consultation room, bright and empty", width: 1200, height: 900 },
  },
  {
    chapter: "02",
    title: "3D scan",
    body: "A wand and, where it matters, a CBCT. Six minutes, no putty, and the end of guesswork.",
    duration: "6 min",
    image: { src: "/images/tech-cbct.jpg", alt: "A 3D dental scan on a tablet", width: 1400, height: 1050 },
  },
  {
    chapter: "03",
    title: "Digital plan",
    body: "The outcome is designed on screen with you in the room, then quoted once, in writing.",
    duration: "48 hours",
    image: { src: "/images/tech-intraoral-scanner.jpg", alt: "A dentist showing a patient their digital plan", width: 1400, height: 1050 },
  },
  {
    chapter: "04",
    title: "New smile",
    body: "The treatment itself, at the pace you set, with two years of reviews built into the price.",
    duration: "Your pace",
    image: { src: "/images/case-03-after.jpg", alt: "A finished smile", width: 1400, height: 1050 },
  },
];
