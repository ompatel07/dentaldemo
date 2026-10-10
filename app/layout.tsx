import type { Metadata, Viewport } from "next";
import { site } from "@/content/site.config";
import { fontVariables } from "./fonts";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CursorFollower } from "@/components/motion/CursorFollower";
import { IntroProvider } from "@/components/shell/IntroProvider";
import { TransitionProvider } from "@/components/shell/PageTransition";
import { Nav } from "@/components/shell/Nav";
import { Dock } from "@/components/shell/Dock";
import { Footer } from "@/components/shell/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.seo.url),
  title: {
    default: site.seo.titleDefault,
    template: site.seo.titleTemplate,
  },
  description: site.seo.description,
  keywords: [...site.seo.keywords],
  applicationName: site.brand.name,
  authors: [{ name: site.brand.name }],
  openGraph: {
    type: "website",
    locale: site.locale.replace("-", "_"),
    url: site.seo.url,
    siteName: site.brand.name + " " + site.brand.suffix,
    title: site.seo.titleDefault,
    description: site.seo.description,
    images: [{ url: site.seo.ogImage.src, width: site.seo.ogImage.width, height: site.seo.ogImage.height }],
  },
  twitter: {
    card: "summary_large_image",
    site: site.seo.twitter,
    title: site.seo.titleDefault,
    description: site.seo.description,
    images: [site.seo.ogImage.src],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#F4F6F3",
  colorScheme: "light",
};

/**
 * Runs before first paint. It does two jobs: it decides the motion mode for
 * the whole site (data-motion, read by both CSS and JS), and it marks
 * repeat visits and phones so the preloader never flashes before React can
 * remove it.
 *
 * Phones skip the intro entirely. It is a two-second entrance built for a
 * desktop showcase; on a handset it is two seconds between a patient and
 * the phone number, and it measurably delays Largest Contentful Paint.
 */
const introSkipScript = `try{var d=document.documentElement,e=${site.intro.enabled},s=false;d.dataset.motion=(${site.motion.reducedMotion === "respect"}&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)?'reduce':'full';try{s=sessionStorage.getItem('aurelle:intro-seen')==='1'}catch(x){}var n=window.innerWidth<1024;if(s)d.classList.add('intro-seen');if(n)d.classList.add('intro-skip');if(!e||s||n||location.pathname!=='/')d.classList.add('intro-done');var v=performance.getEntriesByType('navigation')[0];if(window.innerWidth<768&&!location.hash&&(!v||v.type==='navigate'))d.classList.add('booting')}catch(x){document.documentElement.classList.add('intro-done')}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={site.locale}
      data-theme="paper"
      className={fontVariables}
      /* The intro script below adds classes to <html> before React
         hydrates, which is the whole point of it running early. Without
         this, React reports that mismatch as an error on every load. */
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introSkipScript }} />
        {/* Without JS nothing ever unhides the reveals, so do it here. */}
        <noscript>
          <style>{`[data-reveal]{visibility:visible!important}.preloader{display:none!important}.reveal-rise{animation:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <TransitionProvider>
          <IntroProvider>
            <SmoothScroll>
              <Nav />
              {children}
              <Footer />
              <Dock />
            </SmoothScroll>
          </IntroProvider>
        </TransitionProvider>

        <div className="grain" aria-hidden="true" />
        <CursorFollower />
      </body>
    </html>
  );
}
