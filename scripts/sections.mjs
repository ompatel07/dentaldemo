/** Screenshot each chapter by anchor. node scripts/sections.mjs [url] [--mobile] */
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const url = process.argv[2]?.startsWith("http") ? process.argv[2] : "http://localhost:3000/";
const mobile = process.argv.includes("--mobile");
const dir = join(process.cwd(), ".inspect", mobile ? "sec-mobile" : "sec");

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: mobile
    ? { width: 412, height: 915, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
    : { width: 1900, height: 780 },
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: process.env.MOTION ?? "reduce" }]);

const errs = [];
page.on("pageerror", (e) => errs.push(String(e.message).slice(0, 180)));
page.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text().slice(0, 180)); });

await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });
await new Promise((r) => setTimeout(r, 4000));

await rm(dir, { recursive: true, force: true });
await mkdir(dir, { recursive: true });

const ids = [
  "hero", "treatments", "transformations", "journey", "technology",
  "comfort", "doctors", "pricing", "quiz", "testimonials", "faq", "book", "site-footer",
];

for (const id of ids) {
  const y = await page.evaluate((i) => {
    const el = document.getElementById(i);
    if (!el) return null;
    return el.getBoundingClientRect().top + window.scrollY;
  }, id);
  if (y === null) { console.log(`  MISSING #${id}`); continue; }

  // Step toward the target so pinned sections resolve, then settle.
  await page.evaluate((target) => window.scrollTo(0, Math.max(0, target - 40)), y);
  await new Promise((r) => setTimeout(r, 1800));
  await page.screenshot({ path: join(dir, `${id}.png`) });
  console.log(`  ${id.padEnd(16)} y=${Math.round(y)}`);
}

if (errs.length) console.log("\nERRORS:\n " + [...new Set(errs)].join("\n "));
else console.log("\nno runtime errors");
await browser.close();
