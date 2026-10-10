import type { Treatment } from "./types";

/**
 * The six treatments the home rail and /treatments/[slug] are built from.
 * `tags` feed the smile-quiz scoring, `priceFrom` feeds every price on the
 * site, and `faqs` feed both the detail page and its FAQPage schema.
 */

export const treatments: Treatment[] = [
  {
    slug: "implants",
    chapter: "01",
    name: "Implants",
    tagline: "A tooth rebuilt from the root, not rested on its neighbours.",
    intro:
      "A titanium root, a hand-finished crown, and the patience to let bone do its work. We plan every implant on a CBCT scan before a single instrument is opened, so the day of surgery is quiet and short.",
    priceFrom: 32000,
    priceTo: 85000,
    duration: "45 min surgery",
    sessions: "3 visits over 4 months",
    image: {
      src: "/images/treatment-implants.jpg",
      alt: "Close study of a hand-finished implant crown",
      width: 1200,
      height: 1500,
    },
    what:
      "An implant replaces the root of a missing tooth. Once the bone has grown around it, a crown is made to match the teeth either side: shade, translucency, and the small irregularities that stop a tooth looking manufactured. It is the only option that keeps the jawbone loaded, which is why it ages better than a bridge.",
    process: [
      {
        title: "CBCT and planning",
        body: "A 3D scan maps bone volume and the path of every nerve. We place the implant digitally first, then print a guide from that plan.",
      },
      {
        title: "Placement",
        body: "Forty-five minutes under local anaesthetic, with sedation if you want it. Most patients work the next day.",
      },
      {
        title: "Healing",
        body: "Three to four months while bone integrates with the titanium. You leave with a temporary tooth, never a gap.",
      },
      {
        title: "The crown",
        body: "Scanned, designed on screen with you in the room, then hand-finished by our ceramist in Ahmedabad.",
      },
    ],
    includes: [
      "CBCT 3D scan and digital plan",
      "Guided placement",
      "Temporary tooth throughout healing",
      "Hand-finished zirconia crown",
      "Two years of reviews",
    ],
    faqs: [
      {
        q: "Does it hurt?",
        a: "The surgery itself does not, because the site is fully numb and sedation is available. Expect two or three days of the ache you would get after a hard dental cleaning, managed with ordinary painkillers.",
      },
      {
        q: "How long will it last?",
        a: "Published survival rates sit above ninety percent at ten years. Ours are maintained by six-monthly reviews, included for the first two years.",
      },
      {
        q: "Can I have it done in one day?",
        a: "Sometimes. Immediate loading depends on bone quality, and we only offer it when the scan says it is safe. You will know at the planning visit, not on the day.",
      },
      {
        q: "What if I have bone loss?",
        a: "Grafting rebuilds the site first. It adds a few months and is quoted separately once we have the scan.",
      },
    ],
    tags: ["missing-tooth", "function", "long-term", "restore", "chewing"],
    featured: true,
  },

  {
    slug: "aligners",
    chapter: "02",
    name: "Aligners",
    tagline: "Straightening nobody notices until it is finished.",
    intro:
      "Clear aligners move teeth in planned increments you can see before you commit. We run the simulated outcome on the first visit, and you decide from there.",
    priceFrom: 145000,
    priceTo: 260000,
    duration: "20 min reviews",
    sessions: "6 to 18 months",
    image: {
      src: "/images/treatment-aligners.jpg",
      alt: "A clear aligner tray resting on pearl-coloured stone",
      width: 1200,
      height: 1500,
    },
    what:
      "A series of trays, each a fraction of a millimetre different from the last, worn twenty-two hours a day. No brackets, no wires, no month of talking carefully. Adults make up most of our aligner patients, many of them people who wore braces as teenagers and then watched their teeth drift back.",
    process: [
      {
        title: "Intraoral scan",
        body: "Six minutes with a wand and no impression putty. The scan becomes your digital plan.",
      },
      {
        title: "See the outcome",
        body: "We run the simulation in front of you, tooth by tooth, and agree on what the finish line looks like.",
      },
      {
        title: "Wear the series",
        body: "Trays change weekly. Reviews every six to eight weeks, twenty minutes each.",
      },
      {
        title: "Retain it",
        body: "A fixed retainer behind the front teeth plus a night tray. The part most clinics undersell, and the reason results hold.",
      },
    ],
    includes: [
      "Intraoral scan and simulation",
      "Full tray series",
      "All review visits",
      "Whitening at the finish",
      "Retainers, fixed and removable",
    ],
    faqs: [
      {
        q: "Will people see them?",
        a: "At conversational distance, almost never. You will notice them for the first week, then forget them.",
      },
      {
        q: "Can I eat with them in?",
        a: "No. Trays come out for food and for anything other than water, which is why twenty-two hours takes some discipline.",
      },
      {
        q: "How is this different from mail-order aligners?",
        a: "Every plan here is set by a dentist who has examined your bone and gums, and who adjusts mid-course when teeth do not move as modelled. A remote plan can do neither.",
      },
      {
        q: "What if I lose a tray?",
        a: "Move to the next one and call us. Replacements are included.",
      },
    ],
    tags: ["crooked", "gaps", "alignment", "discreet", "appearance", "teen"],
    featured: true,
  },

  {
    slug: "veneers",
    chapter: "03",
    name: "Veneers",
    tagline: "Porcelain the thickness of a contact lens, made by hand.",
    intro:
      "Veneers are the most abused treatment in dentistry and the most rewarding when restrained. We design to your face rather than to a trend, and remove as little enamel as the case allows.",
    priceFrom: 18000,
    priceTo: 32000,
    duration: "2 hours per visit",
    sessions: "2 to 3 visits",
    image: {
      src: "/images/treatment-veneers.jpg",
      alt: "Porcelain veneers laid out on a ceramist bench",
      width: 1200,
      height: 1500,
    },
    what:
      "A thin shell of porcelain bonded to the front of a tooth, correcting shape, shade, chips and small gaps at once. Priced per tooth, because most people need four to eight rather than the twenty that makes a smile look printed. Our ceramist builds them in layers, so light passes through them the way it passes through enamel.",
    process: [
      {
        title: "Design",
        body: "Photographs, a scan, and an honest conversation about how much change you actually want. We mock it up in resin on your own teeth first.",
      },
      {
        title: "Try the smile on",
        body: "You wear the mock-up home for a day. Nothing is cut until you have seen it in your own mirror and your own light.",
      },
      {
        title: "Preparation",
        body: "Minimal enamel reduction, then temporaries while the porcelain is layered by hand.",
      },
      {
        title: "Bonding",
        body: "Fitted dry, checked for bite and for speech, then bonded. Two hours, and the colour is permanent.",
      },
    ],
    includes: [
      "Photographic smile design",
      "Resin mock-up to take home",
      "Hand-layered porcelain",
      "Night guard",
      "Shade-matched polish at six months",
    ],
    faqs: [
      {
        q: "Will my teeth be cut down?",
        a: "A little: typically half a millimetre of enamel. Where the case allows we bond with no reduction at all, and we tell you which category you are in before you book.",
      },
      {
        q: "Do they stain?",
        a: "Porcelain does not. The cement margin can, slowly, which is what the six-month polish is for.",
      },
      {
        q: "How long do they last?",
        a: "Ten to fifteen years is normal with a night guard. Grinding without one is what breaks them.",
      },
      {
        q: "Can I have just one?",
        a: "Yes, and matching a single veneer to a natural neighbour is the hardest thing our ceramist does. It is also the work we are proudest of.",
      },
    ],
    tags: ["appearance", "chips", "shape", "stains", "fast-cosmetic", "wedding"],
    featured: true,
  },

  {
    slug: "whitening",
    chapter: "04",
    name: "Whitening",
    tagline: "Several shades, one appointment, no raw nerves.",
    intro:
      "In-chair whitening with a desensitising protocol built in, plus trays to hold the result. We record your starting shade against a calibrated guide, so the change is a number rather than an opinion.",
    priceFrom: 9500,
    priceTo: 18000,
    duration: "75 minutes",
    sessions: "1 visit, plus home trays",
    image: {
      src: "/images/treatment-whitening.jpg",
      alt: "Shade guide tabs arranged on warm ivory stone",
      width: 1200,
      height: 1500,
    },
    what:
      "Peroxide gel, isolated gums, and three cycles under a cool light. Most patients move four to six shades. The sensitivity everyone warns you about comes from skipping the fluoride and potassium step beforehand. We do not skip it.",
    process: [
      {
        title: "Clean first",
        body: "Whitening a stained surface only whitens the stain. A hygiene visit comes first, always.",
      },
      {
        title: "Shade record",
        body: "Photographed against a calibrated guide, so the result is measurable rather than remembered.",
      },
      {
        title: "In-chair cycles",
        body: "Three cycles of gel with the gums fully isolated. Seventy-five minutes, headphones on.",
      },
      {
        title: "Hold it",
        body: "Custom trays and two gel syringes to top up twice a year.",
      },
    ],
    includes: [
      "Calibrated before and after shade record",
      "Three in-chair cycles",
      "Desensitising protocol",
      "Custom home trays",
      "Two top-up syringes",
    ],
    faqs: [
      {
        q: "Is it safe for enamel?",
        a: "At clinical concentrations and with the gums isolated, yes. The evidence on this is forty years deep.",
      },
      {
        q: "Will it whiten my crowns or veneers?",
        a: "No. Porcelain and composite do not lighten, so we plan the order of treatment around them: whiten first, then match the new work.",
      },
      {
        q: "How long does it hold?",
        a: "One to three years, depending on coffee, tea, red wine and tobacco. The home trays are what stretch it.",
      },
      {
        q: "My teeth are already sensitive.",
        a: "Tell us and we will run a slower two-visit protocol instead. Nobody needs to endure this one.",
      },
    ],
    tags: ["stains", "appearance", "quick", "budget", "wedding"],
  },

  {
    slug: "root-canal",
    chapter: "05",
    name: "Root canal",
    tagline: "The appointment with the worst reputation in dentistry.",
    intro:
      "Done properly, under magnification and with the tooth fully numb, a root canal is the treatment that ends pain rather than causes it. Most of ours finish in a single visit.",
    priceFrom: 6500,
    priceTo: 16000,
    duration: "60 to 90 minutes",
    sessions: "1 visit, usually",
    image: {
      src: "/images/treatment-root-canal.jpg",
      alt: "Operating microscope in the endodontic room",
      width: 1200,
      height: 1500,
    },
    what:
      "When the nerve inside a tooth dies or becomes infected, the pulp is removed, the canals are shaped and sealed, and the tooth is rebuilt. We work under a microscope with the tooth isolated behind a rubber dam: the two things that separate a root canal which lasts from one that gets redone in three years.",
    process: [
      {
        title: "Diagnose",
        body: "A small-field CBCT finds cracks, extra canals and the true source of pain. Guessing is what fails.",
      },
      {
        title: "Numb, properly",
        body: "We do not start until you confirm you feel nothing. If one technique is not enough, we use another.",
      },
      {
        title: "Clean and seal",
        body: "Canals shaped, irrigated and filled under the microscope. Sixty to ninety minutes, headphones on.",
      },
      {
        title: "Protect it",
        body: "A treated back tooth needs a crown to stop it splitting. Quoted upfront, never as a surprise.",
      },
    ],
    includes: [
      "Small-field CBCT diagnosis",
      "Microscope and rubber-dam isolation",
      "Single-visit completion where possible",
      "Core rebuild",
      "Six-month radiographic review",
    ],
    faqs: [
      {
        q: "Is it as bad as people say?",
        a: "No. The reputation comes from decades of treatment done without magnification or proper anaesthesia. You should feel pressure and nothing more.",
      },
      {
        q: "Why do I need a crown afterwards?",
        a: "A back tooth with its pulp removed is brittle and splits under load. The crown is not an upsell: it is what makes the root canal worth doing.",
      },
      {
        q: "Could I just have it taken out?",
        a: "You could, and we will give you both costs honestly. But replacing a tooth always costs more than keeping one.",
      },
      {
        q: "Can you see me today?",
        a: "If you are in pain, yes. We hold emergency slots every single day.",
      },
    ],
    tags: ["pain", "urgent", "save-tooth", "infection", "restore"],
  },

  {
    slug: "kids",
    chapter: "06",
    name: "Kids' care",
    tagline: "First visits that do not become a lifelong fear.",
    intro:
      "The first three appointments of a childhood decide how someone feels about dentists for the next fifty years. We spend those appointments earning trust, and almost nothing else.",
    priceFrom: 1200,
    priceTo: 8000,
    duration: "30 minutes",
    sessions: "Every 6 months",
    image: {
      src: "/images/treatment-kids.jpg",
      alt: "The small chair in the children's room at the atelier",
      width: 1200,
      height: 1500,
    },
    what:
      "Check-ups, fluoride, sealants and the occasional small filling, in a room with its own chair and no instrument tray in sight until it is needed. Children choose their own flavour, hold the mirror, and are told exactly what is about to happen before it happens.",
    process: [
      {
        title: "Visit zero",
        body: "No treatment at all. They sit in the chair, ride it up and down, meet the suction, and leave. Free, always.",
      },
      {
        title: "Look and count",
        body: "A proper examination made into a game. Parents stay in the room for as long as the child wants them there.",
      },
      {
        title: "Protect",
        body: "Fluoride varnish and sealants on the new back teeth: the cheapest dentistry that exists.",
      },
      {
        title: "Repeat",
        body: "Six-monthly, so nothing is ever a crisis and nothing is ever rushed.",
      },
    ],
    includes: [
      "Free first visit with no treatment",
      "Examination and cleaning",
      "Fluoride varnish",
      "Sealants where needed",
      "Brushing coaching for parents",
    ],
    faqs: [
      {
        q: "When should a first visit happen?",
        a: "By the first birthday, or six months after the first tooth. It is much more about habit than about treatment.",
      },
      {
        q: "My child is already terrified.",
        a: "Then we start with visit zero and move at their speed. We have never had to hold a child down, and we never will.",
      },
      {
        q: "Do you treat teenagers?",
        a: "Yes, and aligners are the usual reason they come. We talk to them directly rather than over their heads.",
      },
      {
        q: "Is sedation available for children?",
        a: "Inhalation sedation, yes, for genuinely anxious children or for longer treatment. We discuss it well before the appointment.",
      },
    ],
    tags: ["kids", "prevention", "family", "anxious"],
  },
];

export const treatmentBySlug = (slug: string) => treatments.find((t) => t.slug === slug);

export const featuredTreatments = treatments.filter((t) => t.featured);

/** Cheapest entry point on the site, quoted by the pricing section. */
export const lowestPrice = Math.min(...treatments.map((t) => t.priceFrom));
