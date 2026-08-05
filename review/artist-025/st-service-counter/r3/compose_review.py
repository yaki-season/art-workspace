from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[4]
HERE = Path(__file__).resolve().parent
APP = ROOT.parent / "app"

background = Image.open(APP / "public/assets/core/customer/background-complete-r4-b1.png").convert("RGBA")
counter = Image.open(APP / "public/assets/core/customer/service-counter-u-r4-b1.png").convert("RGBA")
module = Image.open(HERE / "st-service-counter-r3-alpha.png").convert("RGBA")
bbox = module.getchannel("A").getbbox()
if not bbox:
    raise RuntimeError("module alpha is empty")
module = module.crop(bbox)

canvas = background.resize((1920, 1080), Image.Resampling.LANCZOS)
canvas.alpha_composite(counter.resize((1920, 1080), Image.Resampling.LANCZOS))

target_w = 1020
scale = target_w / module.width
module = module.resize((target_w, round(module.height * scale)), Image.Resampling.LANCZOS)
pivot_x, pivot_y = 960, 1092
canvas.alpha_composite(module, (pivot_x - module.width // 2, pivot_y - module.height))

canvas.save(HERE / "review-st-service-counter-runtime-fhd-r3.png")
canvas.resize((1280, 720), Image.Resampling.LANCZOS).save(
    HERE / "review-st-service-counter-runtime-720-r3.png"
)
print({"source_bbox": bbox, "placed_size": module.size, "pivot": (pivot_x, pivot_y)})
