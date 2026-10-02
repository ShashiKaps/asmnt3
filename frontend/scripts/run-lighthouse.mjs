// Runs Lighthouse audits against the key app pages and writes HTML+JSON reports.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.BASE_URL || "http://localhost";
const OUT_DIR = path.join(__dirname, "..", "lighthouse-reports");

const PAGES = [
  { name: "home", path: "/" },
  { name: "wordle", path: "/Wordle" },
  { name: "wordsearch", path: "/WordSearch" },
  { name: "settings", path: "/Settings" },
  { name: "dashboard", path: "/Dashboard" },
];

const CHROME_PATH =
  process.env.CHROME_PATH ||
  "/home/ec2-user/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";

async function run() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const chrome = await chromeLauncher.launch({
    chromePath: CHROME_PATH,
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
  });

  const options = {
    logLevel: "error",
    output: ["html", "json"],
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    port: chrome.port,
  };

  const summary = [];

  for (const page of PAGES) {
    const url = `${BASE_URL}${page.path}`;
    console.log(`Auditing ${url} ...`);
    const result = await lighthouse(url, options);
    const { html, json } = { html: result.report[0], json: result.report[1] };

    fs.writeFileSync(path.join(OUT_DIR, `${page.name}.html`), html);
    fs.writeFileSync(path.join(OUT_DIR, `${page.name}.json`), json);

    const lhr = result.lhr;
    const scores = Object.fromEntries(
      Object.entries(lhr.categories).map(([key, cat]) => [
        key,
        Math.round(cat.score * 100),
      ])
    );
    summary.push({ page: page.name, url, scores });
  }

  await chrome.kill();

  fs.writeFileSync(
    path.join(OUT_DIR, "summary.json"),
    JSON.stringify(summary, null, 2)
  );

  console.log("\n=== Lighthouse Summary ===");
  console.table(
    summary.map((s) => ({ page: s.page, ...s.scores }))
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
