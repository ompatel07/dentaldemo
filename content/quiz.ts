import type { QuizStep } from "./types";

/**
 * The smile quiz: five steps, each answer contributing tags that are scored
 * against `treatment.tags` by lib/quiz.ts. Add or remove steps freely - the
 * component reads the array length for its progress bar.
 */

export const quizSteps: QuizStep[] = [
  {
    id: "concern",
    chapter: "01",
    question: "What brought you here?",
    helper: "Pick the one that is loudest. We will cover the rest in the chair.",
    options: [
      { value: "appearance", label: "How my smile looks", hint: "Shade, shape, gaps", tags: ["appearance", "shape", "stains"] },
      { value: "crooked", label: "Teeth that are crooked", hint: "Crowding or drift", tags: ["crooked", "alignment", "gaps"] },
      { value: "pain", label: "Something hurts", hint: "Ache, throb, sensitivity", tags: ["pain", "urgent", "infection"] },
      { value: "missing", label: "A missing or broken tooth", hint: "Gap, failed bridge, cracked molar", tags: ["missing-tooth", "restore", "chewing"] },
    ],
  },
  {
    id: "last-visit",
    chapter: "02",
    question: "When did you last sit in a dental chair?",
    helper: "There is no wrong answer here, and no lecture coming.",
    options: [
      { value: "recent", label: "Within the last year", tags: ["maintained"] },
      { value: "few-years", label: "Two or three years ago", tags: ["prevention"] },
      { value: "long", label: "Longer than I want to admit", hint: "Five years or more", tags: ["anxious", "prevention"] },
      { value: "never", label: "Honestly, never as an adult", tags: ["anxious", "prevention"] },
    ],
  },
  {
    id: "goal",
    chapter: "03",
    question: "What would a good outcome look like?",
    options: [
      { value: "natural", label: "Nobody notices it was done", tags: ["discreet", "shape"] },
      { value: "brighter", label: "Noticeably brighter", tags: ["stains", "appearance", "quick"] },
      { value: "function", label: "Being able to chew properly again", tags: ["function", "chewing", "restore"] },
      { value: "painfree", label: "Simply not being in pain", tags: ["pain", "save-tooth"] },
    ],
  },
  {
    id: "timeline",
    chapter: "04",
    question: "How soon does this need to happen?",
    options: [
      { value: "today", label: "Today, if possible", hint: "We hold emergency slots daily", tags: ["urgent", "pain", "quick"] },
      { value: "weeks", label: "Within a few weeks", hint: "An event in the diary", tags: ["fast-cosmetic", "quick", "wedding"] },
      { value: "months", label: "Over the next few months", tags: ["alignment", "long-term"] },
      { value: "exploring", label: "Just exploring for now", tags: ["long-term", "prevention"] },
    ],
  },
  {
    id: "budget",
    chapter: "05",
    question: "Is there a budget you would like us to plan around?",
    helper: "It changes what we recommend, not how we treat you. EMI is available on everything.",
    options: [
      { value: "low", label: "Keep it modest", hint: "Under 25,000", tags: ["budget", "quick", "prevention"] },
      { value: "mid", label: "Mid range", hint: "25,000 to 1,00,000", tags: ["restore", "shape"] },
      { value: "high", label: "Whatever the right answer costs", tags: ["long-term", "appearance", "alignment"] },
      { value: "emi", label: "I would rather talk monthly", hint: "Spread it over 6 to 24 months", tags: ["long-term", "alignment", "restore"] },
    ],
  },
];

/** Copy for the result screen. Numbers come from the matched treatments. */
export const quizResult = {
  eyebrow: "Your reading",
  headline: "Here is where we would start.",
  bodyPrefix: "Based on what you told us, these are the treatments worth discussing first.",
  rangeLabel: "Indicative range",
  disclaimer:
    "A quiz cannot examine you. This is a starting point for a conversation, not a diagnosis or a quote.",
  cta: "Book with this prefilled",
  restart: "Start again",
  /** Shown when answers point at pain or urgency. */
  urgentNotice: {
    title: "This sounds like it should not wait.",
    body: "Tell us it is urgent when you book. We keep slots open every day for exactly this.",
  },
};
