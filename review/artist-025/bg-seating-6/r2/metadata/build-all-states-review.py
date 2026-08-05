#!/usr/bin/env python3
"""Build review-only 2x2 evidence for BG-SEATING-6 across approved Tsukioka states."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


REPO = Path(__file__).resolve().parents[6]
ROOT = Path(__file__).resolve().parents[1]
FONT = Path("/System/Library/Fonts/AppleSDGothicNeo.ttc")
OUT_FHD = ROOT / "review/review-bg-seating-6-all-tsukioka-states-fhd-r2.png"
OUT_720 = ROOT / "review/review-bg-seating-6-all-tsukioka-states-720-r2.png"
INPUTS = (
    ("대기", REPO / "art-workspace/review/artist-025/d1-tsukioka/waiting/r3/review/context-d1-tsukioka-waiting-fhd-r3.png"),
    ("맥주만 수령", REPO / "art-workspace/review/artist-025/d1-tsukioka/partial-beer-waiting/r2/review/context-d1-tsukioka-partial-beer-waiting-fhd-r2.png"),
    ("네기마 식사", REPO / "art-workspace/review/artist-025/d1-tsukioka/received-eating/r2/review/context-d1-tsukioka-received-eating-eat-negima-fhd-r2.png"),
    ("맥주 음주", REPO / "art-workspace/review/artist-025/d1-tsukioka/received-eating/r2/review/context-d1-tsukioka-received-eating-drink-draft-beer-fhd-r2.png"),
)


def main() -> None:
    canvas = Image.new("RGB", (1920, 1080), (42, 45, 50))
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.truetype(str(FONT), 30)
    margin, gutter, label_height, image_gap = 24, 16, 34, 10
    cell_width = (1920 - margin * 2 - gutter) // 2
    cell_height = (1080 - margin * 2 - gutter) // 2

    for index, (label, path) in enumerate(INPUTS):
        row, column = divmod(index, 2)
        cell_x = margin + column * (cell_width + gutter)
        cell_y = margin + row * (cell_height + gutter)
        image = Image.open(path).convert("RGB")
        if image.size != (1920, 1080):
            raise RuntimeError(f"unexpected context size: {path} {image.size}")
        max_width = cell_width
        max_height = cell_height - label_height - image_gap
        scale = min(max_width / image.width, max_height / image.height)
        size = (round(image.width * scale), round(image.height * scale))
        image = image.resize(size, Image.Resampling.NEAREST)
        image_x = cell_x + (cell_width - size[0]) // 2
        image_y = cell_y + label_height + image_gap
        canvas.paste(image, (image_x, image_y))
        box = draw.textbbox((0, 0), label, font=font)
        text_width = box[2] - box[0]
        text_y = cell_y + (label_height - (box[3] - box[1])) // 2 - box[1]
        draw.text((cell_x + (cell_width - text_width) // 2, text_y), label, font=font, fill=(238, 240, 242))

    canvas.save(OUT_FHD, format="PNG", optimize=False)
    canvas.resize((1280, 720), Image.Resampling.NEAREST).save(OUT_720, format="PNG", optimize=False)


if __name__ == "__main__":
    main()
