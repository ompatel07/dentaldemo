import { quizSteps } from "@/content/quiz";
import { treatments } from "@/content/treatments";
import type { Treatment } from "@/content/types";

/**
 * Quiz scoring. Answers accumulate tags; tags are scored against each
 * treatment's own tags. Content decides the outcome, not this file - add a
 * step or retag a treatment and the recommendation changes with no code edit.
 */

export type QuizAnswers = Record<string, string>;

export type QuizOutcome = {
  matches: Treatment[];
  tags: string[];
  /** Sum of priceFrom across the matched set. */
  estimateLow: number;
  estimateHigh: number;
  urgent: boolean;
  anxious: boolean;
};

const URGENT_TAGS = new Set(["urgent", "pain", "infection"]);
const ANXIOUS_TAGS = new Set(["anxious"]);

export function collectTags(answers: QuizAnswers): string[] {
  const tags: string[] = [];
  for (const step of quizSteps) {
    const value = answers[step.id];
    if (!value) continue;
    const option = step.options.find((o) => o.value === value);
    if (option) tags.push(...option.tags);
  }
  return tags;
}

export function scoreQuiz(answers: QuizAnswers, limit = 3): QuizOutcome {
  const tags = collectTags(answers);
  const weight = new Map<string, number>();
  // Earlier steps describe the problem, later ones describe constraints, so
  // the first answers count for more.
  tags.forEach((tag, i) => {
    const stepWeight = 1 + Math.max(0, 1 - i * 0.08);
    weight.set(tag, (weight.get(tag) ?? 0) + stepWeight);
  });

  const scored = treatments
    .map((treatment) => {
      let score = 0;
      for (const tag of treatment.tags) score += weight.get(tag) ?? 0;
      return { treatment, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  // Nothing matched (possible if the config is retagged): fall back to the
  // featured set rather than showing an empty result.
  const matches = (scored.length ? scored.slice(0, limit).map((s) => s.treatment) : treatments.filter((t) => t.featured).slice(0, limit));

  const estimateLow = matches.reduce((sum, t) => sum + t.priceFrom, 0);
  const estimateHigh = matches.reduce((sum, t) => sum + (t.priceTo ?? t.priceFrom * 2), 0);

  return {
    matches,
    tags,
    estimateLow,
    estimateHigh,
    urgent: tags.some((t) => URGENT_TAGS.has(t)),
    anxious: tags.some((t) => ANXIOUS_TAGS.has(t)),
  };
}

export const isQuizComplete = (answers: QuizAnswers) => quizSteps.every((step) => Boolean(answers[step.id]));
