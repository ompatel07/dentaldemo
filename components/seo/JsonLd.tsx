import { site, fullAddress } from "@/content/site.config";
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
    telephone: site.contact.phone,
    email: site.contact.email,
    image: site.seo.url + site.seo.ogImage.src,
    priceRange: site.currency.symbol + site.currency.symbol,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.address.line1 + ", " + site.contact.address.line2,
      addressLocality: site.contact.address.city,
      addressRegion: site.contact.address.region,
      postalCode: site.contact.address.postalCode,
      addressCountry: site.contact.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.contact.geo.latitude,
      longitude: site.contact.geo.longitude,
    },
    hasMap: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(fullAddress),
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
