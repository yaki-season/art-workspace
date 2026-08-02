#!/usr/bin/env python3
"""Build a non-approval FHD context preview from approved read-only layers."""

import hashlib
import json
from pathlib import Path

from PIL import Image


REPO = Path(__file__).resolve().parents[6]
ROOT = Path(__file__).resolve().parents[1]
BACKGROUND = REPO / "app/public/assets/core/customer/background-complete-r3-b1.png"
COUNTER = REPO / "app/public/assets/core/customer/service-table-complete-r1-b1.png"
TSUKIOKA = REPO / "app/public/assets/core/customer/d1-tsukioka-waiting-r2-b1.png"
SEATS = ROOT / "assets/bg-seating-6-r1.png"
OUTPUT = ROOT / "review/context-bg-seating-6-fhd-r1.png"


def sha256(path: Path) -> str:
    digest = hashlib.sha256(path.read_bytes())
    return digest.hexdigest()


def main() -> None:
    canvas = Image.open(BACKGROUND).convert("RGBA")
    seats = Image.open(SEATS).convert("RGBA")
    counter = Image.open(COUNTER).convert("RGBA")
    tsukioka = Image.open(TSUKIOKA).convert("RGBA")

    # Map the first and sixth source seat centers to the supplied FHD consumer
    # centers (230.4 and 1651.2), then map the shared local ground to y=594.
    scale = (1651.2 - 230.4) / (1521.0 - 148.5)
    x = round(230.4 - 148.5 * scale)
    y = round(594 - 712 * scale)
    resized = seats.resize(
        (round(seats.width * scale), round(seats.height * scale)),
        Image.Resampling.NEAREST,
    )

    canvas.alpha_composite(resized, (x, y))
    canvas.alpha_composite(tsukioka, (0, 0))
    canvas.alpha_composite(counter, (0, 0))
    canvas.convert("RGB").save(OUTPUT, format="PNG", optimize=False)

    print(
        json.dumps(
            {
                "file": str(OUTPUT.relative_to(ROOT)),
                "width": 1920,
                "height": 1080,
                "bytes": OUTPUT.stat().st_size,
                "sha256": sha256(OUTPUT),
                "seatTransform": {
                    "scale": round(scale, 8),
                    "x": x,
                    "y": y,
                    "sharedGroundFhdY": round(y + 712 * scale, 2),
                },
                "layerOrder": [
                    "approved background",
                    "BG-SEATING-6 R1 candidate",
                    "approved D1-TSUKIOKA-WAITING R2 scale context",
                    "approved service counter foreground",
                ],
                "status": "composition-evidence-only-not-approval-artifact",
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
