/**
 * CPU profile of a page load, aggregated by function.
 * node scripts/profile.mjs [url] [--gpu] [--headful]
 * Answers "what is actually blocking the main thread" rather than guessing
 * from Lighthouse's per-chunk totals.
 */
import puppeteer from "puppeteer-core";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const url = process.argv[2]?.startsWith("http") ? process.argv[2] : "http://localhost:3400/";
const gpu = process.argv.includes("--gpu");
const headful = process.argv.includes("--headful");

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: headful ? false : "new",
  defaultViewport: { width: 1900, height: 780 },
  args: ["--no-sandbox", ...(gpu ? [] : ["--disable-gpu"])],
});
const page = await browser.newPage();
await page.evaluateOnNewDocument(() => {
  window.__long = [];
  new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__long.push([Math.round(e.startTime), Math.round(e.duration)]))).observe({ type: "longtask", buffered: true });
});
const cdp = await page.createCDPSession();
await cdp.send("Profiler.enable");
await cdp.send("Profiler.setSamplingInterval", { interval: 500 });
await cdp.send("Profiler.start");
await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });
await new Promise((r) => setTimeout(r, 6000));
const { profile } = await cdp.send("Profiler.stop");

const dt = profile.timeDeltas;
const byId = new Map(profile.nodes.map((n) => [n.id, n]));
const self = new Map();
profile.samples.forEach((id, i) => self.set(id, (self.get(id) ?? 0) + (dt[i] ?? 0)));
const agg = new Map();
for (const [id, us] of self) {
  const n = byId.get(id);
  const f = n.callFrame;
  const key = `${f.functionName || "(anon)"} ${f.url.split("/").pop().slice(0, 28)}:${f.lineNumber}:${f.columnNumber}`;
  agg.set(key, (agg.get(key) ?? 0) + us);
}
const top = [...agg].sort((a, b) => b[1] - a[1]).slice(0, 28);
for (const [k, us] of top) console.log(String(Math.round(us / 1000)).padStart(6) + " ms  " + k);

// Call chain of the single hottest function, so a hot leaf can be traced
// back to whatever asked for it.
const parent = new Map();
for (const n of profile.nodes) for (const c of n.children ?? []) parent.set(c, n.id);
const hot = [...self].filter(([id]) => byId.get(id).callFrame.url).sort((a, b) => b[1] - a[1])[0];
if (hot) {
  const chain = [];
  for (let id = hot[0]; id !== undefined; id = parent.get(id)) {
    const f = byId.get(id).callFrame;
    chain.push((f.functionName || "(anon)") + "@" + f.url.split("/").pop().slice(0, 14) + ":" + f.lineNumber + ":" + f.columnNumber);
  }
  console.log("hottest chain:", chain.slice(0, 16).join(" < "));
}

const long = await page.evaluate(() => window.__long);
const renderer = await page.evaluate(() => {
  const c = document.createElement("canvas").getContext("webgl2");
  const e = c?.getExtension("WEBGL_debug_renderer_info");
  return e ? c.getParameter(e.UNMASKED_RENDERER_WEBGL) : "no webgl";
});
console.log("long tasks [start,dur]:", JSON.stringify(long), "total over 50:", long.reduce((s, [, d]) => s + Math.max(0, d - 50), 0));
console.log("renderer:", renderer);
await browser.close();
