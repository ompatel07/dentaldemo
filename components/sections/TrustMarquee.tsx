import { Marquee } from "@/components/motion/Marquee";
import { ThemeSection } from "@/components/motion/ThemeSection";
import { site } from "@/content/site.config";
import { sections } from "@/content/sections";

/**
 * 02 - Trust band.
 *
 * Affiliations as type wordmarks rather than bitmap logos: crisp at any
 * size, on-palette, and never stale in a /public folder. The belt speeds up
 * with scroll velocity and reverses with direction.
 *
 * The belt is aria-hidden - nobody should have to listen to three looped
 * copies - so the same list is rendered once, plainly, for assistive tech.
 */
export function TrustMarquee() {
  const { trust } = sections;

  return (
    <ThemeSection theme="ink" className="relative overflow-hidden py-[clamp(1.1rem,2.6vh,1.6rem)]">
      <Marquee speed={60} direction={-1}>
        {site.affiliations.map((a) => (
          <span key={a.wordmark} className="flex items-center gap-5 pr-5">
            <span className="display whitespace-nowrap text-[clamp(1.15rem,1.7vw,1.6rem)] leading-none">{a.wordmark}</span>
            {a.note ? <span className="whitespace-nowrap text-sm text-muted">{a.note}</span> : null}
            <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-pill bg-accent-bright" />
          </span>
        ))}
      </Marquee>

      <h2 className="sr-only">{trust.label}</h2>
      <ul className="sr-only">
        {site.affiliations.map((a) => (
          <li key={a.wordmark}>
            {a.wordmark}
            {a.note ? ` - ${a.note}` : ""}
          </li>
        ))}
      </ul>
    </ThemeSection>
  );
}
