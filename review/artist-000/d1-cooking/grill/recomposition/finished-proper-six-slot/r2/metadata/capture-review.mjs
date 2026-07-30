import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const workspace = path.resolve(here, "../../../../../../../../../");
const url = "http://127.0.0.1:8012/art-workspace/review/artist-000/d1-cooking/grill/recomposition/finished-proper-six-slot/r2/review-scr-svc-grill-finished-proper-six-slot-fhd-r2.html";
const { chromium } = (await import(pathToFileURL(path.join(workspace, "app/node_modules/@playwright/test/index.js")).href)).default;
const hashFile = async (file) => createHash("sha256").update(await readFile(file)).digest("hex");

const expectedState = (state) => {
  if (state.stage !== "finished" || state.contactFace !== null || state.completionQuality !== "Perfect") throw new Error(`invalid completion state: ${JSON.stringify(state)}`);
  if (state.foodCount !== 1 || state.foodItem !== "negima" || state.completedFlips !== 1 || state.visibleFace !== 1) throw new Error(`invalid one-negima state: ${JSON.stringify(state)}`);
  if (state.face0ElapsedSeconds !== 8 || state.face1ElapsedSeconds !== 8 || state.triangleCount !== 476) throw new Error(`invalid proper shader state: ${JSON.stringify(state)}`);
  if (state.fixedGrillSlotCount !== 6 || state.grillSlotStates.join(",") !== "empty,empty,empty,empty,empty,empty") throw new Error(`invalid fixed-slot state: ${JSON.stringify(state)}`);
  if (JSON.stringify(state.completionTrayPlacementFhd) !== JSON.stringify({ x: 1534, y: 130, width: 218, height: 342 })) throw new Error(`invalid tray placement: ${JSON.stringify(state)}`);
  if (state.hasNewFoodRaster || state.hasNewTexture || state.hasNewGLB || state.visibleDomControls !== 0) throw new Error(`forbidden new art or visible controls: ${JSON.stringify(state)}`);
};

const capture = async (browser, output, viewport, file) => {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  await page.goto(`${url}?output=${output}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.body.dataset.ready === "true");
  const result = await page.evaluate(() => {
    const state = window.__finishedProperSixSlotReview.state();
    const rect = (selector) => { const r = document.querySelector(selector).getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
    return { state, screen: rect("#screen"), base: rect("#base"), tray: rect("#finished-tray"), modelCanvas: rect("#models"), safeArea: rect("#dom-safe-area"), output: document.body.dataset.output };
  });
  expectedState(result.state);
  const scale = output === "720" ? 2 / 3 : 1;
  const expectedRect = { x: 0, y: 0, width: 1920 * scale, height: 1080 * scale };
  for (const key of ["screen", "base", "tray", "modelCanvas", "safeArea"]) {
    const actual = result[key];
    if (Math.abs(actual.x - expectedRect.x) > 0.01 || Math.abs(actual.y - expectedRect.y) > 0.01 || Math.abs(actual.width - expectedRect.width) > 0.01 || Math.abs(actual.height - expectedRect.height) > 0.01) throw new Error(`unexpected ${key} rect for ${output}: ${JSON.stringify(actual)}`);
  }
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: viewport.width, height: viewport.height } });
  await page.close();
  return result;
};

const browser = await chromium.launch({ headless: true, args: ["--use-angle=swiftshader", "--use-gl=angle", "--enable-unsafe-swiftshader"] });
try {
  const fhdFile = path.join(root, "review-scr-svc-grill-finished-proper-six-slot-fhd-r2.png");
  const hdFile = path.join(root, "review-scr-svc-grill-finished-proper-six-slot-720p-r2.png");
  const fhd = await capture(browser, "fhd", { width: 1920, height: 1080 }, fhdFile);
  const hd = await capture(browser, "720", { width: 1280, height: 720 }, hdFile);
  const report = {
    schemaVersion: 1,
    id: "SCR-SVC-GRILL-FINISHED-PROPER-SIX-SLOT",
    sourceRevision: 2,
    status: "pending-user-review",
    approvedInputs: [
      { id: "CM-GRILL-STATION-EMPTY-BASE", revision: 1, sha256: "ed989dcbbddcb2ff1014f38a6c93512989b553149fb16c4654edb522d2b41d1a" },
      { id: "ST-GRILL-FINISHED-TRAY", revision: 1, sha256: "9cffb28a2e7a99955de060dd16a7f52ba23a1292e3454e9dad56b91310134be6" },
      { id: "CMP-GRILL-FINISHED-PROPER-NEGIMA", revision: 1, stateSha256: "6207bd86013adcf9aaea261b0c86e6eeaa9ec63779f7a432763bd91b2b140ab9" }
    ],
    screenshots: {
      fhd: { file: "../review-scr-svc-grill-finished-proper-six-slot-fhd-r2.png", width: 1920, height: 1080, bytes: (await stat(fhdFile)).size, sha256: await hashFile(fhdFile), render: fhd },
      hd720: { file: "../review-scr-svc-grill-finished-proper-six-slot-720p-r2.png", width: 1280, height: 720, bytes: (await stat(hdFile)).size, sha256: await hashFile(hdFile), render: hd }
    },
    result: "pass"
  };
  await writeFile(path.join(root, "metadata/consumption-validation-report.json"), `${JSON.stringify(report, null, 2)}\n`);
} finally {
  await browser.close();
}
