# Aurelle — Dental Atelier

A flagship, rebrandable dental clinic website template.
**Next.js 15 (App Router) · TypeScript · Tailwind v4 · GSAP + Lenis · React Three Fiber**

Fourteen numbered chapters on the home page, four inner page types, and a content layer that lets you point the whole thing at a real clinic in about an hour.

---

## Run it

```bash
npm install
npm run dev             # http://localhost:3000
```

The demo photography is already in `public/images/`.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` / `npm start` | Production build and serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run photos` | Re-download and crop the demo photographs (see Photography) |
| `npm run placeholders` | Generate neutral placeholders for any slot that has no file |
| `npm run og` | Rebuild the social share card from the live hero (dev server must be running) |
| `npm run matcap` / `npm run tooth` | Re-bake the 3D molar's lighting and its still (dev server must be running) |

Visit **`/kit`** to see the whole design system — palette, type scale, and every motion primitive as the live component. It is `noindex` and excluded in `robots.ts`.

> **If nothing animates on your machine**, it is almost certainly Windows: *Settings → Accessibility → Visual effects → Animation effects* set to Off makes every browser report `prefers-reduced-motion`. The demo ships with `motion.reducedMotion: "ignore"` in `content/site.config.ts` so it moves regardless. **Set it to `"respect"` before a real clinic goes live** — that is the accessible behaviour, and the reduced fallback is fully built.

---

## Deploy to Vercel

There is nothing to configure: import the repository at [vercel.com/new](https://vercel.com/new), accept the detected **Next.js** preset, and deploy. No environment variables are required.

- **The site's own URL** (canonical links, sitemap, `robots.txt`, Open Graph, JSON-LD) resolves itself at build time: `NEXT_PUBLIC_SITE_URL` if you set it, otherwise the project's production domain on Vercel. When the clinic has a real domain, add it in *Project → Domains* and set `NEXT_PUBLIC_SITE_URL=https://the-domain` in *Project → Environment Variables*, then redeploy.
- **Every page is static** (prerendered at build), and images are optimised by Vercel on demand.
- **Preview deployments** get a slightly wider Content-Security-Policy so Vercel's comment toolbar can load; production does not.
- **The demo ships with search indexing on.** If the deployment is a portfolio piece that should stay out of Google, set `robots: { index: false }` in `app/layout.tsx`.
- Before a real clinic goes live: replace the demo photography, set `motion.reducedMotion: "respect"`, and point `booking.endpoint` at something that receives the bookings — until then the form succeeds without sending anything anywhere.

The scripts in `scripts/` (photo pipeline, bakes, audits) are local tools that drive the Chrome on your own machine; none of them run during a deploy.

---

## Phones

Most visitors arrive on one, so the phone layout is tested the way a phone is used — by touch.

```bash
node scripts/mobile.mjs        http://localhost:3000/   # swipes top to bottom with real touch gestures
node scripts/mobile.mjs        http://localhost:3000/ --w 320 --h 568
node scripts/mobile-flows.mjs  http://localhost:3000    # menu, booking, carousel and scroll locks, by touch
```

`mobile.mjs` reports whether a finger can actually scroll the page, any sideways overflow, any text under 12px, and leaves a screenshot walk-through in `.inspect/walk-<width>/`. It exists because of a real bug: the page scrolled perfectly from script (`window.scrollTo`) and from a mouse wheel while being completely stuck under a finger. **Never sign off a phone layout from scripted scrolling.**

What is different below 768px:

- **Scrolling is native.** Lenis is not started on touch devices; scroll locks (menu, booking) are counted and always released.
- **The hero is one tall photograph with the headline on it.** The picture of the chair and the headline share a grid cell: the headline sits at the foot of the image in white over a dark fade, the 3D molar turns on a stamped badge at the top corner, and the copy, full-width buttons, rating and a dark card of proof numbers follow underneath. The molar runs live on phones with enough memory once the page has loaded; the still is there from the first frame.
- **Treatments** is a heading with its own swipe carousel beneath it, not one long horizontal track.
- **Technology** cards are a plain stack; the sticky overlap only happens from tablet width up.
- **Before/after** puts the photograph above the list of cases.
- **Maps do not trap the finger**: on touch the embed ignores gestures and the whole frame is an "Open in Maps" link.
- **Form fields are never under 16px**, which is the threshold below which iOS zooms the page on focus.

---

## The one-hour rebrand

### 1. `content/site.config.ts` — 15 minutes

Brand name, tagline, phone numbers, address, geo coordinates, opening hours, socials, currency, locale, SEO strings, financing rates, booking slots. Also the behaviour switches, documented in place: `motion.reducedMotion`, `intro`, `hero.object`, `hero.phones`, `booking.endpoint`.

> **Phone numbers, the street address and the city are currently empty**, waiting on the client. That is a supported state, not a gap: leave `contact.phone`, `emergencyPhone`, `whatsapp`, `address.line1`, `address.city` or `mapEmbedSrc` as `""` and everything that depends on it steps aside — the phone in the nav, the Emergency button in the dock, WhatsApp links, the map, the address blocks, the matching JSON-LD fields — and the footer, menu and contact page fill the space with email, hours and booking instead. Fill a field in and it all returns with no other edits. Two pieces of copy were made number-free at the same time and are worth revisiting then: the first two answers in `content/faqs.ts`, and the "Where exactly are you?" question, which is commented out at the bottom of that file.

### 2. `styles/tokens.css` — 10 minutes

Change the brand colours at the top of `:root`. Everything else — surfaces, hairlines, muted text, the four section themes (`paper`, `ink`, `mint`, `sand`) — derives from them.

```css
--paper: #f4f6f3;   /* base background, never pure white */
--ink:   #0b1f1c;   /* text and dark sections: a green-black */
--mint:  #d5f3e8;   /* the calm section, chips */
--sand:  #efeadf;   /* the warm section */
--teal:  #0c6b58;   /* the accent that is allowed to be TEXT */
--coral: #ff6a3d;   /* the accent that is only ever a FILL */
```

> **Read this before changing the accents.** There are two on purpose. `--coral` is loud and fails as text on a light surface (2.6:1), so it is only used as a fill with ink text on top (6.0:1): the primary button, dots, the progress line. `--teal` is the one that may be a *word*. If you pick new accents, check both directions — text needs 4.5:1 against paper, mint and sand; anything with ink text on it needs it the other way.

### 3. `app/fonts.ts` — 5 minutes

Four families: display (Bricolage Grotesque), accent (Fraunces italic, used for the one emphasised phrase in each headline), body (Inter Tight), mono (JetBrains Mono, small labels). Swap the imports; the CSS variable names stay the same, so nothing else changes.

### 4. `content/*.ts` — 20 minutes

Treatments, doctors, cases, testimonials, pricing, FAQs, quiz, journey, technology, comfort menu, and every section's headline in `sections.ts`. **No component contains a sentence of client copy**, so this is the only place to edit.

### 5. Photography — 10 minutes

`scripts/image-manifest.mjs` is the single list of every image slot, each with exact pixel dimensions, a focal point and a note on what the photograph should show. Hand it to the photographer; drop the files into `public/images/` under the same names.

**The photographs in the repo are demo images**: free-licence Unsplash photos, downloaded and cropped into those slots by `npm run photos`. They are there so the template reads as a dental clinic out of the box. The before/after "before" frames are colour-graded copies of the "after" frames — fine for a demo, **not acceptable for a real clinic**: replace every one of them, and above all the cases, with the clinic's own consented photography before launch.

After replacing an image under the same file name, delete `.next/cache/images` (or run `npm run photos`, which does it) — Next caches optimised images by URL and will keep serving the old one.

Two testimonial cards can play a short muted clip on hover. The clips cannot be generated, so the demo ships without them; add the files described in `public/video/README.txt` and uncomment the two `preview` lines in `content/testimonials.ts`.

---

## Where things live

```
content/            all copy and data
  site.config.ts    brand, contact, hours, currency, SEO, finance, switches
  sections.ts       every section headline, label and caption
  treatments.ts     6 treatments incl. detail-page content and FAQs
  doctors.ts  cases.ts  testimonials.ts  pricing.ts  faqs.ts
  quiz.ts  journey.ts  technology.ts  comfort.ts
  types.ts          the content contracts

styles/tokens.css   colour, type scale, space, radii, motion, section themes
app/fonts.ts        the four font families

lib/gsap.ts         core GSAP registration + the one Lenis instance
lib/motion.ts       the single answer to "should this animate?"
lib/hooks.ts        media queries, focus trap, scroll lock
lib/utils.ts        viewport observers, idle callback, small helpers
lib/format.ts       currency, EMI, tel/WhatsApp/maps hrefs
lib/quiz.ts  lib/booking.ts  lib/contact.ts

components/motion/  SplitReveal, Reveal, ScrubText, Magnetic, TextRoll,
                    Marquee, ParallaxImage, PinnedHorizontal, DrawPath,
                    CountUp, CursorFollower, ThemeSection, SmoothScroll
components/shell/   preloader, nav, menu overlay, dock, footer,
                    page transitions, scroll progress
components/sections/  one file per chapter, plus the inner-page blocks
components/hero/    the 3D molar: distance field, worker, scene, gating
components/booking/ booking modal and calendar
components/ui/      Button, Accordion, Modal, ChapterLabel, ToothMark, OpenStatus
components/seo/     Dentist + FAQPage JSON-LD, generated from content
scripts/            photo pipeline, 3D bakes, and the audit harness
```

---

## Wiring it up for a real clinic

Two functions, both deliberately kept out of the components:

- **`lib/booking.ts` → `submitBooking()`** — set `site.booking.endpoint` to a URL and it POSTs the draft as JSON. Leave it `null` and it resolves successfully after a beat, which is what the demo does.
- **`lib/contact.ts` → `submitEnquiry()`** — same pattern.

Availability is configuration, not code: `leadTimeDays`, `horizonDays`, `closedWeekdays` and `slots` in `site.config` decide what the calendar offers. Any link to `/#book-now` opens the booking flow directly — useful for campaigns and QR codes.

---

## The 3D molar

The hero object is not a downloaded model. `components/hero/molarGeometry.ts` describes a molar as a signed-distance field (crown, four cusps, fissures, two roots) and meshes it with marching cubes — in a Web Worker, so it never blocks the page.

Its lighting is **baked**. `/kit/matcap` renders a porcelain sphere in a small studio of light cards; `npm run matcap` photographs it into `public/images/tooth-matcap.webp`, and the live molar looks that texture up by surface direction. `npm run tooth` then captures the still (`hero-tooth.png`) shown before WebGL starts and wherever it never does. To change the glaze or the lights, edit `components/hero/StudioSphere.tsx` and run both.

Set `hero.object: "still"` to never load three.js at all, or `hero.phones: "still"` to keep the live object on desktop only.

---

## Performance

Measured with Lighthouse 12 against `next start` on a mid-range laptop, several runs each. **Treat these as relative, not absolute** — local runs swing by five points either way, and a CDN, real photography and real hardware will all move them.

| Shipped defaults (3D molar + preloader on desktop) | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Desktop | **86 – 93** | 100 | 100 | 100 |
| Mobile (simulated slow 4G, 4× CPU) | **55 – 62** | 100 | 100 | 100 |
| Mobile with `hero.phones: "still"` | **61 – 73** | 100 | 100 | 100 |

Desktop meets the 90 target on a quiet machine. **Mobile does not meet 85**, and it is worth being plain about why: the live 3D molar on phones costs roughly seven points (it is what the client asked to see there; `hero.phones: "still"` gives them back), and beyond that the simulated LCP sits around 4–5 s because the page is long, animation-heavy and hydrates ~230 kB of JavaScript. The levers that would move it are trimming sections or motion on the home page — product decisions, not bugs.

### What was done to get there

- **The 3D molar no longer blocks the main thread.** Profiling showed three stalls of 0.5–1.5 s each on Windows: linking the physical-material shader, three.js prefiltering the environment map, and meshing the tooth (twice — React discards a `useMemo` when a component suspends). The lighting is now a baked matcap with a small shader compiled off-thread (`compileAsync`), and the mesh is built in a Web Worker. With the 3D chunk blocked entirely the desktop score is 93 — the live object now costs almost nothing.
- **No refresh storms.** `ScrollTrigger.refresh()` used to run on every image load, re-measuring every pin mid-scroll each time a lazy photo arrived. Images sit in pre-sized boxes, so it now runs once, debounced, after fonts and load.
- **Lower sections hydrate one at a time.** Chapters 07–14 are each inside a `<Suspense>` boundary, which is also React's unit of hydration: eight short tasks instead of one long one.
- **Phone boot.** On a fresh phone load the sections below the hero are held out of layout (`content-visibility`) until the page is idle, so the first paint and each webfont swap lay out one screen rather than fourteen.
- On phones the first screen **settles in without a fade** — text that starts at zero opacity does not count as painted.
- GSAP plugins are registered by the components that use them; `SplitText` splits and scroll reveals are built only when their element nears the viewport (IntersectionObserver, which also works inside pinned and translated tracks where ScrollTrigger start positions do not).
- The static half of the page is server components; Framer Motion ships only inside the two lazy modal chunks; the accordion and quiz animate with CSS.
- The film grain carries no `mix-blend-mode` and drifts with a transform. Blending a fixed full-viewport layer re-composites the whole page on every paint.
- The 3D loads only after the page itself has, when the main thread is idle, and only for a box that is actually on screen (it is measured). Phones run it too now that it is cheap; data-saver, reduced motion and low-memory devices keep the still.

`scripts/profile.mjs`, `profile-tree.mjs` and `trace.mjs` are the tools that found the above: CPU time by function, the call tree for a time window, and main-thread long tasks with what is inside each.

---

## Accessibility

100 in Lighthouse on both desktop and mobile, with the interesting cases handled rather than suppressed:

- **Contrast** — two accents, one for fills and one for text (see tokens). Nothing readable uses `--faint`, and nothing is dimmed below AA while it waits to animate: the manifesto's unread words rest at 50% rather than vanishing, and the journey greys its photographs, never its text.
- **Target size** — a 24px floor on every button, 44px on primary controls.
- **The before/after slider** is a real `<input type="range">` stretched invisibly over the frame, so arrow keys work and the announcement is sane.
- **SplitText's `aria-label` is switched off**, because it is prohibited on `<p>` and `<span>`; split words are read in order instead, and the character-split booking headline carries an explicit name.
- Focus trapping, `Escape`, scroll locking and focus restoration on the menu and both modals.
- **Reduced motion** is decided once (`lib/motion.ts`, a `data-motion` attribute set before first paint) and every motion component reads it. With `motion.reducedMotion: "respect"` and the OS preference on: nothing pins, nothing auto-plays, the marquee and grain stop, the molar is drawn and held still.

---

## Security

```bash
npm audit --omit=dev   # 0 vulnerabilities
```

Production dependencies are clean. `npm audit` reports advisories only in the **dev-only** lint toolchain (`eslint-config-next → fast-glob → micromatch → braces`); it runs at lint time over our own file paths and none of it ships to a browser. `postcss` is pinned forward with an `overrides` block rather than forcing a major Next upgrade.

Headers are set in `next.config.ts` and verified in the response:

`Content-Security-Policy` · `X-Content-Type-Options` · `Referrer-Policy` · `X-Frame-Options` · `Permissions-Policy` · `Cross-Origin-Opener-Policy` · `Strict-Transport-Security`

The CSP blocks third-party scripts, objects, base-tag hijacking and off-site form posts, limits frames to the one map provider, and limits workers to this origin (the dev server additionally allows `blob:`, which is how Turbopack serves them). **It does carry `script-src 'unsafe-inline'`**, and that is a deliberate, documented trade: Next inlines its own bootstrap and flight data, and the only way to drop it is per-request nonces via middleware, which forces every page out of static rendering. If a deployment needs a strict policy, add middleware that generates a nonce, pass it to the inline script, and replace `'unsafe-inline'` with `'nonce-…'`.

Other notes: no secrets in the repo; every external link carries `rel="noreferrer noopener"`; JSON-LD is escaped; user input is never rendered as HTML; `tel:` / WhatsApp / Maps URLs are built with encoding helpers.

---

## Verifying it yourself

`scripts/` carries the harness used to audit this build against the real Chrome on your machine (the path to `chrome.exe` is at the top of each file):

```bash
node scripts/inspect.mjs   http://localhost:3000/   # console errors, failed requests, anything left invisible
node scripts/sections.mjs  http://localhost:3000/   # one screenshot per chapter, by anchor
node scripts/shot.mjs      http://localhost:3000/ out.png --scroll 8000
```

Add `--mobile` to any of them. Screenshots land in `.inspect/`.

These scripts deliberately emulate **`prefers-reduced-motion: reduce`** at a 1900×780 window — a Windows laptop with animation effects switched off, which is the machine this template was caught out on. With `motion.reducedMotion: "ignore"` everything must still animate there; with `"respect"` you are looking at the reduced fallback. Set `MOTION=no-preference` to emulate a machine with motion allowed.

## Browser and device support

- **Layout** is fluid from 320px up, capped at 1760px, and the hero is sized against viewport *height* as well as width so it fits a short laptop window. The breakpoints that matter: **768px** (the pinned treatment rail and sticky stack switch on), **1024px** (the preloader, the two-column hero, and the pinned journey — which also needs 700px of height, and otherwise simply scrubs).
- **Pinned horizontal scroll** becomes a native snap carousel below 768px.
- **The dock** sits in the bottom-right corner on desktop and becomes a full-width bar on phones. It appears after the hero and steps aside at the footer.
- **The custom cursor** is disabled on touch and under reduced motion, stays hidden until the pointer first moves, and steps aside over form fields so the text caret is never hidden.
- **Without JavaScript**: content, navigation and the footer all work; a `<noscript>` block unhides every reveal and removes the preloader. The menu overlay and the booking modal need JS — the footer carries the full navigation and both phone numbers.
- Modern evergreen browsers. Uses `color-mix()`, `clamp()`, `:has()`, `aspect-ratio`, `svh` units, `content-visibility` and CSS grid height animation.

---

## Design rules this template holds to

- Components read **semantic** tokens (`--bg`, `--fg`, `--accent`), never brand colours directly, so any section inverts its palette with `<ThemeSection theme="ink">`.
- **It has to look like a dental clinic.** Every chapter carries a photograph of a mouth, a chair, a scan or a dentist; type alone on an empty field is what made the first version read as a template.
- One serif italic phrase per headline, and only one.
- One reveal easing, one UI easing. Nothing bouncy.
- Every animation has a job: reveal hierarchy, guide the eye, or give feedback.
- No pure white, no pure black, no medical blue.
- The anxiety section moves more slowly than anything else on the page, on purpose.
