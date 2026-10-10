/**
 * The phone test. node scripts/mobile.mjs [url] [--w 390] [--h 844]
 *
 * Scrolls the page the way a thumb does - synthesised touch gestures, not
 * window.scrollTo - because a page can be perfectly scrollable from script
 * and completely stuck under a finger (overflow:hidden on <html> does
 * exactly that). Also reports sideways overflow and text under 12px, and
 * leaves a screenshot walk-through in .inspect/walk-<width>/.
 */
import { mkdir, rm } from "node:fs/promises";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const arg = (name, fallback) => { const i = process.argv.indexOf(name); return i > -1 ? Number(process.argv[i + 1]) : fallback; };
const url = process.argv[2]?.startsWith("http") ? process.argv[2] : "http://localhost:3000/";
const W = arg("--w", 390), H = arg("--h", 844);
const dir = `.inspect/walk-${W}`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"] });
const page = await browser.newPage();
await page.setUserAgent("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36");
await page.setViewport({ width: W, height: H, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
// A real phone: motion allowed unless told otherwise.
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: process.env.MOTION ?? "no-preference" }]);
const errs = [];
page.on("pageerror", (e) => errs.push(String(e.message).slice(0, 160)));
page.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text().slice(0, 160)); });
await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });
await new Promise((r) => setTimeout(r, 3000));
await rm(dir, { recursive: true, force: true });
await mkdir(dir, { recursive: true });

// A finger: touch down low on the screen, drag up in small moves, lift.
const swipe = async (distance) => {
  const x = Math.round(W / 2), from = Math.round(H * 0.86);
  await page.touchscreen.touchStart(x, from);
  for (let k = 1; k <= 12; k++) await page.touchscreen.touchMove(x, from - (distance * k) / 12);
  // Rest before lifting, so the page stops where the finger did (no fling)
  // and consecutive screenshots overlap instead of skipping content.
  await new Promise((r) => setTimeout(r, 160));
  await page.touchscreen.touchMove(x, from - distance);
  await new Promise((r) => setTimeout(r, 80));
  await page.touchscreen.touchEnd();
};
const y = () => page.evaluate(() => Math.round(window.scrollY));

const state = await page.evaluate(() => ({
  htmlOverflow: getComputedStyle(document.documentElement).overflowY,
  bodyOverflow: getComputedStyle(document.body).overflowY,
  cls: document.documentElement.className.replace(/__variable_\w+|__className_\w+/g, "").trim(),
  height: document.documentElement.scrollHeight,
}));
console.log(`=== ${W}x${H} ${url}`);
console.log("html overflow-y:", state.htmlOverflow, "| body:", state.bodyOverflow, "| classes:", state.cls, "| page height:", state.height);

const shots = [];
let last = -1, stuck = 0, i = 0;
shots.push(await page.screenshot());
const step = Math.round(H * 0.72);
while (i < 70) {
  await swipe(step);
  await new Promise((r) => setTimeout(r, 650));
  const now = await y();
  if (i === 0) console.log("after first swipe scrollY =", now, now > 100 ? "(touch scrolling works)" : "(STUCK)");
  if (now === last) { if (++stuck >= 2) break; } else stuck = 0;
  last = now;
  shots.push(await page.screenshot());
  i++;
}
console.log("reached scrollY", last, "of", (await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)), "in", i, "swipes");

// Contact sheets, four screens across.
for (let s = 0; s < shots.length; s += 4) {
  const tiles = await Promise.all(shots.slice(s, s + 4).map((b) => sharp(b).resize({ width: W }).toBuffer()));
  await sharp({ create: { width: W * 4 + 30, height: H, channels: 3, background: "#888" } })
    .composite(tiles.map((input, k) => ({ input, left: k * (W + 10), top: 0 })))
    .png()
    .toFile(`${dir}/sheet-${String(s / 4 + 1).padStart(2, "0")}.png`);
}
console.log("sheets:", Math.ceil(shots.length / 4), "->", dir);

const audit = await page.evaluate(() => {
  const vw = window.innerWidth;
  const clipped = (el) => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o !== "visible") return true; } return false; };
  const name = (el) => (el.id ? "#" + el.id : el.tagName.toLowerCase()) + "." + String(el.className?.baseVal ?? el.className ?? "").split(/\s+/).slice(0, 3).join(".");
  const wide = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const cs = getComputedStyle(el);
    if (cs.position === "fixed" || cs.visibility === "hidden") continue;
    if ((r.right > vw + 1 || r.left < -1) && !clipped(el)) wide.push(name(el) + ` [${Math.round(r.left)}..${Math.round(r.right)}]`);
  }
  const small = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n.textContent.trim();
    if (t.length < 2) continue;
    const el = n.parentElement;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || el.closest(".sr-only,[aria-hidden='true'],noscript,script,style")) continue;
    if (!el.getClientRects().length) continue;
    const px = parseFloat(cs.fontSize);
    if (px < 12) { const k = px + "px " + name(el); if (!small.has(k)) small.set(k, t.slice(0, 40)); }
  }
  return { scrollWidth: document.documentElement.scrollWidth, vw, wide: [...new Set(wide)].slice(0, 25), small: [...small].slice(0, 30) };
});
console.log("document width", audit.scrollWidth, "viewport", audit.vw, audit.scrollWidth > audit.vw ? "<-- SIDEWAYS SCROLL" : "ok");
console.log("elements past the edge:", audit.wide.length ? "\n  " + audit.wide.join("\n  ") : "none");
console.log("text under 12px:", audit.small.length ? "\n  " + audit.small.map(([k, t]) => k + " :: " + t).join("\n  ") : "none");
console.log(errs.length ? "ERRORS:\n " + errs.join("\n ") : "no runtime errors");
await browser.close();
