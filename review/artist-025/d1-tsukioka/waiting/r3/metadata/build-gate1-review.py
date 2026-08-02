#!/usr/bin/env python3
"""Normalize furniture-free Tsukioka and build isolated/context Gate-1 boards."""

from collections import deque
import hashlib
import json
from pathlib import Path

from PIL import Image


REPO = Path(__file__).resolve().parents[7]
ROOT = Path(__file__).resolve().parents[1]
ALPHA_SOURCE = ROOT / "source/tsukioka-waiting-furniture-free-alpha-source-r3.png"
ASSET = ROOT / "assets/d1-tsukioka-waiting-r3.png"
BACKGROUND = REPO / "app/public/assets/core/customer/background-complete-r3-b1.png"
COUNTER = REPO / "app/public/assets/core/customer/service-table-complete-r1-b1.png"
SEATS = REPO / "art-workspace/review/artist-025/bg-seating-6/r2/assets/bg-seating-6-r2.png"
R2_CHROMA = REPO / "art-workspace/review/artist-000/d1-customer-order/complete-layers/d1-tsukioka/waiting/r2/source/tsukioka-waiting-chroma-source-r2.png"
ISOLATED_FHD = ROOT / "review/review-d1-tsukioka-waiting-isolated-fhd-r3.png"
ISOLATED_720 = ROOT / "review/review-d1-tsukioka-waiting-isolated-720-r3.png"
CONTEXT_FHD = ROOT / "review/context-d1-tsukioka-waiting-fhd-r3.png"
CONTEXT_720 = ROOT / "review/context-d1-tsukioka-waiting-720-r3.png"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def checkerboard(width: int, height: int, cell: int) -> Image.Image:
    image = Image.new("RGB", (width, height))
    pixels = image.load()
    for y in range(height):
        for x in range(width):
            pixels[x, y] = (224, 224, 224) if ((x // cell) + (y // cell)) % 2 == 0 else (176, 176, 176)
    return image


def large_components(alpha: Image.Image, threshold: int = 128) -> list[dict]:
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
                })
    return sorted(found, key=lambda item: item["pixels"], reverse=True)


def main() -> None:
    source = Image.open(ALPHA_SOURCE).convert("RGBA")
    source_bbox = source.getchannel("A").getbbox()
    if source_bbox != (251, 207, 692, 1387):
        raise RuntimeError(f"unexpected R3 alpha source bbox: {source_bbox}")

    # R2 source bbox (chair included) maps to approved FHD bbox x944/y215/w283/h690.
    # Apply the exact same source-space transform to the furniture-free body.
    r2_source_bbox = (229, 207, 712, 1387)
    scale_x = 283 / (r2_source_bbox[2] - r2_source_bbox[0])
    scale_y = 690 / (r2_source_bbox[3] - r2_source_bbox[1])
    target_x = round(944 + (source_bbox[0] - r2_source_bbox[0]) * scale_x)
    target_y = round(215 + (source_bbox[1] - r2_source_bbox[1]) * scale_y)
    target_width = round((source_bbox[2] - source_bbox[0]) * scale_x)
    target_height = round((source_bbox[3] - source_bbox[1]) * scale_y)

    cropped = source.crop(source_bbox).resize((target_width, target_height), Image.Resampling.NEAREST)
    normalized = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    normalized.alpha_composite(cropped, (target_x, target_y))
    normalized.save(ASSET, format="PNG", optimize=False)

    for width, height, out in ((1920, 1080, ISOLATED_FHD), (1280, 720, ISOLATED_720)):
        board = checkerboard(width, height, max(12, round(24 * width / 1920)))
        display = normalized if width == 1920 else normalized.resize((1280, 720), Image.Resampling.NEAREST)
        board.paste(display, (0, 0), display)
        board.save(out, format="PNG", optimize=False)

    seats = Image.open(SEATS).convert("RGBA")
    seats_scale = (1710 - 210) / (1495.5 - 176.0)
    seats_x = round(210 - 176.0 * seats_scale)
    seats_y = round(410 - 464 * seats_scale)
    seats = seats.resize((round(seats.width * seats_scale), round(seats.height * seats_scale)), Image.Resampling.NEAREST)
    context = Image.open(BACKGROUND).convert("RGBA")
    context.alpha_composite(seats, (seats_x, seats_y))
    context.alpha_composite(normalized, (0, 0))
    context.alpha_composite(Image.open(COUNTER).convert("RGBA"), (0, 0))
    context.convert("RGB").save(CONTEXT_FHD, format="PNG", optimize=False)
    context.convert("RGB").resize((1280, 720), Image.Resampling.NEAREST).save(CONTEXT_720, format="PNG", optimize=False)

    pixels = list(normalized.getdata())
    alpha = normalized.getchannel("A")
    alpha_values = [pixel[3] for pixel in pixels]
    magenta_spill = sum(
        a > 0 and r >= g + 35 and b >= g + 35 and min(r, b) >= 100
        for r, g, b, a in pixels
    )

    original = Image.open(R2_CHROMA).convert("RGB")
    edited = source.load()
    original_pixels = original.load()
    differences = []
    for y in range(source.height):
        for x in range(source.width):
            r, g, b, a = edited[x, y]
            if a >= 128:
                old_r, old_g, old_b = original_pixels[x, y]
                differences.append((abs(r - old_r) + abs(g - old_g) + abs(b - old_b)) / 3)
    differences.sort()

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
        "normalization": {
            "sourceBbox": list(source_bbox),
            "r2SourceBbox": list(r2_source_bbox),
            "scaleX": round(scale_x, 8),
            "scaleY": round(scale_y, 8),
            "targetBboxFhd": [target_x, target_y, target_x + target_width, target_y + target_height],
            "method": "same R2 source-to-FHD transform; nearest-neighbor; no aspect redesign",
        },
        "asset": {
            "file": str(ASSET.relative_to(ROOT)),
            "mode": normalized.mode,
            "width": normalized.width,
            "height": normalized.height,
            "bytes": ASSET.stat().st_size,
            "sha256": sha256(ASSET),
            "alphaBbox": list(alpha.getbbox() or (0, 0, 0, 0)),
        },
        "alpha": {
            "min": min(alpha_values),
            "max": max(alpha_values),
            "transparentPixels": sum(value == 0 for value in alpha_values),
            "partiallyTransparentPixels": sum(0 < value < 255 for value in alpha_values),
            "opaquePixels": sum(value == 255 for value in alpha_values),
            "cornerAlpha": [normalized.getpixel(point)[3] for point in ((0, 0), (1919, 0), (0, 1079), (1919, 1079))],
            "magentaSpillPixels": magenta_spill,
            "largeConnectedComponents": large_components(alpha),
        },
        "identityPixelComparison": {
            "scope": "R3 alpha>=128 pixels compared at identical R2 source coordinates",
            "pixels": len(differences),
            "meanAbsoluteRgbDelta": round(sum(differences) / len(differences), 4),
            "medianAbsoluteRgbDelta": round(differences[len(differences) // 2], 4),
            "p95AbsoluteRgbDelta": round(differences[int(len(differences) * 0.95)], 4),
        },
        "reviewOutputs": outputs,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
