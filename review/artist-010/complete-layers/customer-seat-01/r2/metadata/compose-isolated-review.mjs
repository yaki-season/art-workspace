import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const revisionDir = path.resolve(scriptDir, "..");
const completedPath = path.join(
  revisionDir,
  "customer-seat-01-complete-fhd-r2.png",
);
const reviewPath = path.join(
  revisionDir,
  "customer-seat-01-review-fhd-r2.png",
);
const completed = await readFile(completedPath);
const completedDataUrl = `data:image/png;base64,${completed.toString("base64")}`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

const reviewDataUrl = await page.evaluate(async (source) => {
  const image = await new Promise((resolve, reject) => {
    const value = new Image();
    value.onload = () => resolve(value);
    value.onerror = reject;
    value.src = source;
  });
  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = 1080;
  const context = canvas.getContext("2d");
  const colors = ["#18120f", "#2a211c"];
  const cellSize = 32;
  for (let y = 0; y < canvas.height; y += cellSize) {
    for (let x = 0; x < canvas.width; x += cellSize) {
      const index = (Math.floor(x / cellSize) + Math.floor(y / cellSize)) % 2;
      context.fillStyle = colors[index];
      context.fillRect(x, y, cellSize, cellSize);
    }
  }
  context.imageSmoothingEnabled = false;
  context.drawImage(image, 0, 0);
  return canvas.toDataURL("image/png");
}, completedDataUrl);

await browser.close();
await writeFile(reviewPath, Buffer.from(reviewDataUrl.split(",")[1], "base64"));
