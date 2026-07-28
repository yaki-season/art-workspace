import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const workspace = path.resolve(root, "../../../../../../..");
const requireFromApp = createRequire(path.join(workspace, "app", "package.json"));
const { chromium } = requireFromApp("playwright");
const html = path.join(root, "review-d1-all-waiting-fhd-r1.html");
const output = path.join(root, "review-d1-all-waiting-fhd-r1.png");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(html).href, { waitUntil: "networkidle" });
await page.screenshot({ path: output, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
await browser.close();
