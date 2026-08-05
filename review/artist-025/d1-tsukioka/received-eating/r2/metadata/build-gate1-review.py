#!/usr/bin/env python3
"""Normalize the two furniture-free received/eating frames and build Gate-1 evidence."""

from collections import deque
import hashlib
import json
from pathlib import Path

from PIL import Image


REPO = Path(__file__).resolve().parents[7]
ROOT = Path(__file__).resolve().parents[1]
BACKGROUND = REPO / "app/public/assets/core/customer/background-complete-r3-b1.png"
COUNTER = REPO / "app/public/assets/core/customer/service-table-complete-r1-b1.png"
SEATS = REPO / "art-workspace/review/artist-025/bg-seating-6/r2/assets/bg-seating-6-r2.png"
FRAMES = (
    {
        "action": "eat-negima",
        "alpha": ROOT / "source/tsukioka-eat-negima-furniture-free-alpha-source-r2.png",
        "target": REPO / "art-workspace/review/artist-000/d1-customer-order/complete-layers/d1-tsukioka/received-eating/r1/source/tsukioka-eating-negima-chroma-source-r1.png",
        "expected_bbox": (216, 216, 688, 1387),
    },
    {
        "action": "drink-draft-beer",
        "alpha": ROOT / "source/tsukioka-drink-draft-beer-furniture-free-alpha-source-r2.png",
        "target": REPO / "art-workspace/review/artist-000/d1-customer-order/complete-layers/d1-tsukioka/received-eating/r1/source/tsukioka-drinking-beer-chroma-source-r1.png",
        "expected_bbox": (201, 209, 692, 1387),
    },
)


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
                found.append({"pixels": count, "bounds": [min_x, min_y, max_x + 1, max_y + 1]})
    return sorted(found, key=lambda item: item["pixels"], reverse=True)


def output_record(path: Path) -> dict:
    image = Image.open(path)
    return {
        "file": str(path.relative_to(ROOT)),
        "width": image.width,
        "height": image.height,
        "bytes": path.stat().st_size,
        "sha256": sha256(path),
    }


def main() -> None:
    background = Image.open(BACKGROUND).convert("RGBA")
    counter = Image.open(COUNTER).convert("RGBA")
    seats = Image.open(SEATS).convert("RGBA")
    seats_scale = (1710 - 210) / (1495.5 - 176.0)
    seats_x = round(210 - 176.0 * seats_scale)
    seats_y = round(410 - 464 * seats_scale)
    seats = seats.resize((round(seats.width * seats_scale), round(seats.height * seats_scale)), Image.Resampling.NEAREST)

    report = {"canonical": {"centerXFhd": 1086, "topYFhd": 215, "heightFhd": 690}, "frames": []}
    for frame in FRAMES:
        action = frame["action"]
        source = Image.open(frame["alpha"]).convert("RGBA")
        bbox = source.getchannel("A").getbbox()
        if bbox != frame["expected_bbox"]:
            raise RuntimeError(f"unexpected {action} source bbox: {bbox}")

        target_height = 690
        target_width = round((bbox[2] - bbox[0]) * target_height / (bbox[3] - bbox[1]))
        target_x = round(1086 - target_width / 2)
        target_y = 215
        crop = source.crop(bbox).resize((target_width, target_height), Image.Resampling.NEAREST)
        normalized = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
        normalized.alpha_composite(crop, (target_x, target_y))

        asset = ROOT / f"assets/d1-tsukioka-received-eating-{action}-r2.png"
        isolated_fhd = ROOT / f"review/review-d1-tsukioka-received-eating-{action}-isolated-fhd-r2.png"
        isolated_720 = ROOT / f"review/review-d1-tsukioka-received-eating-{action}-isolated-720-r2.png"
        context_fhd = ROOT / f"review/context-d1-tsukioka-received-eating-{action}-fhd-r2.png"
        context_720 = ROOT / f"review/context-d1-tsukioka-received-eating-{action}-720-r2.png"
        normalized.save(asset, format="PNG", optimize=False)

        for width, height, out in ((1920, 1080, isolated_fhd), (1280, 720, isolated_720)):
            display = normalized if width == 1920 else normalized.resize((1280, 720), Image.Resampling.NEAREST)
            board = checkerboard(width, height, max(12, round(24 * width / 1920)))
            board.paste(display, (0, 0), display)
            board.save(out, format="PNG", optimize=False)

        context = background.copy()
        context.alpha_composite(seats, (seats_x, seats_y))
        context.alpha_composite(normalized, (0, 0))
        context.alpha_composite(counter, (0, 0))
        context.convert("RGB").save(context_fhd, format="PNG", optimize=False)
        context.convert("RGB").resize((1280, 720), Image.Resampling.NEAREST).save(context_720, format="PNG", optimize=False)

        pixels = list(normalized.getdata())
        alphas = [pixel[3] for pixel in pixels]
        alpha = normalized.getchannel("A")
        spill = sum(a > 0 and r >= g + 35 and b >= g + 35 and min(r, b) >= 100 for r, g, b, a in pixels)

        original = Image.open(frame["target"]).convert("RGB")
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

        report["frames"].append({
            "action": action,
            "normalization": {
                "sourceBbox": list(bbox),
                "targetBboxFhd": [target_x, target_y, target_x + target_width, target_y + target_height],
                "method": "per-frame full human+action-prop crop; 690px canonical height; center x1086; nearest-neighbor",
            },
            "asset": {**output_record(asset), "mode": "RGBA", "alphaBbox": list(alpha.getbbox())},
            "alpha": {
                "transparentPixels": sum(value == 0 for value in alphas),
                "partiallyTransparentPixels": sum(0 < value < 255 for value in alphas),
                "opaquePixels": sum(value == 255 for value in alphas),
                "cornerAlpha": [normalized.getpixel(point)[3] for point in ((0, 0), (1919, 0), (0, 1079), (1919, 1079))],
                "magentaSpillPixels": spill,
                "largeConnectedComponents": large_components(alpha),
            },
            "sourcePixelComparison": {
                "pixels": len(differences),
                "meanAbsoluteRgbDelta": round(sum(differences) / len(differences), 4),
                "medianAbsoluteRgbDelta": round(differences[len(differences) // 2], 4),
                "p95AbsoluteRgbDelta": round(differences[int(len(differences) * 0.95)], 4),
            },
            "reviewOutputs": [output_record(path) for path in (isolated_fhd, isolated_720, context_fhd, context_720)],
        })

    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
