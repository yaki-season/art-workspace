#!/usr/bin/env python3

"""Render one approved raster asset on a deterministic checkerboard."""

from __future__ import annotations

import argparse
import os
from pathlib import Path

from PIL import Image, ImageColor, ImageDraw


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--scale", type=int, default=4)
    parser.add_argument("--cell-size", type=int, default=32)
    parser.add_argument("--color-a", default="#24242c")
    parser.add_argument("--color-b", default="#34343e")
    parser.add_argument("--force", action="store_true")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.scale < 1:
        raise SystemExit("--scale must be at least 1")
    if args.cell_size < 1:
        raise SystemExit("--cell-size must be at least 1")
    if args.output.exists() and not args.force:
        raise SystemExit(f"output already exists: {args.output}")

    width, height = 1920, 1080
    color_a = ImageColor.getrgb(args.color_a)
    color_b = ImageColor.getrgb(args.color_b)
    board = Image.new("RGBA", (width, height), (*color_a, 255))
    draw = ImageDraw.Draw(board)
    for y in range(0, height, args.cell_size):
        for x in range(0, width, args.cell_size):
            if (x // args.cell_size + y // args.cell_size) % 2:
                draw.rectangle(
                    (
                        x,
                        y,
                        min(x + args.cell_size - 1, width - 1),
                        min(y + args.cell_size - 1, height - 1),
                    ),
                    fill=(*color_b, 255),
                )

    with Image.open(args.input) as opened:
        subject = opened.convert("RGBA")
    scaled_size = (subject.width * args.scale, subject.height * args.scale)
    if scaled_size[0] > width or scaled_size[1] > height:
        raise SystemExit("scaled subject does not fit the 1920x1080 review board")
    subject = subject.resize(scaled_size, Image.Resampling.NEAREST)
    position = (
        (width - subject.width) // 2,
        (height - subject.height) // 2,
    )
    board.alpha_composite(subject, position)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_suffix(f"{args.output.suffix}.rendering")
    board.convert("RGB").save(temporary, format="PNG", optimize=False)
    os.replace(temporary, args.output)


if __name__ == "__main__":
    main()
