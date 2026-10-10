import { Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
import { TrustMarquee } from "@/components/sections/TrustMarquee";
import { Manifesto } from "@/components/sections/Manifesto";
import { Treatments } from "@/components/sections/Treatments";
import { Transformations } from "@/components/sections/Transformations";
import { Journey } from "@/components/sections/Journey";
import { Technology } from "@/components/sections/Technology";
import { Comfort } from "@/components/sections/Comfort";
import { Doctors } from "@/components/sections/Doctors";
import { Pricing } from "@/components/sections/Pricing";
import { Quiz } from "@/components/sections/Quiz";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { BookingCta } from "@/components/sections/BookingCta";
import { ClinicJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";

/**
 * The home page: fourteen numbered chapters, in order.
 *
 * Every section reads its own copy from /content, so this file is a running
 * order and nothing else.
 *
 * The <Suspense> boundaries are not waiting for anything. A boundary is
 * also the unit React hydrates in, so each lower section wakes up in its
 * own short task instead of all fourteen sharing one long one. The first
 * six stay together on purpose: two of them pin, and ScrollTrigger needs
 * pinned sections created in page order.
 */
export default function Home() {
  return (
    <>
      <ClinicJsonLd />
      <FaqJsonLd />

      <main id="main">
        <Hero />
        <TrustMarquee />
        <Manifesto />
        <Treatments />
        <Transformations />
        <Journey />
        <Suspense>
          <Technology />
        </Suspense>
        <Suspense>
          <Comfort />
        </Suspense>
        <Suspense>
          <Doctors />
        </Suspense>
        <Suspense>
          <Pricing />
        </Suspense>
        <Suspense>
          <Quiz />
        </Suspense>
        <Suspense>
          <Testimonials />
        </Suspense>
        <Suspense>
          <Faq />
        </Suspense>
        <Suspense>
          <BookingCta />
        </Suspense>
      </main>
    </>
  );
}
