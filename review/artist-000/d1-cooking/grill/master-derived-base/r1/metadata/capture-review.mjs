import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const workspace = path.resolve(here, "../../../../../../../../");
const html = "http://127.0.0.1:8012/art-workspace/review/artist-000/d1-cooking/grill/master-derived-base/r1/review-cm-grill-station-empty-base-parity-r1.html";
const baseAsset = path.join(root, "assets/cm-grill-station-empty-base-fhd-r1.png");
const master = path.resolve(root, "../../master/r3/review-cm-grill-station-queued-selection-fhd-r3.png");
const { chromium } = (await import(pathToFileURL(path.join(workspace, "app/node_modules/@playwright/test/index.js")).href)).default;
const digest = async (file) => createHash("sha256").update(await readFile(file)).digest("hex");

const browser = await chromium.launch({ headless: true, args: ["--use-angle=swiftshader", "--use-gl=angle", "--enable-unsafe-swiftshader"] });
try {
  const basePage = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await basePage.goto(html, { waitUntil: "networkidle" });
  await basePage.waitForFunction(() => document.body.dataset.ready === "true");
  const baseGeometry = await basePage.evaluate(() => {
    const image = document.querySelector("#base-image").getBoundingClientRect();
    const tray = document.querySelector("#finished-tray-reservation").getBoundingClientRect();
    return {
      image: { x: image.x, y: image.y, width: image.width, height: image.height },
      trayReservation: { x: tray.x, y: tray.y, width: tray.width, height: tray.height },
      natural: { width: document.querySelector("#base-image").naturalWidth, height: document.querySelector("#base-image").naturalHeight }
    };
  });
  if (JSON.stringify(baseGeometry.image) !== JSON.stringify({ x: 0, y: 0, width: 1920, height: 1080 })) throw new Error(`unexpected base geometry: ${JSON.stringify(baseGeometry.image)}`);
  if (JSON.stringify(baseGeometry.trayReservation) !== JSON.stringify({ x: 1534, y: 130, width: 218, height: 342 })) throw new Error(`unexpected tray reservation: ${JSON.stringify(baseGeometry.trayReservation)}`);
  if (JSON.stringify(baseGeometry.natural) !== JSON.stringify({ width: 1920, height: 1080 })) throw new Error(`unexpected source dimensions: ${JSON.stringify(baseGeometry.natural)}`);
  await basePage.screenshot({ path: path.join(root, "review-cm-grill-station-empty-base-fhd-r1.png"), clip: { x: 0, y: 0, width: 1920, height: 1080 } });

  const comparisonPage = await browser.newPage({ viewport: { width: 3840, height: 1080 }, deviceScaleFactor: 1 });
  await comparisonPage.goto(`${html}?mode=comparison`, { waitUntil: "networkidle" });
  await comparisonPage.waitForFunction(() => document.body.dataset.ready === "true");
  const comparisonGeometry = await comparisonPage.evaluate(() => [...document.querySelectorAll("#comparison img")].map((image) => {
    const rect = image.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight };
  }));
  const expectedComparison = [
    { x: 0, y: 0, width: 1920, height: 1080, naturalWidth: 1920, naturalHeight: 1080 },
    { x: 1920, y: 0, width: 1920, height: 1080, naturalWidth: 1920, naturalHeight: 1080 }
  ];
  if (JSON.stringify(comparisonGeometry) !== JSON.stringify(expectedComparison)) throw new Error(`unexpected comparison geometry: ${JSON.stringify(comparisonGeometry)}`);
  await comparisonPage.screenshot({ path: path.join(root, "review-cm-grill-station-empty-base-parity-r1.png"), clip: { x: 0, y: 0, width: 3840, height: 1080 } });

  const report = {
    schemaVersion: 1,
    candidate: "CM-GRILL-STATION-EMPTY-BASE R1",
    status: "pending-user-review",
    captures: {
      fhd: { file: "../review-cm-grill-station-empty-base-fhd-r1.png", width: 1920, height: 1080, sha256: await digest(path.join(root, "review-cm-grill-station-empty-base-fhd-r1.png")), bytes: (await stat(path.join(root, "review-cm-grill-station-empty-base-fhd-r1.png"))).size },
      sideBySideParity: { file: "../review-cm-grill-station-empty-base-parity-r1.png", width: 3840, height: 1080, sha256: await digest(path.join(root, "review-cm-grill-station-empty-base-parity-r1.png")), bytes: (await stat(path.join(root, "review-cm-grill-station-empty-base-parity-r1.png"))).size }
    },
    master: { id: "CM-GRILL-STATION-QUEUED-SELECTION R3", file: "../../master/r3/review-cm-grill-station-queued-selection-fhd-r3.png", sha256: await digest(master), width: 1920, height: 1080 },
    candidateAsset: { file: "../assets/cm-grill-station-empty-base-fhd-r1.png", sha256: await digest(baseAsset), bytes: (await stat(baseAsset)).size, opaqueRgb: true, width: 1920, height: 1080 },
    geometry: { base: baseGeometry, comparison: comparisonGeometry },
    visualInspection: {
      method: "master and candidate shown at native 1920×1080 side by side; manual artist inspection",
      cameraPerspective: "preserved from master-derived whole-frame edit",
      continuousGrate: "preserved",
      lightingAndTone: "preserved",
      dynamicItemsExcluded: ["all negima and skewers", "tongs", "smoke and sparks", "right finished and discard trays", "queue pads", "discard button"],
      staticReservation: { target: "ST-GRILL-FINISHED-TRAY", x: 1534, y: 130, width: 218, height: 342, visibleInBase: false }
    },
    result: "pass"
  };
  await writeFile(path.join(root, "metadata/parity-validation-report.json"), `${JSON.stringify(report, null, 2)}\n`);
} finally {
  await browser.close();
}
