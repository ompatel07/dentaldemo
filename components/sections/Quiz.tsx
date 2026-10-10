"use client";

import { useMemo, useState } from "react";
import { ThemeSection } from "@/components/motion/ThemeSection";
import { Reveal } from "@/components/motion/Reveal";
import Image from "next/image";
import { ChapterLabel } from "@/components/ui/ChapterLabel";
import { emphasize } from "@/components/motion/Emphasis";
import { Button } from "@/components/ui/Button";
import { TransitionLink } from "@/components/shell/PageTransition";
import { quizSteps, quizResult } from "@/content/quiz";
import { sections } from "@/content/sections";
import { scoreQuiz, type QuizAnswers } from "@/lib/quiz";
import { formatCurrency, telHref } from "@/lib/format";
import { site } from "@/content/site.config";
import { cx } from "@/lib/utils";

/**
 * 11 - The smile quiz.
 *
 * Five questions, no email gate. Gating the result behind an address is the
 * standard move and it is why nobody finishes these; the recommendation is
 * worth more as a reason to call than as a lead magnet.
 *
 * Scoring lives in lib/quiz.ts and reads tags off the treatments, so adding
 * a question or retagging a treatment changes the outcome with no code
 * change here. If the answers point at pain, the result leads with the
 * emergency line instead of a price range.
 */
export function Quiz() {
  const { quiz: copy } = sections;

  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [direction, setDirection] = useState(1);

  const done = index >= quizSteps.length;
  const outcome = useMemo(() => (done ? scoreQuiz(answers) : null), [answers, done]);

  const progress = Math.min(1, index / quizSteps.length);

  const choose = (stepId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [stepId]: value }));
    setDirection(1);
    setIndex((i) => i + 1);
  };

  const back = () => {
    setDirection(-1);
    setIndex((i) => Math.max(0, i - 1));
  };

  const restart = () => {
    setAnswers({});
    setIndex(0);
    setDirection(1);
  };

  const step = quizSteps[index];

  return (
    <ThemeSection theme="paper" id="quiz" className="section-y">
      <div className="edge grid-editorial items-stretch gap-y-8">
        {/* A face, not a form: the left column is why anyone starts. */}
        <Reveal className="relative col-span-12 lg:col-span-4" y={26}>
          <div className="relative h-full min-h-[340px] overflow-hidden rounded-[var(--r-xl)] bg-surface">
            <Image src="/images/quiz-portrait.jpg" alt="A patient holding a clear aligner" fill sizes="(max-width: 1024px) 92vw, 30vw" className="object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/85 via-[var(--ink)]/15 to-transparent" />
            {/* ink theme, so the emphasis word takes the light accent over the photo */}
            <div data-theme="ink" className="absolute inset-x-5 bottom-5 text-fg">
              <ChapterLabel chapter={copy.chapter}>
                {copy.label}
              </ChapterLabel>
              <h2 className="display mt-4 text-h2">{emphasize(copy.headline, copy.emphasis)}</h2>
              <p className="mt-3 max-w-[36ch] text-sm text-muted">{copy.body}</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="col-span-12 lg:col-span-8" y={26} delay={0.08}>
          <div className="flex h-full flex-col overflow-hidden rounded-[var(--r-xl)] border border-line bg-surface-2">
            {/* Progress */}
            <div className="flex items-center gap-5 border-b border-line px-[clamp(1.25rem,3vw,2.5rem)] py-5">
              <p className="shrink-0 text-sm font-medium">
                {done ? quizResult.eyebrow : `${copy.progressLabel} ${index + 1} / ${quizSteps.length}`}
              </p>
              <div className="h-1 flex-1 overflow-hidden rounded-pill bg-line">
                <div
                  className="h-full rounded-pill bg-accent-bright transition-[width] duration-700 ease-[var(--ease-expo)]"
                  style={{ width: `${(done ? 1 : progress) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={Math.round((done ? 1 : progress) * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={copy.label}
                />
              </div>
              {index > 0 && !done ? (
                <button onClick={back} className="shrink-0 text-sm font-medium hover:text-accent">
                  {copy.backLabel}
                </button>
              ) : null}
            </div>

            <div className="relative flex-1 px-[clamp(1.25rem,3vw,2.5rem)] py-[clamp(1.75rem,4vh,3rem)]">
                {!started ? (
                  <div key="intro" className="panel-enter" data-dir={direction}>
                    <p className="display max-w-[20ch] text-h2">
                      {quizSteps.length} questions. No email, no sales call.
                    </p>
                    <p className="mt-4 max-w-[48ch] text-muted">
                      You will get a starting point and an indicative range. What you do with it is up to you.
                    </p>
                    <div className="mt-8">
                      <Button onClick={() => setStarted(true)} cursorLabel="Start">
                        {copy.startCta}
                      </Button>
                    </div>
                  </div>
                ) : done && outcome ? (
                  <div key="result" className="panel-enter" data-dir={direction}>
                    {outcome.urgent ? (
                      <div className="mb-8 rounded-md border border-accent bg-accent/10 p-6">
                        <p className="display text-h3">{quizResult.urgentNotice.title}</p>
                        <p className="mt-3 max-w-[52ch] text-muted">{quizResult.urgentNotice.body}</p>
                        <a
                          href={telHref(site.contact.emergencyPhone)}
                          className="label mt-5 inline-block text-accent underline underline-offset-8"
                        >
                          {site.contact.emergencyPhone}
                        </a>
                      </div>
                    ) : null}

                    <h3 className="display max-w-[20ch] text-h2">{quizResult.headline}</h3>
                    <p className="mt-4 max-w-[52ch] text-muted">{quizResult.bodyPrefix}</p>

                    <ul className="mt-9 grid gap-px overflow-hidden rounded-md bg-line sm:grid-cols-3">
                      {outcome.matches.map((t) => (
                        <li key={t.slug} className="bg-bg p-6">
                          <p className="label text-accent">{t.chapter}</p>
                          <p className="display mt-3 text-h3">{t.name}</p>
                          <p className="mt-3 text-sm text-muted">{t.tagline}</p>
                          <TransitionLink
                            href={`/treatments/${t.slug}`}
                            className="label mt-5 inline-block hover:text-accent"
                          >
                            Read more &rarr;
                          </TransitionLink>
                        </li>
                      ))}
                    </ul>

                    <dl className="mt-8 flex flex-wrap items-baseline gap-x-10 gap-y-4 border-t border-line pt-6">
                      <div>
                        <dt className="label">{quizResult.rangeLabel}</dt>
                        <dd className="display mt-2 text-h3">
                          {formatCurrency(outcome.estimateLow)} &ndash; {formatCurrency(outcome.estimateHigh)}
                        </dd>
                      </div>
                      <p className="max-w-[40ch] text-sm text-muted">{quizResult.disclaimer}</p>
                    </dl>

                    <div className="mt-9 flex flex-wrap items-center gap-4">
                      <Button href="/#book" cursorLabel="Book">
                        {quizResult.cta}
                      </Button>
                      <button onClick={restart} className="label hover:text-accent">
                        {quizResult.restart}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={step.id} className="panel-enter" data-dir={direction}>
                    <p className="font-mono text-xs text-accent">{step.chapter}</p>
                    <h3 className="display mt-4 max-w-[20ch] text-h2">{step.question}</h3>
                    {step.helper ? <p className="mt-4 max-w-[52ch] text-muted">{step.helper}</p> : null}

                    <ul className="mt-9 grid gap-3 sm:grid-cols-2">
                      {step.options.map((option) => {
                        const chosen = answers[step.id] === option.value;
                        return (
                          <li key={option.value}>
                            <button
                              onClick={() => choose(step.id, option.value)}
                              aria-pressed={chosen}
                              className={cx(
                                "group/opt h-full w-full rounded-[var(--r-md)] border p-5 text-left transition-colors duration-300",
                                chosen
                                  ? "border-accent bg-tint"
                                  : "border-line hover:border-fg hover:bg-bg",
                              )}
                            >
                              <span className="flex items-baseline justify-between gap-4">
                                <span className="text-[1.0625rem] font-medium leading-snug">{option.label}</span>
                                <span
                                  aria-hidden="true"
                                  className="label shrink-0 text-accent opacity-0 transition-opacity group-hover/opt:opacity-100"
                                >
                                  &rarr;
                                </span>
                              </span>
                              {option.hint ? <span className="mt-2 block text-sm text-muted">{option.hint}</span> : null}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        </Reveal>
      </div>
    </ThemeSection>
  );
}
