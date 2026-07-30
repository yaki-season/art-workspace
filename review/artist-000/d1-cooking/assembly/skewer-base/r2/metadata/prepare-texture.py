from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source" / "skewer-base-alpha-source-r2.png"
OUTPUT = ROOT / "assets" / "tex-skewer-base-albedo-r2.png"


source = Image.open(SOURCE).convert("RGBA")
alpha = source.getchannel("A")
bounds = alpha.getbbox()
if bounds is None:
    raise SystemExit("texture source has no opaque pixels")

left, top, right, bottom = bounds
padding = 3
crop = source.crop((max(0, left - padding), max(0, top - padding), min(source.width, right + padding), min(source.height, bottom + padding)))

target_width, target_height = 1024, 64
scale = min((target_width - 8) / crop.width, (target_height - 8) / crop.height)
size = (round(crop.width * scale), round(crop.height * scale))
pixel_crop = crop.resize(size, Image.Resampling.NEAREST)

texture = Image.new("RGBA", (target_width, target_height), (0, 0, 0, 0))
texture.alpha_composite(pixel_crop, ((target_width - size[0]) // 2, (target_height - size[1]) // 2))
texture.save(OUTPUT)

print({"source": str(SOURCE), "output": str(OUTPUT), "alphaBounds": bounds, "normalizedSize": texture.size})
