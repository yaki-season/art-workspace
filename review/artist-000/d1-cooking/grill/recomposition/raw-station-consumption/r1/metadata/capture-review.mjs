import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const workspace = path.resolve(here, "../../../../../../../../../");
const { chromium } = (await import(pathToFileURL(path.join(workspace, "app/node_modules/@playwright/test/index.js")).href)).default;
const digest = async (file) => createHash("sha256").update(await readFile(file)).digest("hex");
const target = (name, width, height) => ({
  name,
  width,
  height,
  url: `http://127.0.0.1:8012/art-workspace/review/artist-000/d1-cooking/grill/recomposition/raw-station-consumption/r1/review-mdl-negima-grill-raw-station-${name}-r1.html`,
  output: path.join(root, `review-mdl-negima-grill-raw-station-${name}-r1.png`)
});

const browser = await chromium.launch({ headless: true, args: ["--use-angle=swiftshader", "--use-gl=angle", "--enable-unsafe-swiftshader"] });
try {
  const results = [];
  for (const item of [target("fhd", 1920, 1080), target("720", 1280, 720)]) {
    const page = await browser.newPage({ viewport: { width: item.width, height: item.height }, deviceScaleFactor: 1 });
    page.on("pageerror", (error) => { throw error; });
    await page.goto(item.url, { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.body.dataset.ready === "true");
    const state = await page.evaluate(() => window.__rawStationConsumption.state());
    const expected = {
      x: 0.297 * item.width,
      y: 0.435 * item.height,
      width: 0.041 * item.width,
      height: 0.27 * item.height
    };
    for (const key of Object.keys(expected)) if (Math.abs(state.visualRect[key] - expected[key]) > 1e-8) throw new Error(`${item.name} slot0 ${key} mismatch`);
    if (state.triangleCount !== 476 || state.flipPivot.axis !== "local +Y" || state.flipPivot.firstInput !== "0->PI" || state.flipPivot.secondInput !== "PI->2PI") throw new Error(`${item.name} raw model contract mismatch`);
    if (state.gameplay.frontElapsedSec !== 0 || state.gameplay.backElapsedSec !== 0 || state.gameplay.contactFace !== null) throw new Error(`${item.name} raw gameplay state mismatch`);
    if (state.renderer.newRaster || state.renderer.newGlb || state.renderer.newTexture || !state.renderer.nearestAlbedosReused) throw new Error(`${item.name} source policy mismatch`);
    await page.screenshot({ path: item.output, clip: { x: 0, y: 0, width: item.width, height: item.height } });
    results.push({
      file: `../${path.basename(item.output)}`,
      width: item.width,
      height: item.height,
      bytes: (await stat(item.output)).size,
      sha256: await digest(item.output),
      state
    });
    await page.close();
  }
  const report = {
    schemaVersion: 1,
    id: "MDL-NEGIMA-GRILL-RAW",
    sourceRevision: 1,
    status: "pending-user-review",
    reviewBoards: results,
    result: "pass",
    runtimeRegistrationAllowed: false
  };
  await writeFile(path.join(here, "consumption-validation-report.json"), `${JSON.stringify(report, null, 2)}\n`);
} finally {
  await browser.close();
}
