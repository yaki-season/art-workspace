import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const workspace = path.resolve(here, "../../../../../../../../../");
const sourceRoot = path.resolve(here, "../../../../negima-cooking-second-face/r2");
const { chromium } = (await import(pathToFileURL(path.join(workspace, "app/node_modules/@playwright/test/index.js")).href)).default;
const digest = async (file) => createHash("sha256").update(await readFile(file)).digest("hex");
const cases = [
  { name: "fhd", width: 1920, height: 1080, expected: { x: 543, y: 257, width: 131, height: 516 }, minSignalPixels: 500 },
  { name: "720", width: 1280, height: 720, expected: { x: 362, y: 172, width: 88, height: 344 }, minSignalPixels: 175 },
];
const expectedSourceHashes = {
  skewerGlb: "fef2b4eae60b8657dafb5b9137b9220088e2d36366ac53298df132bd4f9b9bf5",
  skewerAlbedo: "dc9625b7961ddc36fdbe5fb44252407e4cdb036e20c50f51b0de1a639326446f",
  chickenGlb: "740d48acc998a9bea5b16c46d4be66d143efb57a8cb42726c757d0e22e9da7dc",
  chickenAlbedo: "4baa5ca99f5f190053930461251f0497219731048a7d3caddf5ae2e03cfefb47",
  greenOnionGlb: "065a918355c625f4c2f364d26dc0e20b3326155c799399905c04aa48494bb3e3",
  greenOnionAlbedo: "8712631509a5477d81ab88b6e99dd62ae803225560667cd60ec8d18fe131aa95",
};
const sourceFiles = {
  skewerGlb: path.join(workspace, "art-workspace/review/artist-000/d1-cooking/assembly/skewer-base/r2/assets/mdl-skewer-base-r2.glb"),
  skewerAlbedo: path.join(workspace, "art-workspace/review/artist-000/d1-cooking/assembly/skewer-base/r2/assets/tex-skewer-base-albedo-r2.png"),
  chickenGlb: path.join(workspace, "art-workspace/review/artist-000/d1-cooking/assembly/ingredient-chicken/r1/assets/mdl-ingredient-chicken-r1.glb"),
  chickenAlbedo: path.join(workspace, "art-workspace/review/artist-000/d1-cooking/assembly/ingredient-chicken/r1/assets/tex-ingredient-chicken-albedo-r1.png"),
  greenOnionGlb: path.join(workspace, "art-workspace/review/artist-000/d1-cooking/assembly/ingredient-negi/r3/assets/mdl-ingredient-negi-r3.glb"),
  greenOnionAlbedo: path.join(workspace, "art-workspace/review/artist-000/d1-cooking/assembly/ingredient-negi/r3/assets/tex-ingredient-negi-albedo-r3.png"),
};
const sameBox = (actual, expected) => Object.keys(expected).every((key) => Math.abs(actual[key] - expected[key]) <= 1);
const sameNumber = (actual, expected) => Math.abs(actual - expected) < 0.0001;

async function measureR2Signal(page, { width, height }) {
  return page.evaluate(async ({ targetWidth, targetHeight }) => {
    const load = (src) => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
    const suffix = targetWidth === 1280 ? "720" : "fhd";
    const [r1, r2] = await Promise.all([
      load(`/art-workspace/review/artist-000/d1-cooking/grill/recomposition/cooking-second-face-station-consumption/r1/review-mdl-negima-grill-cooking-second-face-station-${suffix}-r1.png`),
      load(`/art-workspace/review/artist-000/d1-cooking/grill/recomposition/cooking-second-face-station-consumption/r2/review-mdl-negima-grill-cooking-second-face-station-${suffix}-r2.png`),
    ]);
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.imageSmoothingEnabled = false;
    context.drawImage(r1, 0, 0, targetWidth, targetHeight);
    const r1Pixels = context.getImageData(0, 0, targetWidth, targetHeight).data;
    context.clearRect(0, 0, targetWidth, targetHeight);
    context.drawImage(r2, 0, 0, targetWidth, targetHeight);
    const r2Pixels = context.getImageData(0, 0, targetWidth, targetHeight).data;
    const region = { x: Math.round(530 * targetWidth / 1920), y: Math.round(250 * targetHeight / 1080), width: Math.round(165 * targetWidth / 1920), height: Math.round(530 * targetHeight / 1080) };
    let signalPixels = 0;
    let amberOrCaramelSignalPixels = 0;
    let maxChannelDelta = 0;
    for (let y = region.y; y < region.y + region.height; y += 1) for (let x = region.x; x < region.x + region.width; x += 1) {
      const offset = (y * targetWidth + x) * 4;
      const redDelta = r2Pixels[offset] - r1Pixels[offset];
      const greenDelta = r2Pixels[offset + 1] - r1Pixels[offset + 1];
      const blueDelta = r2Pixels[offset + 2] - r1Pixels[offset + 2];
      const delta = Math.abs(redDelta) + Math.abs(greenDelta) + Math.abs(blueDelta);
      if (delta > 28) signalPixels += 1;
      if (delta > 38 && (r2Pixels[offset] > r2Pixels[offset + 2] + 18 || r2Pixels[offset + 1] > r2Pixels[offset + 2] + 14)) amberOrCaramelSignalPixels += 1;
      maxChannelDelta = Math.max(maxChannelDelta, Math.abs(redDelta), Math.abs(greenDelta), Math.abs(blueDelta));
    }
    return { region, signalPixels, amberOrCaramelSignalPixels, maxChannelDelta };
  }, { targetWidth: width, targetHeight: height });
}

const actualSourceHashes = Object.fromEntries(await Promise.all(Object.entries(sourceFiles).map(async ([key, file]) => [key, await digest(file)])));
for (const [key, expected] of Object.entries(expectedSourceHashes)) {
  if (actualSourceHashes[key] !== expected) throw new Error(`approved source SHA drift for ${key}: ${actualSourceHashes[key]}`);
}

const browser = await chromium.launch({ headless: true, args: ["--use-angle=swiftshader", "--use-gl=angle", "--enable-unsafe-swiftshader"] });
try {
  const boards = [];
  const signalChecks = [];
  for (const item of cases) {
    const page = await browser.newPage({ viewport: { width: item.width, height: item.height }, deviceScaleFactor: 1 });
    page.on("pageerror", (error) => console.error(`browser-pageerror:${error.message}`));
    page.on("console", (message) => { if (message.type() === "error") console.error(`browser-console:${message.text()}`); });
    await page.goto(`http://127.0.0.1:8012/art-workspace/review/artist-000/d1-cooking/grill/recomposition/cooking-second-face-station-consumption/r2/review-mdl-negima-grill-cooking-second-face-station-r2.html?viewport=${item.name}`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.body.dataset.ready === "true" || document.body.dataset.ready === "error");
    const renderError = await page.evaluate(() => document.body.dataset.error || null);
    if (renderError) throw new Error(`${item.name}: station render failed: ${renderError}`);
    const state = await page.evaluate(() => window.__cookingSecondR2StationConsumption.state());
    const safe = { x: 500 * item.width / 1920, y: 210 * item.height / 1080, width: 960 * item.width / 1920, height: 580 * item.height / 1080 };
    const box = state.renderedAlphaBBox;
    if (!sameBox(box, item.expected)) throw new Error(`${item.name}: R2 shader must not change raw R3 footprint: ${JSON.stringify({ box, expected: item.expected })}`);
    if (box.x < safe.x || box.y < safe.y || box.x + box.width > safe.x + safe.width || box.y + box.height > safe.y + safe.height) throw new Error(`${item.name}: outside grill safe bounds`);
    if (state.sourceRevision !== 2 || state.triangleCount !== 476 || state.transform.horizontalScale !== 1.45 || state.transform.verticalScale !== 1.18 || state.flipPivot.axis !== "local +Y" || !sameNumber(state.flipPivot.rotationY, Math.PI) || state.flipPivot.firstInput !== "0->PI" || state.flipPivot.secondInput !== "PI->2PI") throw new Error(`${item.name}: source, geometry, shared transform or flip contract mismatch`);
    const expectedGameplay = { status: "back", completedFlips: 1, orientationFaceDown: "back", contactFace: "back", frontElapsedSec: 4, backElapsedSec: 4, stage: "cooking" };
    if (JSON.stringify(state.gameplay) !== JSON.stringify(expectedGameplay)) throw new Error(`${item.name}: gameplay snapshot mismatch`);
    const signal = state.shader.face1Signal;
    if (state.shader.face1HeatProgress !== 0.52 || signal.chickenClusters !== 3 || signal.greenOnionBands !== 2 || JSON.stringify(signal.coarseUvCells) !== JSON.stringify([16, 16]) || !signal.signalOnlyOnVisibleFace || state.shader.materialBindingCount !== 5 || !state.shader.reverseDecalPreserved || !state.shader.nearestAlbedosReused || state.shader.newRaster || state.shader.newGlb || state.shader.newTexture || state.shader.newAtlas || state.shader.newBake) throw new Error(`${item.name}: R2 shader or source policy mismatch`);
    const output = path.join(root, `review-mdl-negima-grill-cooking-second-face-station-${item.name}-r2.png`);
    await page.screenshot({ path: output, clip: { x: 0, y: 0, width: item.width, height: item.height } });
    const signalCheck = await measureR2Signal(page, item);
    if (signalCheck.signalPixels < item.minSignalPixels || signalCheck.amberOrCaramelSignalPixels < item.minSignalPixels / 3 || signalCheck.maxChannelDelta < 36) throw new Error(`${item.name}: R2 face signal is not strong enough at station scale: ${JSON.stringify(signalCheck)}`);
    boards.push({ file: `../${path.basename(output)}`, width: item.width, height: item.height, bytes: (await stat(output)).size, sha256: await digest(output), state });
    signalChecks.push({ viewport: item.name, ...signalCheck, minimumSignalPixels: item.minSignalPixels, result: "pass" });
    await page.close();
  }

  const comparison = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await comparison.goto("http://127.0.0.1:8012/art-workspace/review/artist-000/d1-cooking/grill/recomposition/cooking-second-face-station-consumption/r2/review-mdl-negima-grill-cooking-face-compare-fhd-r2.html", { waitUntil: "networkidle" });
  await comparison.waitForFunction(() => document.body.dataset.ready === "true");
  const parity = await comparison.evaluate(() => window.__cookingFaceR2Comparison);
  if (parity.left !== "approved cooking-first-face station R1" || parity.right !== "cooking-second-face R2") throw new Error(`first/second comparison source mismatch: ${JSON.stringify(parity)}`);
  const comparisonOutput = path.join(root, "review-mdl-negima-grill-cooking-face-compare-fhd-r2.png");
  await comparison.screenshot({ path: comparisonOutput, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
  await comparison.close();

  const sourceIntegration = {
    schemaVersion: 1,
    id: "MDL-NEGIMA-GRILL-COOKING-SECOND-FACE",
    sourceRevision: 2,
    status: "pending-user-review",
    runtimeModule: { file: "../runtime/compose-mdl-negima-grill-cooking-second-face.mjs", sha256: await digest(path.join(sourceRoot, "runtime/compose-mdl-negima-grill-cooking-second-face.mjs")) },
    stateFile: { file: "../assets/mdl-negima-grill-cooking-second-face-r2.state.json", sha256: await digest(path.join(sourceRoot, "assets/mdl-negima-grill-cooking-second-face-r2.state.json")) },
    approvedSourceSha256: actualSourceHashes,
    validation: { triangleCount: 476, rotationY: Math.PI, completedFlips: 1, face1HeatProgress: 0.52, sourceAssetsByteIdentical: true, newRaster: false, newGlb: false, newTexture: false, newAtlas: false, newBake: false, result: "pass" },
    runtimeRegistrationAllowed: false,
  };
  await writeFile(path.join(sourceRoot, "metadata/integration-report.json"), `${JSON.stringify(sourceIntegration, null, 2)}\n`);

  const report = {
    schemaVersion: 1,
    id: "MDL-NEGIMA-GRILL-COOKING-SECOND-FACE",
    sourceRevision: 2,
    status: "pending-user-review",
    reviewBoards: boards,
    comparison: { file: `../${path.basename(comparisonOutput)}`, width: 1920, height: 1080, bytes: (await stat(comparisonOutput)).size, sha256: await digest(comparisonOutput), left: "approved cooking-first-face station R1", right: "cooking-second-face R2", crop: parity.sourceCrop, parity: "same master-derived base, D1 slot0 anchor and shared transform; only the approved R2 reverse-face shader signal differs" },
    r2SignalAgainstR1: { evidence: "R1 and R2 second-face screenshots at the same station placement were compared inside the negima footprint; this proves the visible coarse shader signal without changing geometry or source textures.", views: signalChecks, result: "pass" },
    result: "pass",
    runtimeRegistrationAllowed: false,
  };
  await writeFile(path.join(here, "consumption-validation-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`cooking-second R2 station capture complete: ${report.comparison.sha256}`);
} finally {
  await browser.close();
}
