import type { Testimonial } from "./types";

/**
 * Review cards for the draggable carousel. Entries carrying `video` render as
 * a poster that plays a muted loop on hover. Fictional demo data.
 */

export const testimonials: Testimonial[] = [
  {
    id: "t-01",
    quote:
      "I had not been to a dentist in nine years. They did not lecture me once. The first visit was a conversation and a scan, and I booked the next one before I left.",
    author: "Meera T.",
    context: "Aligners, 2025",
    rating: 5,
    treatment: "aligners",
    video: {
      poster: {
        src: "/images/testimonial-meera-poster.jpg",
        alt: "Meera speaking about her aligner treatment",
        width: 900,
        height: 1200,
      },
      // Add the clip to public/video/ and uncomment - see README.txt there.
      // preview: "/video/testimonial-meera.mp4",
    },
  },
  {
    id: "t-02",
    quote:
      "Walked in at 9pm with a molar that had cracked on a date seed. Dr. Raval saw me that night, finished the root canal in one sitting, and I was at work the next morning.",
    author: "Harsh P.",
    context: "Emergency root canal, 2025",
    rating: 5,
    treatment: "root-canal",
  },
  {
    id: "t-03",
    quote:
      "I asked for twelve veneers. Dr. Mehta talked me down to six and showed me why. That cost her money and earned my whole family.",
    author: "Nikita S.",
    context: "Veneers, 2024",
    rating: 5,
    treatment: "veneers",
  },
  {
    id: "t-04",
    quote:
      "The quote they gave me in the first visit is the amount I paid. No additions, no surprise crown halfway through. In this city that is remarkable.",
    author: "Rohan D.",
    context: "Two implants, 2024",
    rating: 5,
    treatment: "implants",
    video: {
      poster: {
        src: "/images/testimonial-rohan-poster.jpg",
        alt: "Rohan speaking about his implant treatment",
        width: 900,
        height: 1200,
      },
      // Add the clip to public/video/ and uncomment - see README.txt there.
      // preview: "/video/testimonial-rohan.mp4",
    },
  },
  {
    id: "t-05",
    quote:
      "My daughter is six and genuinely asks when she can go back. She has had two fillings. I still do not understand how they managed it.",
    author: "Aarti J.",
    context: "Paediatric care, 2025",
    rating: 5,
    treatment: "kids",
  },
  {
    id: "t-06",
    quote:
      "I cried in the chair during the first appointment and nobody made it awkward. They stopped, waited, explained, and we carried on when I was ready.",
    author: "Priyanka M.",
    context: "Whitening and hygiene, 2025",
    rating: 5,
    treatment: "whitening",
  },
  {
    id: "t-07",
    quote:
      "Four thousand implants in and the man still spends forty minutes on a scan before he will say yes. Worth the wait.",
    author: "Sanjay V.",
    context: "Full-arch rehabilitation, 2023",
    rating: 5,
    treatment: "implants",
  },
  {
    id: "t-08",
    quote:
      "The EMI was explained like an adult conversation rather than a sales pitch. I knew the monthly number before I agreed to anything.",
    author: "Faizal K.",
    context: "Aligners on finance, 2025",
    rating: 5,
    treatment: "aligners",
  },
];

/** Aggregate figures for the counter above the carousel. */
export const reviewAggregate = {
  count: 1284,
  average: 4.9,
  fiveStarShare: 0.96,
  recommendShare: 0.98,
};
