from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[4]
HERE = Path(__file__).resolve().parent
APP = ROOT.parent / "app"

actor = Image.open(HERE / "ch-extra-commuter-waiting-r1-alpha.png").convert("RGBA")
alpha = actor.getchannel("A")
bbox = alpha.getbbox()
if not bbox:
    raise RuntimeError("actor alpha is empty")
actor = actor.crop(bbox)

background = Image.open(APP / "public/assets/core/customer/background-complete-r4-b1.png").convert("RGBA")
counter = Image.open(APP / "public/assets/core/customer/service-counter-u-r4-b1.png").convert("RGBA")
canvas = background.resize((1920, 1080), Image.Resampling.LANCZOS)

# Review placement uses the same seat-03 centre line while allowing the foreground
# counter to occlude the seated lower body. The delivered source remains a clean,
# furniture-free full-body cutout; runtime can crop it to its seat contract.
target_w, target_h = 300, 520
scale = min(target_w / actor.width, target_h / actor.height)
actor = actor.resize((round(actor.width * scale), round(actor.height * scale)), Image.Resampling.LANCZOS)
pivot_x, pivot_y = 799, 800
canvas.alpha_composite(actor, (pivot_x - actor.width // 2, pivot_y - actor.height))

# Runtime foreground counter occludes the lower body. Keep the same full-frame source layer.
counter = counter.resize((1920, 1080), Image.Resampling.LANCZOS)
canvas.alpha_composite(counter)
canvas.save(HERE / "review-ch-extra-commuter-waiting-fhd-r1.png")
# Replace the earlier failed runtime capture as well. That capture was overwritten
# by the live render loop with Tsukioka and must never remain as an approval image.
canvas.save(HERE / "review-ch-extra-commuter-runtime-fhd-r1.png")

review_720 = canvas.resize((1280, 720), Image.Resampling.LANCZOS)
review_720.save(HERE / "review-ch-extra-commuter-waiting-720-r1.png")

print({
    "source_bbox": bbox,
    "placed_size": actor.size,
    "pivot": (pivot_x, pivot_y),
})
