/**
 * The one answer to "should this animate?".
 *
 * A blocking script in app/layout.tsx writes data-motion onto <html> before
 * first paint. It is "reduce" only when the visitor's system asks for
 * reduced motion AND site.config says to respect that; otherwise "full".
 * CSS reads the attribute directly; every component reads it through here.
 *
 * Nothing in the project should call matchMedia("(prefers-reduced-motion)")
 * itself - a second source of truth is how half the site ends up animated
 * and the other half does not.
 */
export function prefersReducedMotion(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.motion === "reduce";
}

/** Mouse or trackpad present: hover effects and the custom cursor make sense. */
export function hasFinePointer(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
