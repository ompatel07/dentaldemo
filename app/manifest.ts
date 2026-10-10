import type { MetadataRoute } from "next";
import { site } from "@/content/site.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.brand.name} - ${site.brand.suffix}`,
    short_name: site.brand.name,
    description: site.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F4F6F3",
    theme_color: "#F4F6F3",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
