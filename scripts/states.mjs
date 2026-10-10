/** Screenshots of the interactive states. node scripts/states.mjs [--mobile] */
import puppeteer from "puppeteer-core";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const base = process.env.BASE ?? "http://localhost:3000";
const mobile = process.argv.includes("--mobile");
const tag = mobile ? "m-" : "";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: mobile ? { width: 412, height: 915, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { width: 1900, height: 780 },
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});
const errs = [];
const open = async (path, wait = 3500) => {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: process.env.MOTION ?? "reduce" }]);
  page.on("pageerror", (e) => errs.push(path + " :: " + String(e.message).slice(0, 160)));
  page.on("console", (m) => { if (m.type() === "error") errs.push(path + " :: console: " + m.text().slice(0, 160)); });
  await page.goto(base + path, { waitUntil: "networkidle2", timeout: 90000 });
  await new Promise((r) => setTimeout(r, wait));
  return page;
};
const snap = (page, name) => page.screenshot({ path: `.inspect/state-${tag}${name}.png` });
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const clickText = (page, re, sel = "button, a") =>
  page.evaluate((src, sel) => {
    const rx = new RegExp(src, "i");
    const el = [...document.querySelectorAll(sel)].find((n) => rx.test(n.textContent ?? "") && n.getClientRects().length);
    el?.click();
    return Boolean(el);
  }, re, sel);

// Preloader, caught mid-curtain.
{
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: process.env.MOTION ?? "reduce" }]);
  await page.goto(base + "/", { waitUntil: "domcontentloaded" });
  await pause(700);
  await snap(page, "preloader");
  await page.close();
}
// Menu overlay.
{
  const page = await open("/");
  console.log("menu", await clickText(page, "^\s*menu"));
  await pause(1600);
  await snap(page, "menu");
  await page.close();
}
// Booking flow, step by step.
{
  const page = await open("/#book-now", 4500);
  await snap(page, "booking-1");
  const inDialog = (fn) => page.evaluate(fn);
  const next = () => inDialog(() => {
    const b = [...document.querySelectorAll('[role="dialog"] button')].find((n) => /continue|next|request|confirm/i.test(n.textContent ?? "") && !n.disabled);
    b?.click();
    return Boolean(b);
  });
  // Treatment: choosing one advances by itself.
  await inDialog(() => document.querySelector('[role="dialog"] [aria-pressed]')?.click());
  await pause(1100);
  await snap(page, "booking-2");
  // Day.
  await inDialog(() => document.querySelector('[role="dialog"] [role="grid"] button:not([disabled])')?.click());
  await pause(400);
  await next();
  await pause(1100);
  await snap(page, "booking-3");
  // Time.
  await inDialog(() => document.querySelector('[role="dialog"] [aria-pressed="false"]')?.click());
  await pause(400);
  await next();
  await pause(1100);
  await snap(page, "booking-4");
  await page.close();
}
// Doctor drawer.
{
  const page = await open("/");
  await page.evaluate(() => document.getElementById("doctors")?.scrollIntoView());
  await pause(1500);
  console.log("doctor", await page.evaluate(() => { const b = document.querySelector('#doctors button[aria-haspopup="dialog"]'); b?.click(); return Boolean(b); }));
  await pause(1800);
  await snap(page, "doctor-drawer");
  await page.close();
}
// Quiz, a step in.
{
  const page = await open("/");
  await page.evaluate(() => document.getElementById("quiz")?.scrollIntoView());
  await pause(1500);
  console.log("quiz begin", await clickText(page, "^\s*begin"));
  await pause(1200);
  await snap(page, "quiz-step");
  await page.close();
}
console.log(errs.length ? "ERRORS:\n " + errs.join("\n ") : "no runtime errors");
await browser.close();
