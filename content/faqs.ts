import type { Faq } from "./types";

/** Home-page FAQ accordion. Also emitted as FAQPage JSON-LD. */

export const faqs: Faq[] = [
  {
    q: "Do I need a referral to come here?",
    a: "No. Use the booking form or send us a message. First visits are usually available within two or three working days, and same-day if you are in pain.",
  },
  {
    q: "How do you handle emergencies?",
    a: "We hold slots every single day for pain, swelling, broken teeth and knocked-out teeth. Say it is urgent when you book and we will fit you in the same day.",
  },
  {
    q: "Are your prices really fixed?",
    a: "The starting prices on this page are real. Your own estimate is written after the examination and scan, and it does not change afterwards unless you ask us to change the plan. If we find something mid-treatment, we stop and talk to you before anything is added.",
  },
  {
    q: "Can I pay monthly?",
    a: "Yes, on everything. Three to twenty-four months through our finance partners, with no-cost EMI up to six months. The EMI calculator on this page gives you an indicative figure before you ever speak to us.",
  },
  {
    q: "Will my insurance cover this?",
    a: "Dental cover in India is limited and varies enormously. We bill cashless with several insurers and provide full documentation for reimbursement with the rest. Bring your policy number to the first visit and we will tell you honestly what it will and will not cover.",
  },
  {
    q: "I am genuinely frightened of dentists. Where do I start?",
    a: "With a visit where nothing is done. You sit in the chair, see the room, ask everything you want, and leave. It is free, it takes thirty minutes, and about a third of our new patients begin this way. Sedation, from mild inhalation to full intravenous with an anaesthetist, is available whenever you want it.",
  },
  {
    q: "Do you treat children?",
    a: "Yes, in a separate room with its own chair and a paediatric dentist who has made it his life's work. First visits are free and involve no treatment at all.",
  },
  {
    q: "How long will an appointment take?",
    a: "A first visit is forty minutes. We do not double-book chairs, which is why we can say that and mean it. If a treatment needs ninety minutes, it is booked for ninety minutes.",
  },
  {
    q: "What languages do you speak?",
    a: "English, Hindi, Gujarati across the whole team, and Marathi with Dr. Shah. Tell us which you are most comfortable in when you book.",
  },
  // Waiting on the clinic's address (see contact in site.config.ts).
  // Restore this one with the real street and parking details:
  // {
  //   q: "Where exactly are you, and is there parking?",
  //   a: "<street address>. <parking and access details>.",
  // },
];
