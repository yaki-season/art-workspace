import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const workspace = path.resolve(root, "../../../../../../..");
const requireFromApp = createRequire(path.join(workspace, "app", "package.json"));
const { chromium } = requireFromApp("playwright");
const pagePath = path.join(root, "review-d1-partial-beer-waiting-fhd-r1.html");
const outputPath = path.join(root, "review-d1-partial-beer-waiting-fhd-r1.png");

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(`file://${pagePath}`, { waitUntil: "networkidle" });
  await page.screenshot({ path: outputPath });
} finally {
  await browser.close();
}
