/**
 * Renders the hero molar to a transparent PNG: public/images/hero-tooth.png
 *
 *   npm run dev   (in another terminal)
 *   node scripts/render-tooth.mjs
 *
 * The still is what the hero shows before WebGL starts, and what it keeps
 * showing on machines that never start it. Capturing it from the live scene
 * means the two can never drift apart - change the model or the lighting,
 * re-run this, done.
 */
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const url = process.argv[2] ?? "http://localhost:3000/";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: { width: 1900, height: 900, deviceScaleFactor: 2 },
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });
await page.waitForSelector("canvas", { timeout: 40000 });

// Strip everything but the canvas, so the capture keeps its alpha.
await page.addStyleTag({
  content: `*{background:transparent!important;box-shadow:none!important}
            img,.grain,[class*="blur-2xl"]{visibility:hidden!important}
            body *:not(canvas){color:transparent!important;border-color:transparent!important}`,
});
await new Promise((r) => setTimeout(r, 6000));

const canvas = await page.$("canvas");
const shot = await canvas.screenshot({ omitBackground: true, type: "png" });
await sharp(shot).resize(720, 720, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9 }).toFile("public/images/hero-tooth.png");
console.log("hero-tooth.png written");
await browser.close();
