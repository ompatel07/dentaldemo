/**
 * Builds the social share card: public/images/og-default.jpg
 *
 *   npm run dev   (in another terminal)
 *   npm run og
 *
 * It is a photograph of the real hero at 1200x630, so the card a link
 * unfurls into always matches the site behind it - rebrand, re-run.
 */
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const url = process.argv[2] ?? "http://localhost:3000/";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: { width: 1200, height: 630, deviceScaleFactor: 2 },
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });
// The dev indicator and the custom cursor have no place on a share card.
await page.addStyleTag({ content: "nextjs-portal,[data-cursor-root]{display:none!important}" });
await new Promise((r) => setTimeout(r, 9000));
const shot = await page.screenshot({ type: "png" });
await browser.close();

await sharp(shot).resize(1200, 630).jpeg({ quality: 86, mozjpeg: true }).toFile("public/images/og-default.jpg");
console.log("og-default.jpg written");
