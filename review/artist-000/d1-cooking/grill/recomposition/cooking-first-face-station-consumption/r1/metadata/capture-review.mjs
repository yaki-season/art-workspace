import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const workspace = path.resolve(here, "../../../../../../../../../");
const { chromium } = (await import(pathToFileURL(path.join(workspace, "app/node_modules/@playwright/test/index.js")).href)).default;
const digest = async (file) => createHash("sha256").update(await readFile(file)).digest("hex");
const cases = [{ name: "fhd", width: 1920, height: 1080, expected: { x: 545, y: 257, width: 131, height: 516 } }, { name: "720", width: 1280, height: 720, expected: { x: 363, y: 171, width: 88, height: 344 } }];
const sameBox = (actual, expected) => Object.keys(expected).every((key) => Math.abs(actual[key] - expected[key]) <= 1);

const browser = await chromium.launch({ headless: true, args: ["--use-angle=swiftshader", "--use-gl=angle", "--enable-unsafe-swiftshader"] });
try {
  const boards = [];
  for (const item of cases) {
    const page = await browser.newPage({ viewport: { width: item.width, height: item.height }, deviceScaleFactor: 1 });
    page.on("pageerror", (error) => console.error(`browser-pageerror:${error.message}`));
    page.on("console", (message) => { if (message.type() === "error") console.error(`browser-console:${message.text()}`); });
    await page.goto(`http://127.0.0.1:8012/art-workspace/review/artist-000/d1-cooking/grill/recomposition/cooking-first-face-station-consumption/r1/review-mdl-negima-grill-cooking-first-face-station-r1.html?viewport=${item.name}`, { waitUntil: "networkidle" });
    try {
      await page.waitForFunction(() => document.body.dataset.ready === "true" || document.body.dataset.ready === "error");
    } catch (error) {
      const phase = await page.evaluate(() => document.body.dataset.phase || "missing");
      throw new Error(`${item.name}: readiness timeout at phase=${phase}; ${error.message}`);
    }
    const renderError = await page.evaluate(() => document.body.dataset.error || null);
    if (renderError) throw new Error(`${item.name}: cooking station render failed: ${renderError}`);
    const state = await page.evaluate(() => window.__cookingFirstStationConsumption.state());
    const safe = { x: 500 * item.width / 1920, y: 210 * item.height / 1080, width: 960 * item.width / 1920, height: 580 * item.height / 1080 };
    const box = state.renderedAlphaBBox;
    if (!sameBox(box, item.expected)) throw new Error(`${item.name}: raw R3 size/placement drift: ${JSON.stringify({ box, expected: item.expected })}`);
    if (box.x < safe.x || box.y < safe.y || box.x + box.width > safe.x + safe.width || box.y + box.height > safe.y + safe.height) throw new Error(`${item.name}: outside grill safe bounds`);
    if (state.triangleCount !== 476 || state.transform.horizontalScale !== 1.45 || state.transform.verticalScale !== 1.18 || state.flipPivot.axis !== "local +Y" || state.flipPivot.firstInput !== "0->PI" || state.flipPivot.secondInput !== "PI->2PI") throw new Error(`${item.name}: geometry or flip contract mismatch`);
    if (JSON.stringify(state.gameplay) !== JSON.stringify({ status: "front", orientationFaceDown: "front", contactFace: "front", frontElapsedSec: 4, backElapsedSec: 0, stage: "cooking" })) throw new Error(`${item.name}: gameplay snapshot mismatch`);
    if (state.shader.cookingFace !== 0 || state.shader.heatProgress !== 0.52 || state.shader.materialBindingCount !== 5 || !state.shader.nearestAlbedosReused || state.shader.newRaster || state.shader.newGlb || state.shader.newTexture) throw new Error(`${item.name}: shader source policy mismatch`);
    const output = path.join(root, `review-mdl-negima-grill-cooking-first-face-station-${item.name}-r1.png`);
    await page.screenshot({ path: output, clip: { x: 0, y: 0, width: item.width, height: item.height } });
    boards.push({ file: `../${path.basename(output)}`, width: item.width, height: item.height, bytes: (await stat(output)).size, sha256: await digest(output), state });
    await page.close();
  }
  const comparison = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await comparison.goto("http://127.0.0.1:8012/art-workspace/review/artist-000/d1-cooking/grill/recomposition/cooking-first-face-station-consumption/r1/review-mdl-negima-grill-cooking-first-face-compare-fhd-r1.html", { waitUntil: "networkidle" });
  await comparison.waitForFunction(() => document.body.dataset.ready === "true");
  const parity = await comparison.evaluate(() => window.__cookingFirstComparison);
  if (parity.left !== "approved raw R3" || parity.right !== "cooking-first-face 4 sec") throw new Error(`raw/cooking comparison source mismatch: ${JSON.stringify(parity)}`);
  const comparisonOutput = path.join(root, "review-mdl-negima-grill-cooking-first-face-compare-fhd-r1.png");
  await comparison.screenshot({ path: comparisonOutput, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
  await comparison.close();
  const report = { schemaVersion: 1, id: "MDL-NEGIMA-GRILL-COOKING-FIRST-FACE", sourceRevision: 1, status: "pending-user-review", reviewBoards: boards, comparison: { file: `../${path.basename(comparisonOutput)}`, width: 1920, height: 1080, bytes: (await stat(comparisonOutput)).size, sha256: await digest(comparisonOutput), left: "approved raw R3", right: "cooking-first-face 4 sec", crop: parity.sourceCrop, parity: "cooking alphaBBox, lane anchor and transform were separately matched against raw R3" }, result: "pass", runtimeRegistrationAllowed: false };
  await writeFile(path.join(here, "consumption-validation-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`cooking-first station capture complete: ${report.comparison.sha256}`);
} finally { await browser.close(); }
