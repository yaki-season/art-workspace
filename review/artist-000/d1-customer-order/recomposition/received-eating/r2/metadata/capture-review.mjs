import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const workspace = path.resolve(root, "../../../../../../..");
const requireFromApp = createRequire(path.join(workspace, "app", "package.json"));
const { chromium } = requireFromApp("playwright");
const pagePath = path.join(root, "review-d1-received-eating-fhd-r2.html");
const captures = [
  ["eat-negima", "review-d1-received-eating-eat-negima-fhd-r2.png"],
  ["drink-beer", "review-d1-received-eating-drink-beer-fhd-r2.png"],
];

const browser = await chromium.launch({ headless: true });
try {
  for (const [frame, output] of captures) {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    await page.goto(`file://${pagePath}?frame=${frame}`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(root, output) });
    await page.close();
  }
} finally {
  await browser.close();
}
