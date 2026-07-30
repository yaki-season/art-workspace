import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const workspace = path.resolve(here, "../../../../../../../../");
const { chromium } = (await import(pathToFileURL(path.join(workspace, "app/node_modules/@playwright/test/index.js")).href)).default;
const browser = await chromium.launch({ headless: true, args: ["--use-angle=swiftshader", "--use-gl=angle", "--enable-unsafe-swiftshader"] });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:8012/art-workspace/review/artist-000/d1-cooking/grill/finished-tray/r6/metadata/build-makisu-transform-r6.html", { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.body.dataset.ready === "true");
  await page.screenshot({ path: path.join(root, "assets/st-grill-finished-tray-fhd-r6.png"), clip: { x: 0, y: 0, width: 1920, height: 1080 }, omitBackground: true });
} finally {
  await browser.close();
}
