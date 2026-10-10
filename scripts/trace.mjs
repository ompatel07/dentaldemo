/**
 * Main-thread long tasks of a page load, with what is inside each one.
 * node scripts/trace.mjs [url] [--no-gpu]
 * Same lens Lighthouse uses for Total Blocking Time, but it names names.
 */
import puppeteer from "puppeteer-core";
import fs from "node:fs";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const url = process.argv[2]?.startsWith("http") ? process.argv[2] : "http://localhost:3400/";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: process.argv.includes("--mobile") ? { width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true } : { width: 1350, height: 940 },
  args: ["--no-sandbox", ...(process.argv.includes("--no-gpu") ? ["--disable-gpu"] : [])],
});
const page = await browser.newPage();
// --cpu 4 slows the main thread the way Lighthouse's mobile preset does.
const ci = process.argv.indexOf("--cpu");
if (ci > -1) await (await page.createCDPSession()).send("Emulation.setCPUThrottlingRate", { rate: Number(process.argv[ci + 1]) });
// --css "<rules>" tries a stylesheet change without a rebuild.
const si = process.argv.indexOf("--css");
if (si > -1) {
  await page.evaluateOnNewDocument((css) => {
    const add = () => { const st = document.createElement("style"); st.textContent = css; (document.head ?? document.documentElement).appendChild(st); };
    if (document.documentElement) add(); else new MutationObserver((_, o) => { if (document.documentElement) { o.disconnect(); add(); } }).observe(document, { childList: true });
  }, process.argv[si + 1]);
}
const file = ".inspect/trace.json";
await page.tracing.start({ path: file, categories: ["devtools.timeline", "v8.execute", "blink.user_timing", "gpu", "disabled-by-default-devtools.timeline"] });
await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });
await new Promise((r) => setTimeout(r, 6000));
await page.tracing.stop();
await browser.close();

const { traceEvents: ev } = JSON.parse(fs.readFileSync(file, "utf8"));
// The renderer main thread is the one that ran the most RunTask time.
const perThread = new Map();
for (const e of ev) if (e.name === "RunTask" && e.ph === "X") perThread.set(e.pid + ":" + e.tid, (perThread.get(e.pid + ":" + e.tid) ?? 0) + e.dur);
const nav = ev.find((e) => e.name === "navigationStart" && e.args?.data?.documentLoaderURL?.startsWith("http"));
const main = [...perThread].filter(([k]) => k.startsWith(nav.pid + ":")).sort((a, b) => b[1] - a[1])[0][0];
const [pid, tid] = main.split(":").map(Number);
const t0 = nav.ts;
const mine = ev.filter((e) => e.pid === pid && e.tid === tid && e.ph === "X");
const tasks = mine.filter((e) => e.name === "RunTask" && e.dur > 50000).sort((a, b) => a.ts - b.ts);
let tbt = 0;
for (const t of tasks) {
  tbt += t.dur / 1000 - 50;
  const inside = mine.filter((e) => e !== t && e.ts >= t.ts && e.ts + e.dur <= t.ts + t.dur && e.dur > 15000);
  const lines = inside
    .sort((a, b) => b.dur - a.dur)
    .slice(0, 9)
    .map((e) => {
      const d = e.args?.data ?? {};
      const where = (d.url || d.scriptName || "").split("/").pop()?.slice(0, 22) ?? "";
      return `      ${String(Math.round(e.dur / 1000)).padStart(5)} ms ${e.name} ${d.functionName ?? ""} ${where}${d.lineNumber ? ":" + d.lineNumber + ":" + d.columnNumber : ""}`;
    });
  console.log(`task @${Math.round((t.ts - t0) / 1000)}ms  ${Math.round(t.dur / 1000)}ms`);
  console.log(lines.join("\n"));
}
console.log("blocking total:", Math.round(tbt), "ms");
