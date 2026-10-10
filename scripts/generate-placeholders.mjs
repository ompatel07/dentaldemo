/**
 * Generates on-brand placeholder images for every slot in image-manifest.mjs.
 *
 *   npm run placeholders            regenerate anything missing
 *   npm run placeholders -- --force rebuild all of them
 *
 * They are deliberately plain: palette, a hairline frame, a measurement tick
 * and the slot's own label. A missing photograph should look like an empty
 * frame in the design, never like a broken page.
 */

import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { images, videos } from "./image-manifest.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const force = process.argv.includes("--force");

const TONES = {
  warm: { a: "#EFEAE1", b: "#DCD5C8", fg: "#14161A", rule: "#14161A", accent: "#B8945A" },
  dark: { a: "#1A1D22", b: "#0E1013", fg: "#F5F1EA", rule: "#F5F1EA", accent: "#D3B483" },
  sage: { a: "#E3E8E1", b: "#CFD8CB", fg: "#22291F", rule: "#22291F", accent: "#96753F" },
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function svgFor({ width, height, tone, label }) {
  const t = TONES[tone] ?? TONES.warm;
  const pad = Math.round(Math.min(width, height) * 0.055);
  const titleSize = Math.round(Math.min(width, height) * 0.038);
  const metaSize = Math.max(11, Math.round(Math.min(width, height) * 0.021));
  const ringR = Math.min(width, height) * 0.22;

  // Measurement ticks along the bottom rule - the atelier motif.
  const tickCount = 24;
  const tickGap = (width - pad * 2) / (tickCount - 1);
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const x = pad + i * tickGap;
    const long = i % 6 === 0;
    const h = long ? pad * 0.5 : pad * 0.25;
    return `<line x1="${x.toFixed(1)}" y1="${height - pad}" x2="${x.toFixed(1)}" y2="${(height - pad - h).toFixed(1)}" stroke="${t.rule}" stroke-opacity="${long ? 0.5 : 0.25}" stroke-width="1"/>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${t.a}"/>
      <stop offset="100%" stop-color="${t.b}"/>
    </linearGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#g)"/>
  <rect width="${width}" height="${height}" filter="url(#grain)" opacity="0.05"/>

  <circle cx="${width / 2}" cy="${height * 0.46}" r="${ringR}" fill="none" stroke="${t.accent}" stroke-opacity="0.4" stroke-width="1"/>
  <circle cx="${width / 2}" cy="${height * 0.46}" r="${ringR * 0.62}" fill="none" stroke="${t.rule}" stroke-opacity="0.12" stroke-width="1"/>

  <rect x="${pad}" y="${pad}" width="${width - pad * 2}" height="${height - pad * 2}" fill="none" stroke="${t.rule}" stroke-opacity="0.18" stroke-width="1"/>
  ${ticks}

  <text x="${pad}" y="${pad * 1.9}" font-family="monospace" font-size="${metaSize}" letter-spacing="${metaSize * 0.18}" fill="${t.fg}" fill-opacity="0.55">AURELLE / PLACEHOLDER</text>
  <text x="${width / 2}" y="${height * 0.47 + titleSize * 0.35}" text-anchor="middle" font-family="Georgia, serif" font-size="${titleSize}" fill="${t.fg}" fill-opacity="0.9">${esc(label)}</text>
  <text x="${pad}" y="${height - pad * 1.5}" font-family="monospace" font-size="${metaSize}" letter-spacing="${metaSize * 0.14}" fill="${t.fg}" fill-opacity="0.45">${width} x ${height}</text>
</svg>`;
}

const exists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

async function main() {
  let made = 0;
  let kept = 0;

  for (const slot of images) {
    const out = join(publicDir, slot.path);
    await mkdir(dirname(out), { recursive: true });

    if (!force && (await exists(out))) {
      kept++;
      continue;
    }

    const svg = Buffer.from(svgFor(slot));
    const buf = await sharp(svg, { density: 144 })
      .resize(slot.width, slot.height, { fit: "cover" })
      .jpeg({ quality: 82, progressive: true, mozjpeg: true })
      .toBuffer();

    await writeFile(out, buf);
    made++;
  }

  // Keep the video directory present so the slots are obvious in the repo.
  await mkdir(join(publicDir, "video"), { recursive: true });
  const readme = videos.map((v) => `- public/${v.path}\n  ${v.note}`).join("\n");
  await writeFile(
    join(publicDir, "video", "README.txt"),
    `Video slots required by content/testimonials.ts.\nPlaceholders cannot be generated - supply real clips.\n\n${readme}\n`,
  );

  console.log(`placeholders: ${made} written, ${kept} already present (use --force to rebuild)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
