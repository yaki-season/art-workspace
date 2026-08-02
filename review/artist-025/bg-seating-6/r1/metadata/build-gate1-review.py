#!/usr/bin/env python3
"""Build isolated checkerboard boards and print BG-SEATING-6 Gate-1 metrics."""

from collections import deque
import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSET = ROOT / "assets" / "bg-seating-6-r1.png"
REVIEW_FHD = ROOT / "review" / "review-bg-seating-6-isolated-fhd-r1.png"
REVIEW_720 = ROOT / "review" / "review-bg-seating-6-isolated-720-r1.png"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def checkerboard(width: int, height: int, cell: int) -> Image.Image:
    image = Image.new("RGB", (width, height), (224, 224, 224))
    pixels = image.load()
    for y in range(height):
        row = y // cell
        for x in range(width):
            if ((x // cell) + row) % 2:
                pixels[x, y] = (176, 176, 176)
    return image


def build_board(asset: Image.Image, width: int, height: int, out: Path) -> None:
    scale = min(width / asset.width, height / asset.height)
    resized = asset.resize(
        (round(asset.width * scale), round(asset.height * scale)),
        Image.Resampling.NEAREST,
    )
    board = checkerboard(width, height, max(12, round(24 * width / 1920)))
    board.paste(
        resized,
        ((width - resized.width) // 2, (height - resized.height) // 2),
        resized,
    )
    board.save(out, format="PNG", optimize=False)


def connected_components(alpha: Image.Image, threshold: int = 128) -> list[dict]:
    width, height = alpha.size
    values = alpha.load()
    visited = bytearray(width * height)
    components = []
    for y in range(height):
        for x in range(width):
            index = y * width + x
            if visited[index] or values[x, y] < threshold:
                continue
            queue = deque([(x, y)])
            visited[index] = 1
            count = 0
            min_x = max_x = x
            min_y = max_y = y
            while queue:
                cx, cy = queue.popleft()
                count += 1
                min_x = min(min_x, cx)
                max_x = max(max_x, cx)
                min_y = min(min_y, cy)
                max_y = max(max_y, cy)
                for nx, ny in ((cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)):
                    if nx < 0 or nx >= width or ny < 0 or ny >= height:
                        continue
                    neighbor = ny * width + nx
                    if not visited[neighbor] and values[nx, ny] >= threshold:
                        visited[neighbor] = 1
                        queue.append((nx, ny))
            if count >= 1000:
                components.append(
                    {
                        "pixels": count,
                        "bounds": [min_x, min_y, max_x + 1, max_y + 1],
                        "center": [round((min_x + max_x + 1) / 2, 1), round((min_y + max_y + 1) / 2, 1)],
                    }
                )
    return sorted(components, key=lambda component: component["center"][0])


def main() -> None:
    asset = Image.open(ASSET).convert("RGBA")
    build_board(asset, 1920, 1080, REVIEW_FHD)
    build_board(asset, 1280, 720, REVIEW_720)

    pixels = list(asset.getdata())
    alphas = [pixel[3] for pixel in pixels]
    transparent = sum(alpha == 0 for alpha in alphas)
    partial = sum(0 < alpha < 255 for alpha in alphas)
    opaque = sum(alpha == 255 for alpha in alphas)
    green_spill = sum(
        alpha > 0 and green >= red + 35 and green >= blue + 35 and green >= 100
        for red, green, blue, alpha in pixels
    )
    corners = [
        asset.getpixel((0, 0))[3],
        asset.getpixel((asset.width - 1, 0))[3],
        asset.getpixel((0, asset.height - 1))[3],
        asset.getpixel((asset.width - 1, asset.height - 1))[3],
    ]
    alpha_image = asset.getchannel("A")
    components = connected_components(alpha_image)
    centers = [component["center"][0] for component in components]
    gaps = [round(right - left, 1) for left, right in zip(centers, centers[1:])]
    mean_gap = sum(gaps) / len(gaps) if gaps else 0
    max_gap_deviation = max((abs(gap - mean_gap) for gap in gaps), default=0)

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
            "transparentPixels": transparent,
            "partiallyTransparentPixels": partial,
            "opaquePixels": opaque,
            "cornerAlpha": corners,
            "greenSpillPixels": green_spill,
            "nonTransparentBounds": list(alpha_image.getbbox() or (0, 0, 0, 0)),
        },
        "seatDetection": {
            "threshold": 128,
            "largeConnectedComponentCount": len(components),
            "components": components,
            "centerGapsPixels": gaps,
            "meanCenterGapPixels": round(mean_gap, 2),
            "maxGapDeviationPixels": round(max_gap_deviation, 2),
            "maxGapDeviationRatio": round(max_gap_deviation / mean_gap, 4) if mean_gap else None,
        },
        "reviewBoards": [
            {
                "file": str(REVIEW_FHD.relative_to(ROOT)),
                "width": 1920,
                "height": 1080,
                "bytes": REVIEW_FHD.stat().st_size,
                "sha256": sha256(REVIEW_FHD),
            },
            {
                "file": str(REVIEW_720.relative_to(ROOT)),
                "width": 1280,
                "height": 720,
                "bytes": REVIEW_720.stat().st_size,
                "sha256": sha256(REVIEW_720),
            },
        ],
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
