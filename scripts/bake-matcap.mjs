/**
 * Bakes the hero molar's lighting: public/images/tooth-matcap.webp
 *
 *   npm run dev   (in another terminal)
 *   node scripts/bake-matcap.mjs
 *   node scripts/render-tooth.mjs     (the still should match the new light)
 *
 * Photographs the studio sphere at /kit/matcap and turns it into a matcap.
 * Edit the lighting or the glaze in components/hero/StudioSphere.tsx, run
 * this, and the hero follows.
 */
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const url = process.argv[2] ?? "http://localhost:3000/kit/matcap";
const SIZE = 512;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: { width: 1280, height: 900, deviceScaleFactor: 2 },
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
await page.waitForSelector("canvas", { timeout: 40000 });
// Nothing but the canvas - no nav, grain or cursor across the capture.
await page.addStyleTag({ content: "body *{visibility:hidden!important} canvas{visibility:visible!important}" });
await new Promise((r) => setTimeout(r, 7000));

const canvas = await page.$("canvas");
const shot = await canvas.screenshot({ type: "png" });
await browser.close();

const { data, info } = await sharp(shot).resize(SIZE, SIZE, { fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });

// Outside the sphere the capture is background, and a lookup that lands on
// the rim would blend with it. Pull every pixel past the silhouette back
// onto it along its own radius, so the rim colour simply continues outward.
const c = (SIZE - 1) / 2;
const rim = SIZE * 0.482;
const out = Buffer.from(data);
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const dx = x - c, dy = y - c;
    const r = Math.hypot(dx, dy);
    if (r <= rim) continue;
    const sx = Math.round(c + (dx / r) * rim), sy = Math.round(c + (dy / r) * rim);
    const from = (sy * SIZE + sx) * info.channels, to = (y * SIZE + x) * info.channels;
    out[to] = data[from];
    out[to + 1] = data[from + 1];
    out[to + 2] = data[from + 2];
  }
}

await sharp(out, { raw: { width: SIZE, height: SIZE, channels: info.channels } }).webp({ quality: 94 }).toFile("public/images/tooth-matcap.webp");
await sharp(out, { raw: { width: SIZE, height: SIZE, channels: info.channels } }).png().toFile(".inspect/matcap.png");
console.log("tooth-matcap.webp written");
