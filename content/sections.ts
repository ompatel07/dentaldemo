/**
 * Section-level copy for the home page. Chapter numbers carry the atelier
 * concept, and every headline, eyebrow and helper line lives here so no
 * section component contains a sentence of its own.
 *
 * `emphasis` words are rendered in display italic + gold by the reveal
 * components; they must appear verbatim inside `headline`.
 */

export const sections = {
  hero: {
    chapter: "01",
    label: "Dental atelier, Ahmedabad",
    /** One entry per line of the headline, exactly as it should break. */
    headlineLines: ["Dentistry,", "crafted for smiles", "worth keeping."],
    emphasis: ["crafted"],
    body: "Four dentists, one unhurried bench. Prices published before you sit down, a scan before any quote, and a chair that never rushes you.",
    bodyEmphasis: ["Prices published before you sit down"],
    primaryCta: "Book your visit",
    secondaryCta: "Take the smile quiz",
    scrollCue: "Scroll",
    photoCaption: "Aligners, 11 months",
    stats: [
      { value: 11, suffix: " yrs", label: "In Ahmedabad" },
      { value: 4200, suffix: "+", label: "Implants placed" },
      { value: 0, suffix: "", label: "Double-booked chairs" },
    ],
  },

  trust: {
    chapter: "02",
    label: "Trusted by",
    marqueeSeparator: "—",
  },

  manifesto: {
    chapter: "03",
    label: "How we work",
    /** Scrubbed word-by-word from 15% to 100% opacity as it is read. */
    body: "Most dental clinics are built for throughput. Ours is built the way a watchmaker builds: one bench, one case at a time, and nobody standing over the work with a stopwatch. We publish our prices because hiding them is a tactic, not a policy. We plan in three dimensions before we touch an instrument, because a surprise in the chair is a failure that happened three weeks earlier. And we go slowly with frightened patients, for as many visits as that takes, because fear is a clinical fact and not an inconvenience.",
    emphasis: ["one case at a time", "publish our prices", "fear is a clinical fact"],
    signatureName: "Dr. Ira Mehta",
    signatureRole: "Founder, prosthodontist",
    portrait: {
      src: "/images/manifesto-portrait.jpg",
      alt: "Gloved hands polishing a single ceramic crown at the bench",
      width: 1000,
      height: 1300,
    },
    detail: {
      src: "/images/manifesto-detail.jpg",
      alt: "A dental mirror and an explorer laid on a clean surface",
      width: 1000,
      height: 1000,
    },
  },

  treatments: {
    chapter: "04",
    label: "Treatments",
    headline: "Six things we do, properly.",
    emphasis: ["properly"],
    body: "Every price below is a real starting price, not a teaser. The scan and the plan come before the quote.",
    cta: "All treatments",
    dragHint: "Drag",
  },

  transformations: {
    chapter: "05",
    label: "Transformations",
    headline: "Real mouths, honestly photographed.",
    emphasis: ["honestly"],
    body: "Same framing, same light, no retouching. Drag the handle to see the work.",
    dragLabel: "Drag",
  },

  journey: {
    chapter: "06",
    label: "The journey",
    headline: "Four steps from first call to new smile.",
    emphasis: ["Four steps"],
    body: "Nothing in this sequence is a surprise, and nothing is quoted after it has started.",
  },

  technology: {
    chapter: "07",
    label: "The instruments",
    headline: "Precision you can measure.",
    emphasis: ["measure"],
    body: "Equipment is not a personality. It is only worth listing because each of these removes a specific kind of guesswork.",
  },

  comfort: {
    chapter: "08",
    label: "For the nervous ones",
    headline: "If the thought of this makes you feel sick, read this part.",
    emphasis: ["read this part"],
    body: "Around one in three adults puts off dental care because of fear. We treat that as a clinical fact to be planned around, not a personality flaw to be talked out of. Nothing below costs extra, and nothing below needs to be asked for twice.",
    menuLabel: "The comfort menu",
    image: {
      src: "/images/comfort-room.jpg",
      alt: "An empty treatment chair beside a bright window",
      width: 1200,
      height: 1500,
    },
    promise: "You can stop us at any moment with a raised hand. We will stop. That is the whole agreement.",
    cta: "Book a no-treatment first visit",
  },

  doctors: {
    chapter: "09",
    label: "The dentists",
    headline: "Four dentists, one bench.",
    emphasis: ["one bench"],
    body: "Each of them leads with how they work, not with a list of degrees. Tap a portrait for the longer answer.",
    cta: "All profiles",
    modalLabels: {
      philosophy: "Philosophy of care",
      credentials: "Credentials",
      languages: "Speaks",
      focus: "Focus",
      experience: "Years in practice",
      book: "Book with",
    },
  },

  pricing: {
    chapter: "10",
    label: "Pricing",
    headline: "Published, because hiding it is a tactic.",
    emphasis: ["Published"],
    body: "Starting prices for the work we do most. Your written estimate comes after the scan, and it does not move afterwards.",
    emiTitle: "Spread it monthly",
    emiBody: "Choose a treatment and a term to see an indicative monthly figure.",
    emiTreatmentLabel: "Treatment",
    emiMonthsLabel: "Months",
    emiResultLabel: "Per month",
    partnersLabel: "Finance and insurance partners",
  },

  quiz: {
    chapter: "11",
    label: "Smile quiz",
    headline: "Not sure what you need?",
    emphasis: ["what you need"],
    body: "Five questions, ninety seconds, no email required. You will get a starting point rather than a sales pitch.",
    startCta: "Begin",
    progressLabel: "Question",
    backLabel: "Back",
  },

  testimonials: {
    chapter: "12",
    label: "In their words",
    headline: "What people say when we are not in the room.",
    emphasis: ["not in the room"],
    body: "Drag, or use the arrows.",
    aggregateLabel: "Average rating across",
    aggregateSuffix: "reviews",
  },

  faq: {
    chapter: "13",
    label: "Questions",
    headline: "The things people actually ask.",
    emphasis: ["actually"],
    body: "If yours is not here, ask us. Nobody will try to book you in the middle of the answer.",
  },

  book: {
    chapter: "14",
    label: "Reserve a chair",
    headline: "Book your visit",
    body: "Pick a treatment, a day and a time. We confirm by phone within two working hours, and nothing is charged until you sit down.",
    promises: [
      { label: "Today", body: "Emergency slots are held every single day." },
      { label: "First visit", body: "Forty minutes, and no treatment if you would rather not." },
      { label: "Deposit", body: "None. Nothing is charged until you sit down." },
    ],
    steps: ["Treatment", "Date", "Time", "Details", "Confirmed"],
    labels: {
      next: "Continue",
      back: "Back",
      submit: "Reserve this chair",
      name: "Your name",
      phone: "Phone",
      email: "Email",
      notes: "Anything we should know?",
      notesHint: "Nervous, in pain, running late from work - all useful.",
      firstTime: "This is my first visit",
      anxious: "I would like the slower, no-treatment first visit",
      required: "Required",
      closed: "Closed",
      noSlots: "No slots left on this day",
      selected: "Selected",
    },
  },

  footer: {
    label: "The atelier",
    hoursLabel: "Hours",
    findLabel: "Find us",
    emergencyLabel: "Out of hours",
    contactLabel: "Contact",
    socialLabel: "Elsewhere",
    legal: "Fictional clinic, built as a template.",
    credit: "Template by your studio.",
  },
} as const;

export type Sections = typeof sections;
