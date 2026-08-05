from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[4]
HERE = Path(__file__).resolve().parent
APP = ROOT.parent / "app"

actor = Image.open(HERE / "ch-extra-commuter-waiting-r3-alpha.png").convert("RGBA")
bbox = actor.getchannel("A").getbbox()
if not bbox:
    raise RuntimeError("actor alpha is empty")
actor = actor.crop(bbox)

background = Image.open(APP / "public/assets/core/customer/background-complete-r4-b1.png").convert("RGBA")
counter = Image.open(APP / "public/assets/core/customer/service-counter-u-r4-b1.png").convert("RGBA")
canvas = background.resize((1920, 1080), Image.Resampling.LANCZOS)

# Seat-03 centre; forearms meet the top edge while the foreground counter owns
# lower-body occlusion. Keep the actor modest relative to the deep background.
target_w, target_h = 230, 390
scale = min(target_w / actor.width, target_h / actor.height)
actor = actor.resize((round(actor.width * scale), round(actor.height * scale)), Image.Resampling.LANCZOS)
pivot_x, pivot_y = 799, 650
canvas.alpha_composite(actor, (pivot_x - actor.width // 2, pivot_y - actor.height))
canvas.alpha_composite(counter.resize((1920, 1080), Image.Resampling.LANCZOS))

canvas.save(HERE / "review-ch-extra-commuter-runtime-fhd-r3.png")
canvas.resize((1280, 720), Image.Resampling.LANCZOS).save(
    HERE / "review-ch-extra-commuter-runtime-720-r3.png"
)
print({"source_bbox": bbox, "placed_size": actor.size, "pivot": (pivot_x, pivot_y)})
