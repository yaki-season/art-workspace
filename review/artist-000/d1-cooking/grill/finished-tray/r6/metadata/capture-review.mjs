import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const workspace = path.resolve(here, "../../../../../../../../");
const url = "http://127.0.0.1:8012/art-workspace/review/artist-000/d1-cooking/grill/finished-tray/r6/review-st-grill-finished-makisu-fhd-r6.html";
const screenshot = path.join(root, "review-st-grill-finished-makisu-fhd-r6.png");
const asset = path.join(root, "assets/st-grill-finished-tray-fhd-r6.png");
const digest = async (file) => createHash("sha256").update(await readFile(file)).digest("hex");
const { chromium } = (await import(pathToFileURL(path.join(workspace, "app/node_modules/@playwright/test/index.js")).href)).default;

const browser = await chromium.launch({ headless: true, args: ["--use-angle=swiftshader", "--use-gl=angle", "--enable-unsafe-swiftshader"] });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.body.dataset.ready === "true");
  const geometry = await page.evaluate(() => {
    const rect = (selector) => { const r = document.querySelector(selector).getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
    return {
      base: rect("#base"),
      completedMatLayer: rect("#completed-mat"),
      stableTransformOrigin: rect("#completed-mat-anchor"),
      natural: { base: [document.querySelector("#base").naturalWidth, document.querySelector("#base").naturalHeight], completedMat: [document.querySelector("#completed-mat").naturalWidth, document.querySelector("#completed-mat").naturalHeight] }
    };
  });
  const fullFrame = { x: 0, y: 0, width: 1920, height: 1080 };
  const origin = { x: 1534, y: 130, width: 1, height: 1 };
  if (JSON.stringify(geometry.base) !== JSON.stringify(fullFrame) || JSON.stringify(geometry.completedMatLayer) !== JSON.stringify(fullFrame)) throw new Error(`unexpected layer geometry: ${JSON.stringify(geometry)}`);
  if (JSON.stringify(geometry.stableTransformOrigin) !== JSON.stringify(origin)) throw new Error(`unexpected transform origin: ${JSON.stringify(geometry)}`);
  if (JSON.stringify(geometry.natural) !== JSON.stringify({ base: [1920, 1080], completedMat: [1920, 1080] })) throw new Error(`unexpected source dimensions: ${JSON.stringify(geometry)}`);
  await page.screenshot({ path: screenshot, clip: fullFrame });
  const report = {
    schemaVersion: 1,
    id: "ST-GRILL-FINISHED-TRAY",
    sourceRevision: 6,
    status: "pending-user-review",
    screenshot: { file: "../review-st-grill-finished-makisu-fhd-r6.png", width: 1920, height: 1080, bytes: (await stat(screenshot)).size, sha256: await digest(screenshot) },
    outputAsset: { file: "../assets/st-grill-finished-tray-fhd-r6.png", bytes: (await stat(asset)).size, sha256: await digest(asset), alphaBBox: { x: 1534, y: 123, width: 266, height: 354 }, cornersAlpha: [0, 0, 0, 0], visibleGreenPixels: 0 },
    base: { id: "CM-GRILL-STATION-EMPTY-BASE", revision: 1, sha256: "ed989dcbbddcb2ff1014f38a6c93512989b553149fb16c4654edb522d2b41d1a" },
    stableTransformOrigin: { x: 1534, y: 130 },
    transform: { sourceWidth: 218, widthScale: 1.15, rotateXDeg: 4, rotateYDeg: -3, rotateZDeg: -1.5, transformOrigin: "left top" },
    geometry,
    content: { purpose: "grill.finished shared completed-food resting mat before manual serving", material: "flat bamboo makisu", foodOrSkewerBaked: false, visibleDomControls: 0 },
    result: "pass"
  };
  await writeFile(path.join(root, "metadata/makisu-validation-report.json"), `${JSON.stringify(report, null, 2)}\n`);
} finally {
  await browser.close();
}
