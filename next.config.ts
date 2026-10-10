import type { NextConfig } from "next";

/**
 * SECURITY HEADERS
 *
 * Everything here is safe for a static marketing site and costs nothing at
 * runtime. The Content-Security-Policy is the interesting one, so the
 * reasoning is written down rather than left for the next person to guess.
 *
 * `script-src` carries 'unsafe-inline'. That is not laziness: Next inlines
 * its own bootstrap and flight data into the document, and the only way to
 * drop 'unsafe-inline' is per-request nonces via middleware - which forces
 * every page out of static rendering. For a clinic site that is a bad
 * trade. The README documents how to switch it on if a deployment needs a
 * strict policy.
 *
 * What the policy does buy, even with inline scripts allowed:
 *   - no script may be loaded from a third-party origin
 *   - no object/embed, no base-tag hijacking, no form posting off-site
 *   - the site cannot be framed by anyone else (clickjacking)
 *   - frames are limited to the one map provider
 */
/**
 * Vercel injects its comment toolbar into PREVIEW deployments from
 * vercel.live. Without these, every preview logs a wall of CSP violations
 * that look like bugs in the site. Production gets none of it.
 */
const preview = process.env.VERCEL_ENV === "preview";
const live = preview ? " https://vercel.live" : "";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${live}`,
  `style-src 'self' 'unsafe-inline'${live}`,
  `img-src 'self' data: blob:${preview ? " https://vercel.live https://vercel.com" : ""}`,
  "media-src 'self'",
  `font-src 'self' data:${preview ? " https://vercel.live https://assets.vercel.com" : ""}`,
  `connect-src 'self'${preview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
  // The hero molar is meshed in a Web Worker. A production build serves that
  // worker as a file from this origin; the dev server wraps it in a blob.
  process.env.NODE_ENV === "production" ? "worker-src 'self'" : "worker-src 'self' blob:",
  // The map embed. Replace with the provider actually configured in
  // site.config.contact.mapEmbedSrc - e.g. https://www.google.com.
  `frame-src 'self' https://www.openstreetmap.org${live}`,
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    // Nothing on this site needs any of them.
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Only honoured over HTTPS; harmless locally.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

/**
 * The site's own origin, for canonical URLs, the sitemap and social cards.
 * Set NEXT_PUBLIC_SITE_URL once there is a real domain; until then Vercel's
 * production domain is used, so a fresh deploy is correct with no setup.
 * Inlined here (not read at runtime) so server and browser always agree.
 */
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (vercelHost ? `https://${vercelHost}` : "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  env: { NEXT_PUBLIC_SITE_URL: siteUrl },

  images: {
    formats: ["image/avif", "image/webp"],
    // Next 16 requires every `quality` passed to next/image to be declared.
    // 75 is the default; 74 is the hero still, which is a soft-focus object
    // and loses nothing to the extra compression.
    qualities: [74, 75],
    // A month. Photos live under stable file names, so a longer TTL means a
    // replaced photograph keeps serving its old optimised variant.
    minimumCacheTTL: 2592000,
  },

  experimental: {
    optimizePackageImports: ["gsap", "motion", "@react-three/drei"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Immutable, content-hashed build output.
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
