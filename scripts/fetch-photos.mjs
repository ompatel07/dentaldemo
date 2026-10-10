/**
 * Fills every slot in image-manifest.mjs with its demo photograph.
 *
 *   npm run photos              download + crop anything missing
 *   npm run photos -- --force   rebuild everything
 *
 * Each photo is fetched from Unsplash at a sensible width, cropped to the
 * slot's exact dimensions and written as a progressive JPEG. Slots with
 * `derive` are built from another slot - the demo "before" frames are a
 * graded copy of their "after", so the comparison slider lines up exactly.
 *
 * These are free-licence stock images for the demo only. A real clinic
 * supplies its own photography under the same file names.
 */

import { access, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { images } from "./image-manifest.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const force = process.argv.includes("--force");

const exists = (p) => access(p).then(() => true, () => false);

const cache = new Map();
async function download(id, width) {
  const key = `${id}@${width}`;
  if (!cache.has(key)) {
    cache.set(
      key,
      (async () => {
        const url = `https://images.unsplash.com/photo-${id}?w=${width}&q=82&auto=format&fit=max&fm=jpg`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${res.status} for ${id}`);
        return Buffer.from(await res.arrayBuffer());
      })(),
    );
  }
  return cache.get(key);
}

const position = (p) => (p === "attention" ? sharp.strategy.attention : p === "entropy" ? sharp.strategy.entropy : p ?? "centre");

/** A believable "before": flatter, warmer, slightly duller. Demo only. */
function beforeLook(input) {
  // recomb pulls a little blue out, which reads as stain rather than as a
  // sepia filter - tint() recolours the whole frame and looked like 1890.
  return sharp(input)
    .modulate({ brightness: 0.95, saturation: 0.86 })
    .recomb([
      [1.0, 0.03, 0.0],
      [0.0, 0.97, 0.0],
      [0.0, 0.04, 0.8],
    ])
    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
    .toBuffer();
}

let made = 0;
let kept = 0;
const failed = [];

// Sources first, derived slots second.
const ordered = [...images.filter((i) => i.photo), ...images.filter((i) => i.derive)];

for (const slot of ordered) {
  const out = join(publicDir, slot.path);
  await mkdir(dirname(out), { recursive: true });
  if (!force && (await exists(out))) {
    kept++;
    continue;
  }

  try {
    let buf;
    if (slot.photo) {
      const src = await download(slot.photo, Math.min(2400, Math.max(slot.width, slot.height) * 1.6));
      buf = await sharp(src)
        .resize(slot.width, slot.height, { fit: "cover", position: position(slot.position) })
        .jpeg({ quality: 80, progressive: true, mozjpeg: true })
        .toBuffer();
    } else if (slot.derive) {
      const from = join(publicDir, slot.derive.from);
      buf = await beforeLook(from);
    }
    await writeFile(out, buf);
    made++;
  } catch (err) {
    failed.push(`${slot.path}: ${err.message}`);
  }
}

// next/image caches optimised variants by URL. Replace a photo under the
// same file name and the old one keeps being served until this is cleared -
// which is exactly how a rebrand ends up "not working".
if (made > 0) await rm(join(root, ".next", "cache", "images"), { recursive: true, force: true });

console.log(`photos: ${made} written, ${kept} already present${failed.length ? `, ${failed.length} FAILED` : ""}`);
failed.forEach((f) => console.log("  !", f));
