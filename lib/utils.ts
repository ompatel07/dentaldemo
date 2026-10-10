/** Tiny class joiner. No runtime dependency, no utility-library import. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const mapRange = (v: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);

/** 01, 02, 03 - the chapter numbering that carries the atelier concept. */
export const pad2 = (n: number) => String(n).padStart(2, "0");

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Chunk an array - used by the editorial grids to build asymmetric rows. */
export function chunk<T>(arr: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size) as T[]);
  return out;
}

/**
 * Run `cb` once the element is within `rootMargin` of the viewport.
 *
 * Used to defer expensive DOM work - chiefly SplitText, which forces a
 * reflow per element - so that twenty headlines below the fold do not all
 * split during hydration.
 */
export function onNearViewport(el: Element, cb: () => void, rootMargin = "400px 0px"): () => void {
  if (typeof IntersectionObserver === "undefined") {
    cb();
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        cb();
      }
    },
    { rootMargin },
  );
  io.observe(el);
  return () => io.disconnect();
}

/**
 * Fire `cb` once, when the element has entered the viewport far enough to
 * be worth revealing.
 *
 * This replaces a one-shot ScrollTrigger on purpose. ScrollTrigger resolves
 * its start point from the element's position in the document, which is the
 * wrong answer for anything inside a pinned, horizontally translated track:
 * the start was never reached and those reveals stayed invisible forever.
 * An IntersectionObserver asks the browser where the element actually is,
 * so it works the same inside a pin, a transform or a scroll container.
 *
 * `-12%` bottom margin is the rough equivalent of ScrollTrigger's
 * "top 88%".
 */
export function onEnterViewport(el: Element, cb: () => void, rootMargin = "0px 0px -12% 0px"): () => void {
  if (typeof IntersectionObserver === "undefined") {
    cb();
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        cb();
      }
    },
    { rootMargin },
  );
  io.observe(el);
  return () => io.disconnect();
}

/** requestIdleCallback where it exists, a timeout where it does not. */
export function onIdle(cb: () => void, timeout = 2000): () => void {
  type RIC = (cb: () => void, opts?: { timeout: number }) => number;
  const ric = (globalThis as unknown as { requestIdleCallback?: RIC }).requestIdleCallback;
  if (ric) {
    const id = ric(cb, { timeout });
    return () => (globalThis as unknown as { cancelIdleCallback?: (i: number) => void }).cancelIdleCallback?.(id);
  }
  const id = setTimeout(cb, 200);
  return () => clearTimeout(id);
}
