import type { TechItem } from "./types";

/** Sticky stacking cards in the dark section 07. Specs render in mono. */

export const technology: TechItem[] = [
  {
    chapter: "01",
    name: "Intraoral scanner",
    body: "Replaces impression putty entirely. A wand passes over the teeth and builds a model accurate to a fraction of a millimetre, which is what lets an aligner series be planned to the week.",
    specs: [
      { label: "Accuracy", value: "< 50 µm" },
      { label: "Full arch", value: "90 seconds" },
      { label: "Putty", value: "None" },
    ],
    image: {
      src: "/images/tech-intraoral-scanner.jpg",
      alt: "Intraoral scanner wand on a steel tray",
      width: 1400,
      height: 1050,
    },
  },
  {
    chapter: "02",
    name: "CBCT 3D imaging",
    body: "A cone-beam scan shows bone volume, nerve position and hidden fractures in three dimensions. Every implant and every retreatment here is planned on one before an instrument is opened.",
    specs: [
      { label: "Voxel size", value: "75 µm" },
      { label: "Scan time", value: "14 seconds" },
      { label: "Dose", value: "Low-dose protocol" },
    ],
    image: {
      src: "/images/tech-cbct.jpg",
      alt: "CBCT imaging unit in the radiology room",
      width: 1400,
      height: 1050,
    },
  },
  {
    chapter: "03",
    name: "Laser dentistry",
    body: "Soft-tissue work without a scalpel and, often, without stitches. Gum contouring around veneers heals in days rather than weeks, and bleeding during the appointment is close to nil.",
    specs: [
      { label: "Wavelength", value: "940 nm diode" },
      { label: "Sutures", value: "Rarely needed" },
      { label: "Healing", value: "2 to 4 days" },
    ],
    image: {
      src: "/images/tech-laser.jpg",
      alt: "Diode laser handpiece under warm light",
      width: 1400,
      height: 1050,
    },
  },
  {
    chapter: "04",
    name: "Digital smile design",
    body: "Photographs, video of you speaking, and the scan are combined so the design is checked against how your face actually moves. Then it is mocked up in resin on your own teeth before anything is cut.",
    specs: [
      { label: "Mock-up", value: "Worn home" },
      { label: "Revisions", value: "Unlimited pre-prep" },
      { label: "Approval", value: "Yours, in writing" },
    ],
    image: {
      src: "/images/tech-smile-design.jpg",
      alt: "Smile design workspace with a layered mock-up",
      width: 1400,
      height: 1050,
    },
  },
];
