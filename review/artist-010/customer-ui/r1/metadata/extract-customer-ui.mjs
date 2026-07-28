import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const revisionDir = path.resolve(scriptDir, "..");
const sourcePath = path.resolve(
  revisionDir,
  "../../customer-layers/r2/layers/40-foreground-ui.png",
);
const sourceBuffer = await readFile(sourcePath);
const sourceDataUrl = `data:image/png;base64,${sourceBuffer.toString("base64")}`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

const extracted = await page.evaluate(async (source) => {
  const image = await new Promise((resolve, reject) => {
    const value = new Image();
    value.onload = () => resolve(value);
    value.onerror = reject;
    value.src = source;
  });
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = 1920;
  sourceCanvas.height = 1080;
  const sourceContext = sourceCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  sourceContext.drawImage(image, 0, 0);
  const sourcePixels = sourceContext.getImageData(0, 0, 1920, 1080);
  const searchWidth = 1600;
  const searchHeight = 350;
  const visited = new Uint8Array(searchWidth * searchHeight);
  const components = [];

  const alphaAt = (x, y) => sourcePixels.data[(y * 1920 + x) * 4 + 3];
  for (let y = 0; y < searchHeight; y += 1) {
    for (let x = 0; x < searchWidth; x += 1) {
      const start = y * searchWidth + x;
      if (visited[start] || alphaAt(x, y) === 0) {
        continue;
      }
      const queueX = [x];
      const queueY = [y];
      visited[start] = 1;
      let cursor = 0;
      let minX = x;
      let minY = y;
      let maxX = x;
      let maxY = y;
      let pixelCount = 0;
      while (cursor < queueX.length) {
        const currentX = queueX[cursor];
        const currentY = queueY[cursor];
        cursor += 1;
        pixelCount += 1;
        minX = Math.min(minX, currentX);
        minY = Math.min(minY, currentY);
        maxX = Math.max(maxX, currentX);
        maxY = Math.max(maxY, currentY);
        for (const [nextX, nextY] of [
          [currentX - 1, currentY],
          [currentX + 1, currentY],
          [currentX, currentY - 1],
          [currentX, currentY + 1],
        ]) {
          if (
            nextX < 0 ||
            nextY < 0 ||
            nextX >= searchWidth ||
            nextY >= searchHeight
          ) {
            continue;
          }
          const next = nextY * searchWidth + nextX;
          if (visited[next] || alphaAt(nextX, nextY) === 0) {
            continue;
          }
          visited[next] = 1;
          queueX.push(nextX);
          queueY.push(nextY);
        }
      }
      if (pixelCount >= 500 && maxX - minX >= 50 && maxY - minY >= 40) {
        components.push({
          minX,
          minY,
          maxX,
          maxY,
          pixelCount,
        });
      }
    }
  }

  components.sort((left, right) => left.minX - right.minX);
  if (components.length !== 4) {
    throw new Error(
      `Expected four customer UI components, found ${components.length}`,
    );
  }
  const ids = [
    "customer-state-considering-visible",
    "customer-state-wait-timer-visible",
    "customer-order-items-visible",
    "customer-state-time-mood-visible",
  ];
  const polygon = (context, points) => {
    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);
    for (const [x, y] of points.slice(1)) {
      context.lineTo(x, y);
    }
    context.closePath();
    context.fill();
  };
  const applyUiSilhouette = (context, index) => {
    context.globalCompositeOperation = "destination-in";
    context.fillStyle = "#ffffff";
    if (index === 0) {
      context.beginPath();
      context.roundRect(8, 18, 67, 43, 19);
      context.moveTo(31, 55);
      context.lineTo(48, 55);
      context.lineTo(39, 69);
      context.closePath();
      context.fill();
    } else if (index === 1) {
      context.beginPath();
      context.moveTo(27, 44);
      for (const [x, y] of [
        [79, 44],
        [95, 57],
        [95, 93],
        [83, 104],
        [27, 104],
        [16, 93],
        [16, 57],
      ]) {
        context.lineTo(x, y);
      }
      context.closePath();
      context.moveTo(108, 32);
      context.arc(87, 32, 21, 0, Math.PI * 2);
      context.fill();
    } else if (index === 2) {
      polygon(context, [
        [10, 18],
        [95, 18],
        [105, 28],
        [105, 62],
        [96, 72],
        [10, 72],
        [1, 63],
        [1, 28],
      ]);
    } else {
      polygon(context, [
        [25, 18],
        [128, 18],
        [140, 28],
        [140, 62],
        [130, 72],
        [25, 72],
        [15, 62],
        [15, 28],
      ]);
    }
    context.globalCompositeOperation = "source-over";
  };
  const assets = [];
  for (let index = 0; index < components.length; index += 1) {
    const component = components[index];
    const pad = 8;
    const x = Math.max(0, component.minX - pad);
    const y = Math.max(0, component.minY - pad);
    const right = Math.min(1920, component.maxX + 1 + pad);
    const bottom = Math.min(1080, component.maxY + 1 + pad);
    const width = right - x;
    const height = bottom - y;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.putImageData(
      sourceContext.getImageData(x, y, width, height),
      0,
      0,
    );
    const originalCropPixels = context.getImageData(0, 0, width, height);
    applyUiSilhouette(context, index);
    const isolatedPixels = context.getImageData(0, 0, width, height);
    let isolatedOpaqueOrPartialPixels = 0;
    for (let offset = 0; offset < isolatedPixels.data.length; offset += 4) {
      if (isolatedPixels.data[offset + 3] > 127) {
        isolatedPixels.data[offset] = originalCropPixels.data[offset];
        isolatedPixels.data[offset + 1] = originalCropPixels.data[offset + 1];
        isolatedPixels.data[offset + 2] = originalCropPixels.data[offset + 2];
        isolatedPixels.data[offset + 3] =
          originalCropPixels.data[offset + 3];
        isolatedOpaqueOrPartialPixels +=
          originalCropPixels.data[offset + 3] > 0 ? 1 : 0;
      } else {
        isolatedPixels.data[offset] = 0;
        isolatedPixels.data[offset + 1] = 0;
        isolatedPixels.data[offset + 2] = 0;
        isolatedPixels.data[offset + 3] = 0;
      }
    }
    context.putImageData(isolatedPixels, 0, 0);
    assets.push({
      id: ids[index],
      x,
      y,
      width,
      height,
      sourceOpaqueOrPartialPixels: isolatedOpaqueOrPartialPixels,
      dataUrl: canvas.toDataURL("image/png"),
    });
  }

  const review = document.createElement("canvas");
  review.width = 1920;
  review.height = 1080;
  const reviewContext = review.getContext("2d");
  const checkerColors = ["#18120f", "#2a211c"];
  const checkerSize = 32;
  for (let y = 0; y < review.height; y += checkerSize) {
    for (let x = 0; x < review.width; x += checkerSize) {
      const checkerIndex =
        (Math.floor(x / checkerSize) + Math.floor(y / checkerSize)) % 2;
      reviewContext.fillStyle = checkerColors[checkerIndex];
      reviewContext.fillRect(x, y, checkerSize, checkerSize);
    }
  }
  const loadedAssets = await Promise.all(
    assets.map(
      (asset) =>
        new Promise((resolve, reject) => {
          const value = new Image();
          value.onload = () => resolve(value);
          value.onerror = reject;
          value.src = asset.dataUrl;
        }),
    ),
  );
  const scale = 3;
  const gap = 90;
  const totalWidth =
    assets.reduce((sum, asset) => sum + asset.width * scale, 0) +
    gap * (assets.length - 1);
  let currentX = Math.round((review.width - totalWidth) / 2);
  const centerY = 540;
  reviewContext.imageSmoothingEnabled = false;
  for (let index = 0; index < assets.length; index += 1) {
    const asset = assets[index];
    const drawWidth = asset.width * scale;
    const drawHeight = asset.height * scale;
    reviewContext.drawImage(
      loadedAssets[index],
      currentX,
      Math.round(centerY - drawHeight / 2),
      drawWidth,
      drawHeight,
    );
    currentX += drawWidth + gap;
  }
  return {
    assets,
    reviewDataUrl: review.toDataURL("image/png"),
    checkerColors,
    checkerSize,
  };
}, sourceDataUrl);

await browser.close();
for (const asset of extracted.assets) {
  await writeFile(
    path.join(revisionDir, "assets", `${asset.id}.png`),
    Buffer.from(asset.dataUrl.split(",")[1], "base64"),
  );
}
await writeFile(
  path.join(revisionDir, "customer-ui-visible-review-fhd-r1.png"),
  Buffer.from(extracted.reviewDataUrl.split(",")[1], "base64"),
);

const outputs = {};
for (const asset of extracted.assets) {
  const file = `assets/${asset.id}.png`;
  const buffer = await readFile(path.join(revisionDir, file));
  outputs[asset.id] = {
    file,
    sourceBounds: {
      x: asset.x,
      y: asset.y,
      width: asset.width,
      height: asset.height,
    },
    sourceOpaqueOrPartialPixels: asset.sourceOpaqueOrPartialPixels,
    sha256: createHash("sha256").update(buffer).digest("hex"),
  };
}
const reviewBuffer = await readFile(
  path.join(revisionDir, "customer-ui-visible-review-fhd-r1.png"),
);
console.log(
  JSON.stringify(
    {
      sourceSha256: createHash("sha256").update(sourceBuffer).digest("hex"),
      method: "deterministic connected-component extraction; generated pixels 0",
      checkerColors: extracted.checkerColors,
      checkerSize: extracted.checkerSize,
      outputs,
      reviewBoard: {
        file: "customer-ui-visible-review-fhd-r1.png",
        sha256: createHash("sha256").update(reviewBuffer).digest("hex"),
        width: 1920,
        height: 1080,
      },
    },
    null,
    2,
  ),
);
