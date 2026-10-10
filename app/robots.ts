import type { MetadataRoute } from "next";
import { site } from "@/content/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The style guide is for whoever is rebranding the template, not
        // for search results.
        disallow: ["/kit"],
      },
    ],
    sitemap: `${site.seo.url}/sitemap.xml`,
    host: site.seo.url,
  };
}
