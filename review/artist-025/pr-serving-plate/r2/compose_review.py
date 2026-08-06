from pathlib import Path
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
ARTIST = HERE.parents[1]
SCENE_PATH = ARTIST / "st-service-counter" / "r4" / "review-st-service-counter-runtime-fhd-r4.png"

scene = Image.open(SCENE_PATH).convert("RGBA")
plate = Image.open(HERE / "pr-serving-plate-r2-alpha.png").convert("RGBA")
bbox = plate.getchannel("A").getbbox()
if not bbox:
    raise RuntimeError("plate alpha is empty")
plate = plate.crop(bbox)

runtime = scene.copy()
target_w = 132
scale = target_w / plate.width
placed = plate.resize((target_w, round(plate.height * scale)), Image.Resampling.LANCZOS)
anchors = [(510, 683), (690, 683), (870, 683), (1050, 683), (1230, 683), (1410, 683)]
for x, y in anchors:
    runtime.alpha_composite(placed, (x - placed.width // 2, y - placed.height))
runtime.save(HERE / "review-pr-serving-plate-runtime-fhd-r2.png")
runtime.resize((1280, 720), Image.Resampling.LANCZOS).save(
    HERE / "review-pr-serving-plate-runtime-720-r2.png"
)

sheet = Image.new("RGB", (1920, 1080), (24, 18, 14))
sheet.paste(runtime.convert("RGB").resize((1280, 720), Image.Resampling.LANCZOS), (640, 180))
isolated = plate.copy()
iso_w = 540
iso_scale = iso_w / isolated.width
isolated = isolated.resize((iso_w, round(isolated.height * iso_scale)), Image.Resampling.LANCZOS)
sheet.paste(isolated, (50, 390), isolated)
draw = ImageDraw.Draw(sheet)
draw.text((40, 42), "PR-SERVING-PLATE R2", fill=(244, 183, 91), stroke_width=1, stroke_fill=(50, 25, 10))
draw.text((40, 82), "DARK LOW-PROFILE PLATE / SIX-SEAT SCALE", fill=(235, 225, 208))
draw.text((40, 780), "EMPTY YAKITORI PLATE", fill=(235, 225, 208))
draw.text((680, 920), "CUSTOMERS.TABLE[N] PREVIEW", fill=(235, 225, 208))
sheet.save(HERE / "review-pr-serving-plate-approval-fhd-r2.png")

print({"source_bbox": bbox, "runtime_size": placed.size, "anchors": anchors})
