/**
 * Inclusive CPU time by call-tree node for one window of a page load.
 * node scripts/profile-tree.mjs [url] [fromMs] [toMs]
 */
import puppeteer from "puppeteer-core";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const url = process.argv[2]?.startsWith("http") ? process.argv[2] : "http://localhost:3400/";
const from = Number(process.argv[3] ?? 2000), to = Number(process.argv[4] ?? 6000);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", defaultViewport: { width: 1350, height: 940 }, args: ["--no-sandbox"] });
const page = await browser.newPage();
const cdp = await page.createCDPSession();
await cdp.send("Profiler.enable");
await cdp.send("Profiler.setSamplingInterval", { interval: 300 });
await cdp.send("Profiler.start");
await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });
await new Promise((r) => setTimeout(r, 6000));
const { profile } = await cdp.send("Profiler.stop");
await browser.close();

const byId = new Map(profile.nodes.map((n) => [n.id, n]));
const parent = new Map();
for (const n of profile.nodes) for (const c of n.children ?? []) parent.set(c, n.id);
const incl = new Map();
let t = 0;
profile.samples.forEach((id, i) => {
  t += profile.timeDeltas[i] ?? 0;
  const ms = t / 1000;
  if (ms < from || ms > to) return;
  const name = byId.get(id).callFrame.functionName;
  if (name === "(idle)") return;
  for (let n = id; n !== undefined; n = parent.get(n)) incl.set(n, (incl.get(n) ?? 0) + (profile.timeDeltas[i] ?? 0));
});
const depth = (id) => { let d = 0; for (let n = parent.get(id); n !== undefined; n = parent.get(n)) d++; return d; };
const rows = [...incl].filter(([, us]) => us > 25000).map(([id, us]) => ({ id, us, d: depth(id) }));
// Print as a tree, heaviest first at each level.
const kids = (id) => rows.filter((r) => parent.get(r.id) === id).sort((a, b) => b.us - a.us);
const print = (r) => {
  const f = byId.get(r.id).callFrame;
  if (kids(r.id).length !== 1 || r.d < 3) console.log(" ".repeat(Math.min(r.d, 40)) + Math.round(r.us / 1000) + "ms " + (f.functionName || "(anon)") + " " + f.url.split("/").pop().slice(0, 16) + ":" + f.lineNumber + ":" + f.columnNumber);
  kids(r.id).forEach(print);
};
rows.filter((r) => r.d === 0).forEach(print);
