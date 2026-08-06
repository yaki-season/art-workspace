from pathlib import Path
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
ARTIST = HERE.parents[1]
SCENE_PATH = ARTIST / "st-service-counter" / "r4" / "review-st-service-counter-runtime-fhd-r4.png"

scene = Image.open(SCENE_PATH).convert("RGBA")
dishes = Image.open(HERE / "pr-empty-dish-set-r1-alpha.png").convert("RGBA")
bbox = dishes.getchannel("A").getbbox()
if not bbox:
    raise RuntimeError("empty dish set alpha is empty")
dishes = dishes.crop(bbox)

runtime = scene.copy()
target_w = 158
scale = target_w / dishes.width
placed = dishes.resize((target_w, round(dishes.height * scale)), Image.Resampling.LANCZOS)
anchor = (1050, 688)
runtime.alpha_composite(placed, (anchor[0] - placed.width // 2, anchor[1] - placed.height))
runtime.save(HERE / "review-pr-empty-dish-set-runtime-fhd-r1.png")
runtime.resize((1280, 720), Image.Resampling.LANCZOS).save(
    HERE / "review-pr-empty-dish-set-runtime-720-r1.png"
)

sheet = Image.new("RGB", (1920, 1080), (24, 18, 14))
sheet.paste(runtime.convert("RGB").resize((1280, 720), Image.Resampling.LANCZOS), (640, 180))
isolated = dishes.copy()
iso_w = 540
iso_scale = iso_w / isolated.width
isolated = isolated.resize((iso_w, round(isolated.height * iso_scale)), Image.Resampling.LANCZOS)
sheet.paste(isolated, (45, 310), isolated)
draw = ImageDraw.Draw(sheet)
draw.text((40, 42), "PR-EMPTY-DISH-SET R1", fill=(244, 183, 91), stroke_width=1, stroke_fill=(50, 25, 10))
draw.text((40, 82), "ISOLATED SET / ONE CLEANUP SEAT", fill=(235, 225, 208))
draw.text((40, 825), "EMPTY PLATE + BEER MUG + CUP", fill=(235, 225, 208))
draw.text((680, 920), "CUSTOMERS.TABLE.EMPTY PREVIEW", fill=(235, 225, 208))
sheet.save(HERE / "review-pr-empty-dish-set-approval-fhd-r1.png")

print({"source_bbox": bbox, "runtime_size": placed.size, "anchor": anchor})
