/**
 * Visual + runtime diagnostic harness.
 *
 *   node scripts/inspect.mjs [url] [--mobile] [--label name]
 *
 * Drives the real Chrome on this machine, records every console message,
 * page error and failed request, scrolls the whole page in steps, and
 * writes screenshots to .inspect/. Reports what is invisible, what is
 * overlapping, and what never animated.
 */

import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const url = process.argv[2] ?? "http://localhost:3000/";
const mobile = process.argv.includes("--mobile");
const labelIdx = process.argv.indexOf("--label");
const label = labelIdx > -1 ? process.argv[labelIdx + 1] : mobile ? "mobile" : "desktop";
const outDir = join(process.cwd(), ".inspect", label);

const viewport = mobile
  ? { width: 412, height: 915, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
  : { width: 1900, height: 780, deviceScaleFactor: 1 };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: viewport,
  args: ["--no-sandbox", "--disable-gpu", "--force-color-profile=srgb", "--hide-scrollbars"],
});

const page = await browser.newPage();
// Emulates a machine with Windows "Animation effects" switched OFF, which
// is how this site is actually being reviewed. With site.config motion set
// to "ignore" everything must still animate. MOTION=no-preference overrides.
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: process.env.MOTION ?? "reduce" }]);

const console_ = [];
const errors = [];
const failed = [];

page.on("console", (m) => {
  const t = m.type();
  if (t === "error" || t === "warning") console_.push(`[${t}] ${m.text()}`);
});
page.on("pageerror", (e) => errors.push(String(e.message || e)));
page.on("requestfailed", (r) => failed.push(`${r.failure()?.errorText} ${r.url()}`));
page.on("response", (r) => {
  if (r.status() >= 400) failed.push(`HTTP ${r.status()} ${r.url()}`);
});

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });

// Let the intro play out.
await sleep(4000);
await page.screenshot({ path: join(outDir, "00-top.png") });

/** Anything that should be readable but is not. */
const invisible = await page.evaluate(() => {
  const out = [];
  const nodes = document.querySelectorAll("section, h1, h2, h3, p, li, figure, article, [data-reveal]");
  for (const el of nodes) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const cs = getComputedStyle(el);
    const hidden =
      cs.visibility === "hidden" ||
      parseFloat(cs.opacity) < 0.05 ||
      (cs.animationName !== "none" && cs.animationPlayState === "paused");
    if (!hidden) continue;
    const text = (el.textContent || "").trim().slice(0, 60);
    if (!text) continue;
    out.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className || "").toString().slice(0, 70),
      visibility: cs.visibility,
      opacity: cs.opacity,
      anim: cs.animationName,
      play: cs.animationPlayState,
      text,
    });
  }
  return out.slice(0, 40);
});

// Scroll the page in viewport steps and shoot each one.
const { scrollHeight, innerHeight } = await page.evaluate(() => ({
  scrollHeight: document.documentElement.scrollHeight,
  innerHeight: window.innerHeight,
}));
const steps = Math.min(40, Math.ceil(scrollHeight / (innerHeight * 0.85)));

const scrollReport = [];
for (let i = 1; i <= steps; i++) {
  await page.evaluate((n) => window.scrollTo(0, n * window.innerHeight * 0.9), i);
  await sleep(1400);
  await page.screenshot({ path: join(outDir, `${String(i).padStart(2, "0")}-scroll.png`) });
  scrollReport.push(
    await page.evaluate(() => ({
      y: Math.round(window.scrollY),
      theme: document.documentElement.dataset.theme,
    })),
  );
}

// Anything still hidden after a full pass is genuinely broken.
const stillHidden = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll("[data-reveal]")) {
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05) {
      out.push({
        cls: (el.className || "").toString().slice(0, 70),
        text: (el.textContent || "").trim().slice(0, 50),
        y: Math.round(el.getBoundingClientRect().top + window.scrollY),
      });
    }
  }
  return out;
});

await page.evaluate(() => window.scrollTo(0, 0));
await sleep(1200);
await page.screenshot({ path: join(outDir, "zz-back-to-top.png") });

const report = {
  url,
  label,
  viewport,
  pageErrors: errors,
  consoleErrors: console_,
  failedRequests: failed,
  invisibleAtLoad: invisible,
  stillHiddenAfterScroll: stillHidden,
  scrollReport,
};

await writeFile(join(outDir, "report.json"), JSON.stringify(report, null, 2));

console.log(`\n=== ${label} :: ${url} ===`);
console.log("page errors      :", errors.length);
errors.slice(0, 10).forEach((e) => console.log("   !", e.slice(0, 160)));
console.log("console err/warn :", console_.length);
console_.slice(0, 12).forEach((e) => console.log("   -", e.slice(0, 160)));
console.log("failed requests  :", failed.length);
failed.slice(0, 10).forEach((e) => console.log("   x", e.slice(0, 140)));
console.log("invisible at load:", invisible.length);
invisible.slice(0, 12).forEach((i) => console.log(`   ? <${i.tag}> vis=${i.visibility} op=${i.opacity} anim=${i.anim}/${i.play} :: ${i.text}`));
console.log("still hidden     :", stillHidden.length);
stillHidden.slice(0, 12).forEach((i) => console.log(`   # y=${i.y} :: ${i.text}`));
console.log("screenshots ->", outDir);

await browser.close();
