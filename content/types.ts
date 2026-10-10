/**
 * Content contracts. Every section reads typed data from /content - no
 * component in this template contains a word of client copy.
 */

export type ImageSlot = {
  /** Path under /public. Generate placeholders with: npm run placeholders */
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Currency = {
  code: string;
  symbol: string;
};

export type OpeningHour = {
  /** Schema.org day name, e.g. "Monday". */
  day: string;
  opens: string | null;
  closes: string | null;
  label: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: string;
  /** Shown as the hover preview in the fullscreen menu. */
  preview?: ImageSlot;
};

export type Affiliation = {
  /** Rendered as a type wordmark, never a bitmap logo. */
  wordmark: string;
  note?: string;
};

export type Treatment = {
  slug: string;
  chapter: string;
  name: string;
  /** One line for cards and the horizontal rail. */
  tagline: string;
  /** Two or three sentences for the detail page hero. */
  intro: string;
  priceFrom: number;
  priceTo?: number;
  duration: string;
  sessions: string;
  image: ImageSlot;
  /** Detail-page body. */
  what: string;
  process: { title: string; body: string }[];
  includes: string[];
  faqs: Faq[];
  /** Matched against quiz answer tags to build the recommendation. */
  tags: string[];
  featured?: boolean;
};

export type Doctor = {
  slug: string;
  name: string;
  role: string;
  /** The differentiator: philosophy of care, not a list of degrees. */
  philosophy: string;
  bio: string;
  credentials: string[];
  languages: string[];
  focus: string[];
  yearsExperience: number;
  portrait: ImageSlot;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  context: string;
  rating: number;
  treatment?: string;
  /** Present when the card is a portrait card rather than a text card. */
  video?: {
    poster: ImageSlot;
    /** Short muted loop played on hover. Leave it out and the card is
        simply the portrait - nothing is requested, nothing can 404. */
    preview?: string;
  };
};

export type SmileCase = {
  id: string;
  label: string;
  /** Display name of the work done. */
  treatment: string;
  /** Links the case to a treatment detail page. */
  treatmentSlug: string;
  duration: string;
  summary: string;
  before: ImageSlot;
  after: ImageSlot;
};

export type Faq = {
  q: string;
  a: string;
};

export type QuizOption = {
  value: string;
  label: string;
  hint?: string;
  /** Tags accumulate across steps and are scored against treatment tags. */
  tags: string[];
};

export type QuizStep = {
  id: string;
  chapter: string;
  question: string;
  helper?: string;
  options: QuizOption[];
};

export type JourneyStep = {
  chapter: string;
  title: string;
  body: string;
  duration: string;
  image: ImageSlot;
};

export type TechItem = {
  chapter: string;
  name: string;
  body: string;
  specs: { label: string; value: string }[];
  image: ImageSlot;
};

export type ComfortItem = {
  name: string;
  body: string;
  /** Spa-menu styling: a short "included" or price-like note. */
  note: string;
};

export type PricingTier = {
  name: string;
  priceFrom: number;
  summary: string;
  includes: string[];
  /** Links the EMI calculator preset to this tier. */
  emiPreset?: number;
  highlight?: boolean;
};

export type FinancePartner = {
  wordmark: string;
  note: string;
};

export type SectionMeta = {
  chapter: string;
  label: string;
};
