import { site, fullAddress, has } from "@/content/site.config";
import { faqs } from "@/content/faqs";

/**
 * Structured data generated from the same content the page renders, so the
 * schema can never drift from what a visitor actually sees.
 */

function Script({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Content is ours, not user input; the escape guards against a stray
      // closing tag inside any copy string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}

export function ClinicJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": site.seo.url + "#clinic",
    name: site.brand.name + " " + site.brand.suffix,
    description: site.seo.description,
    url: site.seo.url,
    // Search engines are told only what has actually been supplied: an
    // empty telephone or a street-less address is worse than none.
    ...(has.phone ? { telephone: site.contact.phone } : {}),
    email: site.contact.email,
    image: site.seo.url + site.seo.ogImage.src,
    priceRange: site.currency.symbol + site.currency.symbol,
    address: {
      "@type": "PostalAddress",
      ...(has.address
        ? {
            streetAddress: [site.contact.address.line1, site.contact.address.line2].filter(Boolean).join(", "),
            postalCode: site.contact.address.postalCode,
          }
        : {}),
      ...(has.city ? { addressLocality: site.contact.address.city } : {}),
      ...(site.contact.address.region ? { addressRegion: site.contact.address.region } : {}),
      addressCountry: site.contact.address.country,
    },
    ...(site.contact.geo
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: site.contact.geo.latitude,
            longitude: site.contact.geo.longitude,
          },
        }
      : {}),
    ...(has.address
      ? { hasMap: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(fullAddress) }
      : {}),
    openingHoursSpecification: site.hours
      .filter((h) => h.opens && h.closes)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "https://schema.org/" + h.day,
        opens: h.opens,
        closes: h.closes,
      })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.proof.rating,
      reviewCount: site.proof.reviewCount,
      bestRating: 5,
    },
    sameAs: site.socials.map((s) => s.href),
  };

  return <Script data={data} />;
}

export function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return <Script data={data} />;
}
