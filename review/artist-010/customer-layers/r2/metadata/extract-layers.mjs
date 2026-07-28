import { chromium } from "playwright";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const reviewDir = path.resolve(scriptDir, "..");
const sourcePath = path.resolve(
  reviewDir,
  "../../../artist-009/customer-screen/r3/customer-service-fhd-r3.png",
);
const customerMaskPath = path.join(
  reviewDir,
  "masks/customers-foreground-mask.png",
);
const foodMaskPath = path.join(
  reviewDir,
  "masks/table-food-foreground-mask.png",
);

const files = {
  background: "layers/00-background.png",
  customers: "layers/10-customers-seats.png",
  counter: "layers/20-single-counter.png",
  food: "layers/30-table-food-drink.png",
  ui: "layers/40-foreground-ui.png",
  recomposite: "customer-service-recomposite-fhd-r2.png",
  reviewBoard: "layer-review-board-fhd-r2.png",
};

const [sourceBuffer, customerMaskBuffer, foodMaskBuffer] = await Promise.all([
  readFile(sourcePath),
  readFile(customerMaskPath),
  readFile(foodMaskPath),
]);
const sourceDataUrl = `data:image/png;base64,${sourceBuffer.toString("base64")}`;
const customerMaskDataUrl = `data:image/png;base64,${customerMaskBuffer.toString("base64")}`;
const foodMaskDataUrl = `data:image/png;base64,${foodMaskBuffer.toString("base64")}`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

const result = await page.evaluate(async ({
  sourceDataUrl,
  customerMaskDataUrl,
  foodMaskDataUrl,
}) => {
  const width = 1920;
  const height = 1080;
  const pixelCount = width * height;

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });

  const makeCanvas = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  };

  const polygon = (context, points) => {
    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);
    for (const [x, y] of points.slice(1)) {
      context.lineTo(x, y);
    }
    context.closePath();
    context.fill();
  };

  const roundedRect = (context, x, y, w, h, radius) => {
    context.beginPath();
    context.roundRect(x, y, w, h, radius);
    context.fill();
  };

  const ellipse = (context, x, y, radiusX, radiusY) => {
    context.beginPath();
    context.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
    context.fill();
  };

  const applyBinaryMask = async (canvas, dataUrl) => {
    const image = await loadImage(dataUrl);
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0, width, height);
    const pixels = context.getImageData(0, 0, width, height);
    for (let offset = 0; offset < pixels.data.length; offset += 4) {
      const alpha = pixels.data[offset] >= 128 ? 255 : 0;
      pixels.data[offset] = 255;
      pixels.data[offset + 1] = 255;
      pixels.data[offset + 2] = 255;
      pixels.data[offset + 3] = alpha;
    }
    context.putImageData(pixels, 0, 0);
  };

  const [source, foodProtectionMask] = await Promise.all([
    loadImage(sourceDataUrl),
    loadImage(foodMaskDataUrl),
  ]);
  const foodProtectionCanvas = makeCanvas();
  const foodProtectionContext = foodProtectionCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  foodProtectionContext.drawImage(foodProtectionMask, 0, 0, width, height);
  const foodProtectionPixels = foodProtectionContext.getImageData(
    0,
    0,
    width,
    height,
  );
  const sourceCanvas = makeCanvas();
  const sourceContext = sourceCanvas.getContext("2d", { willReadFrequently: true });
  sourceContext.drawImage(source, 0, 0, width, height);
  const originalPixels = sourceContext.getImageData(0, 0, width, height);
  const editedPixels = new ImageData(
    new Uint8ClampedArray(originalPixels.data),
    width,
    height,
  );
  const badgeRects = [
    { x: 180, y: 550, w: 98, h: 100, matSourceX: 290 },
    { x: 448, y: 550, w: 119, h: 100, matSourceX: 580 },
    { x: 727, y: 550, w: 112, h: 100, matSourceX: 850 },
    { x: 1078, y: 550, w: 132, h: 100, matSourceX: 1200 },
    { x: 1370, y: 550, w: 118, h: 100, matSourceX: 1300 },
    { x: 1630, y: 550, w: 119, h: 100, matSourceX: 1760 },
  ];
  const matSampleWidth = 48;
  const woodSampleX = 40;
  const woodSampleWidth = 64;
  const matBottomY = 600;
  for (const rect of badgeRects) {
    for (let y = rect.y; y < rect.y + rect.h; y += 1) {
      const useMatTexture = y < matBottomY;
      const sampleWidth = useMatTexture ? matSampleWidth : woodSampleWidth;
      const sampleBaseX = useMatTexture ? rect.matSourceX : woodSampleX;
      const sampleMean = [0, 0, 0];
      const leftMean = [0, 0, 0];
      const rightMean = [0, 0, 0];
      for (let sample = 0; sample < sampleWidth; sample += 1) {
        const sampleOffset = (y * width + sampleBaseX + sample) * 4;
        for (let channel = 0; channel < 3; channel += 1) {
          sampleMean[channel] += originalPixels.data[sampleOffset + channel];
        }
      }
      const borderSampleWidth = 10;
      for (let sample = 0; sample < borderSampleWidth; sample += 1) {
        const leftOffset = (y * width + rect.x - 18 + sample) * 4;
        const rightOffset = (y * width + rect.x + rect.w + 8 + sample) * 4;
        for (let channel = 0; channel < 3; channel += 1) {
          leftMean[channel] += originalPixels.data[leftOffset + channel];
          rightMean[channel] += originalPixels.data[rightOffset + channel];
        }
      }
      for (let channel = 0; channel < 3; channel += 1) {
        sampleMean[channel] /= sampleWidth;
        leftMean[channel] /= borderSampleWidth;
        rightMean[channel] /= borderSampleWidth;
      }
      for (let x = rect.x; x < rect.x + rect.w; x += 1) {
        const localX = x - rect.x;
        const block = Math.floor(localX / sampleWidth);
        let sampleLocalX = localX % sampleWidth;
        if (block % 2 === 1) {
          sampleLocalX = sampleWidth - 1 - sampleLocalX;
        }
        const sampleX = sampleBaseX + sampleLocalX;
        const sourceOffset = (y * width + sampleX) * 4;
        const targetOffset = (y * width + x) * 4;
        const horizontalT = (localX + 0.5) / rect.w;
        const edgeDistance = Math.min(localX, rect.w - 1 - localX, y - rect.y);
        const blend = Math.min(1, Math.max(0, edgeDistance / 8));
        for (let channel = 0; channel < 3; channel += 1) {
          const localBase =
            leftMean[channel] * (1 - horizontalT) +
            rightMean[channel] * horizontalT;
          const texture =
            (originalPixels.data[sourceOffset + channel] - sampleMean[channel]) * 0.62;
          const replacement = Math.max(0, Math.min(255, localBase + texture));
          editedPixels.data[targetOffset + channel] = Math.round(
            originalPixels.data[targetOffset + channel] * (1 - blend) +
            replacement * blend,
          );
        }
        editedPixels.data[targetOffset + 3] = originalPixels.data[targetOffset + 3];
      }
    }
  }
  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const offset = pixel * 4;
    if (foodProtectionPixels.data[offset] < 128) {
      continue;
    }
    for (let channel = 0; channel < 4; channel += 1) {
      editedPixels.data[offset + channel] = originalPixels.data[offset + channel];
    }
  }
  sourceContext.putImageData(editedPixels, 0, 0);
  const sourcePixels = sourceContext.getImageData(0, 0, width, height);
  let changedPixels = 0;
  let outsideChangedPixels = 0;
  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const offset = pixel * 4;
    let differs = false;
    for (let channel = 0; channel < 4; channel += 1) {
      differs ||= originalPixels.data[offset + channel] !== sourcePixels.data[offset + channel];
    }
    if (!differs) {
      continue;
    }
    changedPixels += 1;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    const insideBadgeRect = badgeRects.some(
      (rect) =>
        x >= rect.x &&
        x < rect.x + rect.w &&
        y >= rect.y &&
        y < rect.y + rect.h,
    );
    outsideChangedPixels += insideBadgeRect ? 0 : 1;
  }

  const rawMasks = {
    customers: makeCanvas(),
    counter: makeCanvas(),
    food: makeCanvas(),
    ui: makeCanvas(),
  };

  for (const mask of Object.values(rawMasks)) {
    const context = mask.getContext("2d");
    context.fillStyle = "#ffffff";
    context.imageSmoothingEnabled = false;
  }

  await Promise.all([
    applyBinaryMask(rawMasks.customers, customerMaskDataUrl),
    applyBinaryMask(rawMasks.food, foodMaskDataUrl),
  ]);

  const customerContext = rawMasks.customers.getContext("2d");
  polygon(customerContext, [
    [1579, 516],
    [1583, 421],
    [1595, 408],
    [1789, 408],
    [1801, 422],
    [1804, 516],
  ]);

  const counterContext = rawMasks.counter.getContext("2d");
  polygon(counterContext, [
    [0, 468],
    [140, 468],
    [160, 490],
    [350, 500],
    [420, 510],
    [650, 505],
    [900, 510],
    [1150, 508],
    [1400, 510],
    [1550, 505],
    [1920, 505],
    [1920, 650],
    [0, 650],
  ]);

  const uiContext = rawMasks.ui.getContext("2d");
  uiContext.fillRect(0, 650, width, height - 650);
  const uiRects = [
    [1652, 14, 112, 112, 12],
    [1770, 14, 112, 112, 12],
    [267, 173, 76, 62, 22],
    [774, 150, 107, 105, 20],
    [1085, 163, 128, 70, 20],
    [1390, 177, 143, 70, 20],
  ];
  for (const [x, y, w, h, radius] of uiRects) {
    roundedRect(uiContext, x, y, w, h, radius);
  }
  ellipse(uiContext, 850, 176, 23, 23);
  ellipse(uiContext, 810, 208, 38, 38);

  const masks = {};
  for (const [id, canvas] of Object.entries(rawMasks)) {
    masks[id] = canvas
      .getContext("2d", { willReadFrequently: true })
      .getImageData(0, 0, width, height).data;
  }

  const layerOrder = ["background", "customers", "counter", "food", "ui"];
  const layerPixels = Object.fromEntries(
    layerOrder.map((id) => [id, new Uint8ClampedArray(sourcePixels.data.length)]),
  );
  const coverage = Object.fromEntries(layerOrder.map((id) => [id, 0]));

  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const offset = pixel * 4;
    let layer = "background";
    if (masks.ui[offset + 3] > 0) {
      layer = "ui";
    } else if (masks.food[offset + 3] > 0) {
      layer = "food";
    } else if (masks.customers[offset + 3] > 0) {
      layer = "customers";
    } else if (masks.counter[offset + 3] > 0) {
      layer = "counter";
    }

    const target = layerPixels[layer];
    target[offset] = sourcePixels.data[offset];
    target[offset + 1] = sourcePixels.data[offset + 1];
    target[offset + 2] = sourcePixels.data[offset + 2];
    target[offset + 3] = sourcePixels.data[offset + 3];
    coverage[layer] += 1;
  }

  const layerCanvases = {};
  const dataUrls = {};
  for (const id of layerOrder) {
    const canvas = makeCanvas();
    canvas
      .getContext("2d")
      .putImageData(new ImageData(layerPixels[id], width, height), 0, 0);
    layerCanvases[id] = canvas;
    dataUrls[id] = canvas.toDataURL("image/png");
  }

  const recompositeCanvas = makeCanvas();
  const recompositeContext = recompositeCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  for (const id of layerOrder) {
    recompositeContext.drawImage(layerCanvases[id], 0, 0);
  }
  const recompositePixels = recompositeContext.getImageData(0, 0, width, height);
  let differentPixels = 0;
  let maxChannelDelta = 0;
  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const offset = pixel * 4;
    let differs = false;
    for (let channel = 0; channel < 4; channel += 1) {
      const delta = Math.abs(
        sourcePixels.data[offset + channel] - recompositePixels.data[offset + channel],
      );
      maxChannelDelta = Math.max(maxChannelDelta, delta);
      differs ||= delta !== 0;
    }
    differentPixels += differs ? 1 : 0;
  }

  dataUrls.recomposite = recompositeCanvas.toDataURL("image/png");

  const boardCanvas = makeCanvas();
  const boardContext = boardCanvas.getContext("2d");
  boardContext.fillStyle = "#100b08";
  boardContext.fillRect(0, 0, width, height);
  boardContext.fillStyle = "#e7c98f";
  boardContext.font = "700 30px Apple SD Gothic Neo, sans-serif";
  boardContext.fillText("ARTIST 010 · 손님 화면 레이어 검수 R2", 28, 43);
  boardContext.fillStyle = "#9f8562";
  boardContext.font = "18px Apple SD Gothic Neo, sans-serif";
  boardContext.fillText(
    "아래 6개 패널의 분리 범위와 최종 재합성을 함께 검수합니다.",
    610,
    42,
  );

  const panelDefinitions = [
    ["01 배경", layerCanvases.background, true],
    ["02 손님·좌석", layerCanvases.customers, true],
    ["03 단일 카운터", layerCanvases.counter, true],
    ["04 테이블 음식·음료", layerCanvases.food, true],
    ["05 전경·UI", layerCanvases.ui, true],
    ["06 최종 재합성 · 접시 하단 아이콘 제거", recompositeCanvas, false],
  ];
  const panelWidth = 612;
  const panelHeight = 374;
  const imageWidth = 596;
  const imageHeight = 335;
  const panelGap = 18;
  const panelX = [24, 24 + panelWidth + panelGap, 24 + (panelWidth + panelGap) * 2];
  const panelY = [70, 466];
  for (let index = 0; index < panelDefinitions.length; index += 1) {
    const [label, canvas, transparent] = panelDefinitions[index];
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = panelX[column];
    const y = panelY[row];
    boardContext.fillStyle = "#26180f";
    boardContext.fillRect(x, y, panelWidth, panelHeight);
    boardContext.strokeStyle = index === 5 ? "#d99b43" : "#684323";
    boardContext.lineWidth = index === 5 ? 4 : 2;
    boardContext.strokeRect(x + 1, y + 1, panelWidth - 2, panelHeight - 2);
    boardContext.fillStyle = index === 5 ? "#ffd78e" : "#dfc18c";
    boardContext.font = "700 20px Apple SD Gothic Neo, sans-serif";
    boardContext.fillText(label, x + 12, y + 27);
    const imageX = x + 8;
    const imageY = y + 34;
    if (transparent) {
      const checkerSize = 12;
      for (let checkY = 0; checkY < imageHeight; checkY += checkerSize) {
        for (let checkX = 0; checkX < imageWidth; checkX += checkerSize) {
          boardContext.fillStyle =
            (Math.floor(checkX / checkerSize) + Math.floor(checkY / checkerSize)) % 2 === 0
              ? "#30271f"
              : "#181411";
          boardContext.fillRect(
            imageX + checkX,
            imageY + checkY,
            checkerSize,
            checkerSize,
          );
        }
      }
    }
    boardContext.imageSmoothingEnabled = false;
    boardContext.drawImage(
      canvas,
      0,
      0,
      width,
      height,
      imageX,
      imageY,
      imageWidth,
      imageHeight,
    );
  }

  boardContext.fillStyle = "#1e140e";
  boardContext.fillRect(24, 856, 1872, 198);
  boardContext.strokeStyle = "#684323";
  boardContext.lineWidth = 2;
  boardContext.strokeRect(25, 857, 1870, 196);
  boardContext.fillStyle = "#f0cc8a";
  boardContext.font = "700 23px Apple SD Gothic Neo, sans-serif";
  boardContext.fillText("검수 기준", 46, 893);
  boardContext.fillStyle = "#d5bb8c";
  boardContext.font = "19px Apple SD Gothic Neo, sans-serif";
  boardContext.fillText(
    "1. 접시 아래 상시 아이콘 6개가 없어야 합니다. 정리 아이콘은 실제 정리 필요 상태에서만 별도 UI로 표시합니다.",
    46,
    928,
  );
  boardContext.fillText(
    "2. 손님·카운터·음식 alpha에 다른 범주의 창문·카메라·주문표 조각이 따라붙지 않아야 합니다.",
    46,
    965,
  );
  boardContext.fillText(
    "3. 최종 화면은 인물·음식·구도·따뜻한 픽셀 화풍·하단 스테이션 전환 버튼을 그대로 유지해야 합니다.",
    46,
    1002,
  );
  boardContext.fillStyle = "#9f8562";
  boardContext.font = "16px Apple SD Gothic Neo, sans-serif";
  boardContext.fillText(
    `변경 픽셀 ${changedPixels.toLocaleString("ko-KR")} · 지정 영역 밖 변경 ${outsideChangedPixels} · 생성 모델 사용 없음`,
    46,
    1033,
  );
  dataUrls.reviewBoard = boardCanvas.toDataURL("image/png");

  return {
    badgeRects,
    changedPixels,
    outsideChangedPixels,
    coverage,
    dataUrls,
    differentPixels,
    maxChannelDelta,
    pixelCount,
    width,
    height,
  };
}, {
  sourceDataUrl,
  customerMaskDataUrl,
  foodMaskDataUrl,
});

const fileHashes = {};
for (const [id, relativePath] of Object.entries(files)) {
  const dataUrl = result.dataUrls[id];
  const buffer = Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64");
  await writeFile(path.join(reviewDir, relativePath), buffer);
  fileHashes[id] = createHash("sha256").update(buffer).digest("hex");
}

const sourceHash = createHash("sha256").update(sourceBuffer).digest("hex");
const extractionReport = {
  approvalStatus: "approved-by-user",
  approvedAt: "2026-07-26",
  approvalScope: "five-visible-cutout-layers-and-r2-recomposition",
  source: {
    file: "../../../artist-009/customer-screen/r3/customer-service-fhd-r3.png",
    sha256: sourceHash,
    width: result.width,
    height: result.height,
  },
  method: "deterministic-visible-pixel-partition",
  generatedPixels: 0,
  modelInpaintedPixels: 0,
  localTextureReplacement: {
    method: "deterministic-local-texture-reconstruction",
    removedSeatPlateIconCount: 6,
    changedPixels: result.changedPixels,
    outsideChangedPixels: result.outsideChangedPixels,
    rectangles: result.badgeRects,
  },
  hiddenSurfacePolicy:
    "non-icon-hidden-surfaces-remain-transparent-no-model-inpainting",
  masks: {
    customers: {
      file: "masks/customers-foreground-mask.png",
      sha256: createHash("sha256").update(customerMaskBuffer).digest("hex"),
      method: "Apple Vision foreground instance mask",
    },
    food: {
      file: "masks/table-food-foreground-mask.png",
      sha256: createHash("sha256").update(foodMaskBuffer).digest("hex"),
      method: "Apple Vision foreground instance masks from seat contact crops",
    },
  },
  drawOrder: ["background", "customers", "counter", "food", "ui"],
  outputs: Object.fromEntries(
    Object.entries(files).map(([id, file]) => [
      id,
      {
        file,
        sha256: fileHashes[id],
        opaquePixelCount: result.coverage[id] ?? result.pixelCount,
      },
    ]),
  ),
  comparison: {
    target: "corrected-source-to-recomposition",
    pixelCount: result.pixelCount,
    differentPixels: result.differentPixels,
    maxChannelDelta: result.maxChannelDelta,
  },
};

await writeFile(
  path.join(scriptDir, "extraction-report.json"),
  `${JSON.stringify(extractionReport, null, 2)}\n`,
);
await browser.close();

if (result.differentPixels !== 0 || result.maxChannelDelta !== 0) {
  throw new Error("Recomposition differs from the corrected source.");
}
if (result.outsideChangedPixels !== 0) {
  throw new Error("Seat icon removal changed pixels outside the six edit rectangles.");
}

console.log(JSON.stringify(extractionReport, null, 2));
