/** Fast single screenshot. node scripts/shot.mjs <url> <out.png> [--mobile] [--wait ms] [--scroll px] */
import puppeteer from "puppeteer-core";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const [, , url = "http://localhost:3000/", out = ".inspect/shot.png"] = process.argv;
const mobile = process.argv.includes("--mobile");
const wi = process.argv.indexOf("--wait");
const wait = wi > -1 ? Number(process.argv[wi + 1]) : 4500;
const si = process.argv.indexOf("--scroll");
const scrollTo = si > -1 ? Number(process.argv[si + 1]) : 0;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: mobile
    ? { width: 412, height: 915, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
    : { width: 1900, height: 780 },
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});
const page = await browser.newPage();
// Emulates a machine with Windows "Animation effects" switched OFF, which
// is how this site is actually being reviewed. With site.config motion set
// to "ignore" everything must still animate. MOTION=no-preference overrides.
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: process.env.MOTION ?? "reduce" }]);
const errs = [];
page.on("pageerror", (e) => errs.push(String(e.message).slice(0, 160)));
page.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text().slice(0, 160)); });
await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });
if (scrollTo) { await page.evaluate((y) => window.scrollTo(0, y), scrollTo); }
await new Promise((r) => setTimeout(r, wait));
await page.screenshot({ path: out });
if (errs.length) console.log("ERRORS:\n " + errs.join("\n "));
else console.log("clean");
await browser.close();
