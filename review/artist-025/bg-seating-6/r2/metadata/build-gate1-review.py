#!/usr/bin/env python3
"""Build BG-SEATING-6 R2 isolated/context boards and print Gate-1 metrics."""

from collections import deque
import hashlib
import json
from pathlib import Path

from PIL import Image


REPO = Path(__file__).resolve().parents[6]
ROOT = Path(__file__).resolve().parents[1]
ASSET = ROOT / "assets/bg-seating-6-r2.png"
BACKGROUND = REPO / "app/public/assets/core/customer/background-complete-r3-b1.png"
COUNTER = REPO / "app/public/assets/core/customer/service-table-complete-r1-b1.png"
TSUKIOKA = REPO / "app/public/assets/core/customer/d1-tsukioka-waiting-r2-b1.png"
ISOLATED_FHD = ROOT / "review/review-bg-seating-6-isolated-fhd-r2.png"
ISOLATED_720 = ROOT / "review/review-bg-seating-6-isolated-720-r2.png"
CONTEXT_FHD = ROOT / "review/context-bg-seating-6-fhd-r2.png"
CONTEXT_720 = ROOT / "review/context-bg-seating-6-720-r2.png"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def checkerboard(width: int, height: int, cell: int) -> Image.Image:
    image = Image.new("RGB", (width, height))
    pixels = image.load()
    for y in range(height):
        for x in range(width):
            pixels[x, y] = (224, 224, 224) if ((x // cell) + (y // cell)) % 2 == 0 else (176, 176, 176)
    return image


def isolated_board(asset: Image.Image, width: int, height: int, out: Path) -> None:
    scale = min(width / asset.width, height / asset.height)
    resized = asset.resize((round(asset.width * scale), round(asset.height * scale)), Image.Resampling.NEAREST)
    board = checkerboard(width, height, max(12, round(24 * width / 1920)))
    board.paste(resized, ((width - resized.width) // 2, (height - resized.height) // 2), resized)
    board.save(out, format="PNG", optimize=False)


def components(alpha: Image.Image, threshold: int = 128) -> list[dict]:
    width, height = alpha.size
    pixels = alpha.load()
    visited = bytearray(width * height)
    found = []
    for y in range(height):
        for x in range(width):
            index = y * width + x
            if visited[index] or pixels[x, y] < threshold:
                continue
            queue = deque([(x, y)])
            visited[index] = 1
            count = 0
            min_x = max_x = x
            min_y = max_y = y
            while queue:
                cx, cy = queue.popleft()
                count += 1
                min_x, max_x = min(min_x, cx), max(max_x, cx)
                min_y, max_y = min(min_y, cy), max(max_y, cy)
                for nx, ny in ((cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)):
                    if 0 <= nx < width and 0 <= ny < height:
                        neighbor = ny * width + nx
                        if not visited[neighbor] and pixels[nx, ny] >= threshold:
                            visited[neighbor] = 1
                            queue.append((nx, ny))
            if count >= 500:
                found.append({
                    "pixels": count,
                    "bounds": [min_x, min_y, max_x + 1, max_y + 1],
                    "center": [round((min_x + max_x + 1) / 2, 1), round((min_y + max_y + 1) / 2, 1)],
                })
    return sorted(found, key=lambda item: item["center"][0])


def main() -> None:
    asset = Image.open(ASSET).convert("RGBA")
    isolated_board(asset, 1920, 1080, ISOLATED_FHD)
    isolated_board(asset, 1280, 720, ISOLATED_720)

    detected = components(asset.getchannel("A"))
    first_x = detected[0]["center"][0]
    last_x = detected[-1]["center"][0]
    scale = (1710 - 210) / (last_x - first_x)
    x = round(210 - first_x * scale)
    y = round(410 - detected[0]["bounds"][1] * scale)
    resized = asset.resize((round(asset.width * scale), round(asset.height * scale)), Image.Resampling.NEAREST)

    context = Image.open(BACKGROUND).convert("RGBA")
    context.alpha_composite(resized, (x, y))
    context.alpha_composite(Image.open(TSUKIOKA).convert("RGBA"), (0, 0))
    context.alpha_composite(Image.open(COUNTER).convert("RGBA"), (0, 0))
    context.convert("RGB").save(CONTEXT_FHD, format="PNG", optimize=False)
    context.convert("RGB").resize((1280, 720), Image.Resampling.NEAREST).save(CONTEXT_720, format="PNG", optimize=False)

    rgba = list(asset.getdata())
    alphas = [pixel[3] for pixel in rgba]
    green_spill = sum(
        alpha > 0 and green >= red + 35 and green >= blue + 35 and green >= 100
        for red, green, blue, alpha in rgba
    )
    centers = [item["center"][0] for item in detected]
    gaps = [round(right - left, 1) for left, right in zip(centers, centers[1:])]
    outputs = []
    for path in (ISOLATED_FHD, ISOLATED_720, CONTEXT_FHD, CONTEXT_720):
        image = Image.open(path)
        outputs.append({
            "file": str(path.relative_to(ROOT)),
            "width": image.width,
            "height": image.height,
            "bytes": path.stat().st_size,
            "sha256": sha256(path),
        })
    result = {
        "asset": {
            "file": str(ASSET.relative_to(ROOT)),
            "mode": asset.mode,
            "width": asset.width,
            "height": asset.height,
            "bytes": ASSET.stat().st_size,
            "sha256": sha256(ASSET),
        },
        "alpha": {
            "min": min(alphas),
            "max": max(alphas),
            "transparentPixels": sum(value == 0 for value in alphas),
            "partiallyTransparentPixels": sum(0 < value < 255 for value in alphas),
            "opaquePixels": sum(value == 255 for value in alphas),
            "cornerAlpha": [asset.getpixel(point)[3] for point in ((0, 0), (asset.width - 1, 0), (0, asset.height - 1), (asset.width - 1, asset.height - 1))],
            "greenSpillPixels": green_spill,
            "nonTransparentBounds": list(asset.getchannel("A").getbbox() or (0, 0, 0, 0)),
        },
        "seatDetection": {
            "threshold": 128,
            "largeConnectedComponentCount": len(detected),
            "components": detected,
            "centerGapsPixels": gaps,
        },
        "contextTransform": {
            "scale": round(scale, 8),
            "x": x,
            "y": y,
            "mappedCentersFhdX": [round(x + center * scale, 1) for center in centers],
            "mappedVisibleBoundsFhd": [
                round(x + 70 * scale),
                round(y + 464 * scale),
                round(x + 1601 * scale),
                round(y + 533 * scale),
            ],
            "targetCounterTopNearY": 500,
        },
        "reviewOutputs": outputs,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
