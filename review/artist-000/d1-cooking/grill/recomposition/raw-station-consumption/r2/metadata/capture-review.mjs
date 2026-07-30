import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const workspace = path.resolve(here, "../../../../../../../../../");
const { chromium } = (await import(pathToFileURL(path.join(workspace, "app/node_modules/@playwright/test/index.js")).href)).default;
const digest = async (file) => createHash("sha256").update(await readFile(file)).digest("hex");
const cases = [{ name: "fhd", width: 1920, height: 1080 }, { name: "720", width: 1280, height: 720 }];

const browser = await chromium.launch({ headless: true, args: ["--use-angle=swiftshader", "--use-gl=angle", "--enable-unsafe-swiftshader"] });
try {
  const boards = [];
  for (const item of cases) {
    const page = await browser.newPage({ viewport: { width: item.width, height: item.height }, deviceScaleFactor: 1 });
    await page.goto(`http://127.0.0.1:8012/art-workspace/review/artist-000/d1-cooking/grill/recomposition/raw-station-consumption/r2/review-mdl-negima-grill-raw-station-r2.html?viewport=${item.name}`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.body.dataset.ready === "true");
    const state = await page.evaluate(() => window.__rawStationConsumption.state());
    const box = state.renderedAlphaBBox;
    const safe = { x: 500 * item.width / 1920, y: 210 * item.height / 1080, width: 960 * item.width / 1920, height: 580 * item.height / 1080 };
    if (state.triangleCount !== 476 || state.flipPivot.axis !== "local +Y" || state.flipPivot.firstInput !== "0->PI" || state.flipPivot.secondInput !== "PI->2PI") throw new Error(`${item.name}: raw model contract mismatch`);
    if (state.gameplay.frontElapsedSec !== 0 || state.gameplay.backElapsedSec !== 0 || state.gameplay.contactFace !== null) throw new Error(`${item.name}: raw gameplay state mismatch`);
    if (state.renderer.newRaster || state.renderer.newGlb || state.renderer.newTexture || !state.renderer.nearestAlbedosReused) throw new Error(`${item.name}: source policy mismatch`);
    if (!box || box.x < safe.x || box.y < safe.y || box.x + box.width > safe.x + safe.width || box.y + box.height > safe.y + safe.height) throw new Error(`${item.name}: skewer leaves grill safe bounds: ${JSON.stringify({ box, safe })}`);
    if (box.height < safe.height * 0.7) throw new Error(`${item.name}: skewer is too short for a one-skewer lane: ${JSON.stringify({ box, safe })}`);
    const output = path.join(root, `review-mdl-negima-grill-raw-station-${item.name}-r2.png`);
    await page.screenshot({ path: output, clip: { x: 0, y: 0, width: item.width, height: item.height } });
    boards.push({ file: `../${path.basename(output)}`, width: item.width, height: item.height, bytes: (await stat(output)).size, sha256: await digest(output), state });
    await page.close();
  }
  await writeFile(path.join(here, "consumption-validation-report.json"), `${JSON.stringify({ schemaVersion: 1, id: "MDL-NEGIMA-GRILL-RAW", sourceRevision: 1, reviewRevision: 2, status: "pending-user-review", reviewBoards: boards, result: "pass", runtimeRegistrationAllowed: false }, null, 2)}\n`);
} finally { await browser.close(); }
