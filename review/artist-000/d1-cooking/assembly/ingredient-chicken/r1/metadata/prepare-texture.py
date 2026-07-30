from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source" / "ingredient-chicken-alpha-source-r1.png"
OUTPUT = ROOT / "assets" / "tex-ingredient-chicken-albedo-r1.png"

source = Image.open(SOURCE).convert("RGBA")
bounds = source.getchannel("A").getbbox()
if bounds is None:
    raise SystemExit("chicken source has no opaque pixels")

left, top, right, bottom = bounds
padding = 3
crop = source.crop((max(0, left - padding), max(0, top - padding), min(source.width, right + padding), min(source.height, bottom + padding)))
target = 192
scale = min((target - 8) / crop.width, (target - 8) / crop.height)
size = (round(crop.width * scale), round(crop.height * scale))
pixel_crop = crop.resize(size, Image.Resampling.NEAREST)
texture = Image.new("RGBA", (target, target), (0, 0, 0, 0))
texture.alpha_composite(pixel_crop, ((target - size[0]) // 2, (target - size[1]) // 2))
texture.save(OUTPUT)
print({"source": str(SOURCE), "output": str(OUTPUT), "alphaBounds": bounds, "normalizedSize": texture.size})
