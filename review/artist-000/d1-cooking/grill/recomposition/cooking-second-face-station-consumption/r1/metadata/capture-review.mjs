import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const workspace = path.resolve(here, "../../../../../../../../../");
const { chromium } = (await import(pathToFileURL(path.join(workspace, "app/node_modules/@playwright/test/index.js")).href)).default;
const digest = async (file) => createHash("sha256").update(await readFile(file)).digest("hex");
const cases = [
  { name: "fhd", width: 1920, height: 1080, minDistinctPixels: 500 },
  { name: "720", width: 1280, height: 720, minDistinctPixels: 225 },
];
const sameNumber = (actual, expected) => Math.abs(actual - expected) < 0.0001;

async function measureFaceDifference(page, { width, height }) {
  return page.evaluate(async ({ width: targetWidth, height: targetHeight }) => {
    const load = (src) => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
    const [first, second] = await Promise.all([
      load("/art-workspace/review/artist-000/d1-cooking/grill/recomposition/cooking-first-face-station-consumption/r1/review-mdl-negima-grill-cooking-first-face-station-fhd-r1.png"),
      load(`/art-workspace/review/artist-000/d1-cooking/grill/recomposition/cooking-second-face-station-consumption/r1/review-mdl-negima-grill-cooking-second-face-station-${targetWidth === 1280 ? "720" : "fhd"}-r1.png`),
    ]);
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.imageSmoothingEnabled = false;
    context.drawImage(first, 0, 0, targetWidth, targetHeight);
    const firstPixels = context.getImageData(0, 0, targetWidth, targetHeight).data;
    context.clearRect(0, 0, targetWidth, targetHeight);
    context.drawImage(second, 0, 0, targetWidth, targetHeight);
    const secondPixels = context.getImageData(0, 0, targetWidth, targetHeight).data;
    const region = {
      x: Math.round(500 * targetWidth / 1920),
      y: Math.round(210 * targetHeight / 1080),
      width: Math.round(960 * targetWidth / 1920),
      height: Math.round(580 * targetHeight / 1080),
    };
    let distinctPixels = 0;
    let totalDelta = 0;
    let maxChannelDelta = 0;
    for (let y = region.y; y < region.y + region.height; y += 1) for (let x = region.x; x < region.x + region.width; x += 1) {
      const offset = (y * targetWidth + x) * 4;
      const delta = Math.abs(firstPixels[offset] - secondPixels[offset])
        + Math.abs(firstPixels[offset + 1] - secondPixels[offset + 1])
        + Math.abs(firstPixels[offset + 2] - secondPixels[offset + 2]);
      if (delta > 24) distinctPixels += 1;
      totalDelta += delta;
      maxChannelDelta = Math.max(maxChannelDelta,
        Math.abs(firstPixels[offset] - secondPixels[offset]),
        Math.abs(firstPixels[offset + 1] - secondPixels[offset + 1]),
        Math.abs(firstPixels[offset + 2] - secondPixels[offset + 2]));
    }
    return { region, distinctPixels, distinctPixelCoverage: distinctPixels / (region.width * region.height), totalDelta, maxChannelDelta };
  }, { width, height });
}

const browser = await chromium.launch({ headless: true, args: ["--use-angle=swiftshader", "--use-gl=angle", "--enable-unsafe-swiftshader"] });
try {
  const boards = [];
  const distinctions = [];
  for (const item of cases) {
    const page = await browser.newPage({ viewport: { width: item.width, height: item.height }, deviceScaleFactor: 1 });
    page.on("pageerror", (error) => console.error(`browser-pageerror:${error.message}`));
    page.on("console", (message) => { if (message.type() === "error") console.error(`browser-console:${message.text()}`); });
    await page.goto(`http://127.0.0.1:8012/art-workspace/review/artist-000/d1-cooking/grill/recomposition/cooking-second-face-station-consumption/r1/review-mdl-negima-grill-cooking-second-face-station-r1.html?viewport=${item.name}`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.body.dataset.ready === "true" || document.body.dataset.ready === "error");
    const renderError = await page.evaluate(() => document.body.dataset.error || null);
    if (renderError) throw new Error(`${item.name}: cooking station render failed: ${renderError}`);
    const state = await page.evaluate(() => window.__cookingSecondStationConsumption.state());
    const safe = { x: 500 * item.width / 1920, y: 210 * item.height / 1080, width: 960 * item.width / 1920, height: 580 * item.height / 1080 };
    const box = state.renderedAlphaBBox;
    if (box.x < safe.x || box.y < safe.y || box.x + box.width > safe.x + safe.width || box.y + box.height > safe.y + safe.height) throw new Error(`${item.name}: outside grill safe bounds`);
    if (state.triangleCount !== 476 || state.transform.horizontalScale !== 1.45 || state.transform.verticalScale !== 1.18 || state.flipPivot.axis !== "local +Y" || !sameNumber(state.flipPivot.rotationY, Math.PI) || state.flipPivot.firstInput !== "0->PI" || state.flipPivot.secondInput !== "PI->2PI") throw new Error(`${item.name}: geometry, shared transform or flip contract mismatch`);
    const expectedGameplay = { status: "back", completedFlips: 1, orientationFaceDown: "back", contactFace: "back", frontElapsedSec: 4, backElapsedSec: 4, stage: "cooking" };
    if (JSON.stringify(state.gameplay) !== JSON.stringify(expectedGameplay)) throw new Error(`${item.name}: gameplay snapshot mismatch`);
    if (state.shader.visibleFace !== 1 || state.shader.face0HeatProgress !== 0.52 || state.shader.face1HeatProgress !== 0.52 || state.shader.materialBindingCount !== 5 || !state.shader.reverseDecalPreserved || !state.shader.nearestAlbedosReused || state.shader.newRaster || state.shader.newGlb || state.shader.newTexture) throw new Error(`${item.name}: shader source policy mismatch`);
    const output = path.join(root, `review-mdl-negima-grill-cooking-second-face-station-${item.name}-r1.png`);
    await page.screenshot({ path: output, clip: { x: 0, y: 0, width: item.width, height: item.height } });
    const distinction = await measureFaceDifference(page, item);
    if (distinction.distinctPixels < item.minDistinctPixels || distinction.maxChannelDelta < 24) throw new Error(`${item.name}: first/second face signal is not legible at this viewport: ${JSON.stringify(distinction)}`);
    boards.push({ file: `../${path.basename(output)}`, width: item.width, height: item.height, bytes: (await stat(output)).size, sha256: await digest(output), state });
    distinctions.push({ viewport: item.name, ...distinction, minimumDistinctPixels: item.minDistinctPixels, result: "technical-screen-difference-pass" });
    await page.close();
  }

  const comparison = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await comparison.goto("http://127.0.0.1:8012/art-workspace/review/artist-000/d1-cooking/grill/recomposition/cooking-second-face-station-consumption/r1/review-mdl-negima-grill-cooking-face-compare-fhd-r1.html", { waitUntil: "networkidle" });
  await comparison.waitForFunction(() => document.body.dataset.ready === "true");
  const parity = await comparison.evaluate(() => window.__cookingFaceComparison);
  if (parity.left !== "cooking-first-face 4 sec" || parity.right !== "cooking-second-face 4+4 sec") throw new Error(`first/second comparison source mismatch: ${JSON.stringify(parity)}`);
  const comparisonOutput = path.join(root, "review-mdl-negima-grill-cooking-face-compare-fhd-r1.png");
  await comparison.screenshot({ path: comparisonOutput, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
  await comparison.close();

  const report = {
    schemaVersion: 1,
    id: "MDL-NEGIMA-GRILL-COOKING-SECOND-FACE",
    sourceRevision: 1,
    status: "not-submitted-face-signal-insufficient",
    reviewBoards: boards,
    comparison: {
      file: `../${path.basename(comparisonOutput)}`,
      width: 1920,
      height: 1080,
      bytes: (await stat(comparisonOutput)).size,
      sha256: await digest(comparisonOutput),
      left: "approved cooking-first-face station R1",
      right: "cooking-second-face 4+4 sec",
      crop: parity.sourceCrop,
      parity: "same D1 slot0 anchor, shared transform and master-derived base; only face orientation and approved face-specific shader state differ",
    },
    faceDistinction: {
      automatedEvidence: "first/second screenshots were compared pixel-for-pixel inside the grill safe area. This detects an actual reversed decal/ingredient-direction screen difference, but is not an automatic sear-legibility approval.",
      views: distinctions,
      visualReview: "failed: actual FHD/720 inspection found onion end and surface-direction reversal, but the partial sear is too weak to communicate an actively cooking second face.",
      result: "insufficient-for-user-candidate",
    },
    result: "not-submitted",
    runtimeRegistrationAllowed: false,
  };
  await writeFile(path.join(here, "consumption-validation-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`cooking-second station capture complete: ${report.comparison.sha256}`);
} finally {
  await browser.close();
}
