/**
 * Phone interaction checks. node scripts/mobile-flows.mjs [baseUrl]
 * Menu and booking must lock the page while open, scroll inside themselves,
 * and give the page back afterwards - by touch, not by script.
 */
import puppeteer from "puppeteer-core";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const base = process.argv[2] ?? "http://localhost:3000";
const W = 390, H = 844;
const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"] });
const page = await browser.newPage();
await page.setUserAgent("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36");
await page.setViewport({ width: W, height: H, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
const errs = [];
page.on("pageerror", (e) => errs.push(String(e.message).slice(0, 160)));
page.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text().slice(0, 160)); });
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const swipe = async (distance, x = W / 2, from = H * 0.8) => {
  await page.touchscreen.touchStart(x, from);
  for (let k = 1; k <= 10; k++) await page.touchscreen.touchMove(x, from - (distance * k) / 10);
  await pause(150);
  await page.touchscreen.touchEnd();
  await pause(500);
};
const y = () => page.evaluate(() => Math.round(scrollY));
const tapText = (re, sel = "button, a") => page.evaluate((src, sel) => {
  const rx = new RegExp(src, "i");
  const el = [...document.querySelectorAll(sel)].find((n) => rx.test(n.textContent ?? "") && n.getClientRects().length);
  el?.click();
  return Boolean(el);
}, re, sel);
const check = (label, ok, detail = "") => console.log((ok ? "PASS " : "FAIL ") + label + (detail ? "  (" + detail + ")" : ""));

await page.goto(base + "/", { waitUntil: "networkidle2", timeout: 90000 });
await pause(3000);

await swipe(400);
const y1 = await y();
check("page scrolls by touch on load", y1 > 200, "scrollY " + y1);

// Hero 3D
await page.evaluate(() => window.scrollTo(0, 0));
await pause(7000);
const canvas = await page.evaluate(() => { const c = document.querySelector("#hero canvas"); if (!c) return null; const r = c.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left), y: Math.round(r.top) }; });
check("live 3D molar is running in the phone hero", Boolean(canvas && canvas.w > 60), JSON.stringify(canvas));
await page.screenshot({ path: ".inspect/m-flow-hero.png" });

// Menu
check("menu opens", await tapText("^\s*menu"));
await pause(1500);
await page.screenshot({ path: ".inspect/m-flow-menu.png" });
const before = await y();
await swipe(300);
check("page is locked behind the open menu", (await y()) === before, "scrollY " + (await y()));
check("menu closes", await tapText("^\s*close"));
await pause(1200);
await swipe(400);
const y2 = await y();
check("page scrolls again after the menu closes", y2 > before + 150, "scrollY " + y2);

// Booking
await page.evaluate(() => { window.scrollTo(0, 0); location.hash = "#book-now"; });
await pause(3500);
const dlg = await page.evaluate(() => Boolean(document.querySelector('[role="dialog"][aria-modal="true"]')));
check("booking opens from #book-now", dlg);
await page.screenshot({ path: ".inspect/m-flow-booking.png" });
const yb = await y();
const inner0 = await page.evaluate(() => { const els = [...document.querySelectorAll('[role="dialog"] *, [role="dialog"]')]; const sc = els.find((e) => e.scrollHeight > e.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(e).overflowY)); window.__sc = sc; return sc ? sc.scrollTop : null; });
await swipe(350);
const inner1 = await page.evaluate(() => (window.__sc ? window.__sc.scrollTop : null));
check("booking panel scrolls inside itself", inner0 !== null && inner1 > inner0, `scrollTop ${inner0} -> ${inner1}`);
check("page is locked behind booking", (await y()) === yb);
await page.keyboard.press("Escape");
await pause(1200);
await swipe(400);
check("page scrolls again after booking closes", (await y()) > yb + 150, "scrollY " + (await y()));

// Carousel: horizontal swipe on treatments moves cards, not the page sideways.
await page.evaluate(() => document.getElementById("treatments")?.scrollIntoView());
await pause(900);
const rail = await page.evaluate(() => { const el = [...document.querySelectorAll("#treatments *")].find((e) => e.scrollWidth > e.clientWidth + 40 && /auto|scroll/.test(getComputedStyle(e).overflowX)); window.__rail = el; if (!el) return null; const r = el.getBoundingClientRect(); return { top: r.top, h: r.height, left: el.scrollLeft }; });
if (rail) {
  const ry = Math.min(H - 120, rail.top + rail.h / 2);
  await page.touchscreen.touchStart(320, ry);
  for (let k = 1; k <= 10; k++) await page.touchscreen.touchMove(320 - k * 24, ry);
  await pause(150);
  await page.touchscreen.touchEnd();
  await pause(700);
}
const left = await page.evaluate(() => (window.__rail ? window.__rail.scrollLeft : null));
check("treatments carousel swipes sideways", rail !== null && left > 100, "scrollLeft " + left);
check("no sideways page scroll", (await page.evaluate(() => scrollX)) === 0);
await page.screenshot({ path: ".inspect/m-flow-rail.png" });

console.log(errs.length ? "ERRORS:\n " + errs.join("\n ") : "no runtime errors");
await browser.close();
