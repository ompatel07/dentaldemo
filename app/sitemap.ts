import type { MetadataRoute } from "next";
import { site } from "@/content/site.config";
import { treatments } from "@/content/treatments";

/** Generated from content, so a new treatment appears here automatically. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.seo.url;
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/doctors`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    ...treatments.map((t) => ({
      url: `${base}/treatments/${t.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.9,
    })),
  ];
}
