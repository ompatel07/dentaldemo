import type { Affiliation, Currency, NavItem, OpeningHour, SocialLink } from "./types";

/**
 * ============================================================
 * SITE CONFIG - start every rebrand here.
 * ============================================================
 * Everything in this file is copy or configuration. Change it, change
 * styles/tokens.css for colour, app/fonts.ts for type, and the template
 * is a different clinic. See README for the one-hour rebrand checklist.
 *
 * All details below are fictional demo data.
 */

/**
 * The production origin, used for canonical URLs, the sitemap, Open Graph
 * and the JSON-LD. next.config.ts resolves it at build time:
 *
 *   1. NEXT_PUBLIC_SITE_URL, if you set it - do, once the clinic has a domain
 *   2. otherwise the project's production domain on Vercel
 *   3. otherwise localhost, so nothing ever points at a domain you don't own
 */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(new RegExp("/+$"), "");

export const site = {
  brand: {
    name: "Aurelle",
    /** Rendered as the oversized footer wordmark. */
    wordmark: "AURELLE",
    suffix: "Dental Atelier",
    tagline: "Dentistry, crafted.",
    /** The one concept carried through every section. */
    concept: "An atelier for teeth - precision, patience, and work made by hand.",
    established: 2014,
  },

  locale: "en-IN",
  currency: { code: "INR", symbol: "₹" } satisfies Currency,
  timezone: "Asia/Kolkata",

  contact: {
    phone: "+91 79 4000 1200",
    emergencyPhone: "+91 98250 11911",
    whatsapp: "+91 98250 11911",
    email: "studio@aurelle.dental",
    address: {
      line1: "Atelier No. 4, Shilp Avenue",
      line2: "Prahlad Nagar",
      city: "Ahmedabad",
      region: "Gujarat",
      postalCode: "380015",
      country: "IN",
      countryName: "India",
    },
    geo: { latitude: 23.0121, longitude: 72.5078 },
    /** Replace with the clinic's own Google Maps embed URL. */
    mapEmbedSrc:
      "https://www.openstreetmap.org/export/embed.html?bbox=72.4878%2C22.9971%2C72.5278%2C23.0271&layer=mapnik",
    parkingNote: "Valet parking at the Shilp Avenue forecourt.",
  },

  hours: [
    { day: "Monday", opens: "09:30", closes: "19:30", label: "09:30 - 19:30" },
    { day: "Tuesday", opens: "09:30", closes: "19:30", label: "09:30 - 19:30" },
    { day: "Wednesday", opens: "09:30", closes: "19:30", label: "09:30 - 19:30" },
    { day: "Thursday", opens: "09:30", closes: "19:30", label: "09:30 - 19:30" },
    { day: "Friday", opens: "09:30", closes: "19:30", label: "09:30 - 19:30" },
    { day: "Saturday", opens: "10:00", closes: "17:00", label: "10:00 - 17:00" },
    { day: "Sunday", opens: null, closes: null, label: "Emergencies only" },
  ] satisfies OpeningHour[],

  /** Shown above the fold and in the floating dock. */
  proof: {
    rating: 4.9,
    reviewCount: 1284,
    reviewSource: "Google",
    emergencyPromise: "Same-day emergency care",
    secondary: "11 years in Ahmedabad",
  },

  /** `preview` is the image the fullscreen menu reveals on hover. */
  nav: [
    {
      label: "Treatments",
      href: "/#treatments",
      preview: { src: "/images/menu-treatments.jpg", alt: "", width: 800, height: 1000 },
    },
    {
      label: "Transformations",
      href: "/#transformations",
      preview: { src: "/images/menu-transformations.jpg", alt: "", width: 800, height: 1000 },
    },
    {
      label: "The atelier",
      href: "/#technology",
      preview: { src: "/images/menu-atelier.jpg", alt: "", width: 800, height: 1000 },
    },
    {
      label: "Dentists",
      href: "/doctors",
      preview: { src: "/images/menu-dentists.jpg", alt: "", width: 800, height: 1000 },
    },
    {
      label: "Pricing",
      href: "/#pricing",
      preview: { src: "/images/menu-pricing.jpg", alt: "", width: 800, height: 1000 },
    },
    {
      label: "Contact",
      href: "/contact",
      preview: { src: "/images/menu-contact.jpg", alt: "", width: 800, height: 1000 },
    },
  ] satisfies NavItem[],

  footerNav: [
    { label: "Book a visit", href: "/#book" },
    { label: "Smile quiz", href: "/#quiz" },
    { label: "Nervous patients", href: "/#comfort" },
    { label: "FAQ", href: "/#faq" },
  ] satisfies NavItem[],

  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ] satisfies SocialLink[],

  /** Trust marquee. Type wordmarks only - no bitmap logos to go stale. */
  affiliations: [
    { wordmark: "Indian Dental Association", note: "Member clinic" },
    { wordmark: "Invisalign", note: "Diamond provider" },
    { wordmark: "Straumann", note: "Certified implantology" },
    { wordmark: "Vogue India", note: "Featured 2025" },
    { wordmark: "Condé Nast Traveller", note: "Wellness edit" },
    { wordmark: "ICOI", note: "Fellowship" },
    { wordmark: "Ahmedabad Mirror", note: "Clinic of the year" },
  ] satisfies Affiliation[],

  /** Indicative financing used by the EMI calculator. */
  finance: {
    annualRatePct: 12,
    monthOptions: [3, 6, 9, 12, 18, 24],
    defaultMonths: 12,
    zeroCostUpTo: 6,
    disclaimer:
      "Indicative only. Final plans are issued by our financing partners after a clinical estimate.",
    partners: [
      { wordmark: "Bajaj Finserv", note: "No-cost EMI up to 6 months" },
      { wordmark: "HDFC Bank", note: "Card EMI, 3-24 months" },
      { wordmark: "Star Health", note: "Cashless dental cover" },
      { wordmark: "Niva Bupa", note: "Reimbursement support" },
    ],
  },

  /**
   * UI copy. Nothing user-facing is written inside a component, so the
   * template can be localised without touching JSX.
   */
  copy: {
    priceFrom: "from",
    bookCta: "Book your visit",
    bookShort: "Book a visit",
    quizCta: "Take the smile quiz",
    emergencyCta: "Emergency? Call now",
    emergencyShort: "Emergency",
    callCta: "Call the atelier",
    whatsappCta: "WhatsApp us",
    menuOpen: "Menu",
    menuClose: "Close",
    scrollCue: "Scroll to begin",
    loading: "Preparing the atelier",
    dragLabel: "Drag",
    viewLabel: "View",
    playLabel: "Play",
    allTreatments: "All treatments",
    backHome: "Back to the atelier",
    emiNote: "Indicative monthly plan",
  },

  seo: {
    /** The production origin - see SITE_URL at the top of this file. */
    url: SITE_URL,
    titleDefault: "Aurelle - Dental Atelier, Ahmedabad",
    titleTemplate: "%s - Aurelle Dental Atelier",
    description:
      "A dental atelier in Ahmedabad. Implants, aligners and veneers made with unhurried craft - transparent pricing, same-day emergencies, and care built for nervous patients.",
    keywords: [
      "dentist Ahmedabad",
      "dental implants Ahmedabad",
      "invisible aligners",
      "smile design",
      "emergency dentist",
    ],
    ogImage: { src: "/images/og-default.jpg", width: 1200, height: 630 },
    twitter: "@aurelledental",
  },

  /**
   * Motion and the visitor's "reduce motion" setting.
   *
   * On Windows this is Settings > Accessibility > Visual effects >
   * Animation effects, and it is switched off on a great many machines for
   * reasons that have nothing to do with motion sensitivity - which is why
   * this template can look static on a perfectly healthy laptop.
   *
   *   "ignore"  - always run the full motion design. Right for a showcase,
   *               and what the demo ships with.
   *   "respect" - honour the setting: no pinning, no smooth scroll, no
   *               marquee, reveals become plain fades. The accessible
   *               choice, and the one to use for a real clinic.
   */
  motion: {
    reducedMotion: "ignore" as "respect" | "ignore",
  },

  /**
   * The preloader.
   *
   * It is an opaque curtain, which means Largest Contentful Paint cannot
   * happen until it lifts: on a throttled phone it is worth several seconds
   * of LCP and a large chunk of the Lighthouse performance score. It is a
   * deliberate piece of theatre, and it is the first thing to turn off for
   * a clinic that cares more about Core Web Vitals than about an entrance.
   *
   * `maxWaitMs` caps how long the counter may wait for fonts and the load
   * event before it opens regardless.
   */
  intro: {
    enabled: true,
    maxWaitMs: 1200,
  },

  /**
   * The hero object.
   *
   * "3d" renders the WebGL tooth on capable hardware, falling back to the
   * still everywhere else. "still" never loads three.js at all.
   *
   * The live object is cheap now - the mesh is built in a worker and the
   * lighting is baked (see "The 3D molar" in the README) - and phones never
   * load it. "still" remains for a clinic that wants no WebGL at all.
   */
  hero: {
    object: "3d" as "3d" | "still",
  },

  booking: {
    /** Wire this to a real endpoint, CRM or WhatsApp flow at launch. */
    endpoint: null as string | null,
    slots: ["09:30", "10:30", "11:30", "12:30", "15:00", "16:00", "17:00", "18:00"],
    leadTimeDays: 1,
    horizonDays: 45,
    /** Sunday is emergency-only, so the calendar closes it. */
    closedWeekdays: [0],
    successTitle: "Your chair is reserved",
    successBody:
      "We will confirm by phone within two working hours. Nothing is charged until you sit down with us.",
  },
} as const;

export type Site = typeof site;

export const fullAddress = [
  site.contact.address.line1,
  site.contact.address.line2,
  site.contact.address.city,
  site.contact.address.region + " " + site.contact.address.postalCode,
].join(", ");

export const brandFull = site.brand.name + " — " + site.brand.suffix;
