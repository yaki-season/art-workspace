from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source" / "ingredient-negi-alpha-source-r3.png"
OUTPUT = ROOT / "assets" / "tex-ingredient-negi-albedo-r3.png"

source = Image.open(SOURCE).convert("RGBA")
bounds = source.getchannel("A").getbbox()
if bounds is None:
    raise SystemExit("negi source has no opaque pixels")

left, top, right, bottom = bounds
padding = 3
crop = source.crop((max(0, left - padding), max(0, top - padding), min(source.width, right + padding), min(source.height, bottom + padding)))
target = (256, 192)
scale = min((target[0] - 8) / crop.width, (target[1] - 8) / crop.height)
size = (round(crop.width * scale), round(crop.height * scale))
pixel_crop = crop.resize(size, Image.Resampling.NEAREST)
texture = Image.new("RGBA", target, (0, 0, 0, 0))
texture.alpha_composite(pixel_crop, ((target[0] - size[0]) // 2, (target[1] - size[1]) // 2))
texture.save(OUTPUT)
print({"source": str(SOURCE), "output": str(OUTPUT), "alphaBounds": bounds, "normalizedSize": texture.size})
