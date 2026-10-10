import { site, fullAddress } from "@/content/site.config";
import { mapsHref } from "@/lib/format";
import { cx } from "@/lib/utils";

/**
 * The embedded map.
 *
 * On a touch screen an interactive map in the middle of a page is a trap:
 * the finger that was scrolling the page lands on it and starts panning the
 * map instead, and the page will not move until it finds an edge. So on
 * coarse pointers the embed is a picture - it ignores touches - and the
 * whole frame is one link that opens the address in the phone's maps app,
 * which is what somebody on a phone wanted anyway.
 */
export function MapEmbed({ heightClass = "h-[220px]", className }: { heightClass?: string; className?: string }) {
  return (
    <div className={cx("relative overflow-hidden rounded-mask border border-line", className)}>
      <iframe
        src={site.contact.mapEmbedSrc}
        title={"Map to " + site.brand.name}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={cx("w-full pointer-coarse:pointer-events-none", heightClass)}
      />
      <a
        href={mapsHref(site.brand.name + ", " + fullAddress)}
        target="_blank"
        rel="noreferrer noopener"
        className="absolute inset-0 hidden items-end justify-end p-3 pointer-coarse:flex"
      >
        <span className="rounded-pill bg-[var(--ink)] px-4 py-2.5 text-sm font-medium text-[var(--paper)] shadow-[var(--shadow-lift)]">
          Open in Maps <span aria-hidden="true">&#8599;</span>
        </span>
      </a>
    </div>
  );
}
