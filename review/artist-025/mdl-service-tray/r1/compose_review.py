from pathlib import Path
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
COUNTER_REVIEW = HERE.parents[1] / "st-service-counter" / "r4" / "review-st-service-counter-runtime-fhd-r4.png"

scene = Image.open(COUNTER_REVIEW).convert("RGBA")
tray = Image.open(HERE / "mdl-service-tray-r1-alpha.png").convert("RGBA")
bbox = tray.getchannel("A").getbbox()
if not bbox:
    raise RuntimeError("tray alpha is empty")
tray = tray.crop(bbox)

# Runtime context: put the transfer tray on the central service counter, clear of the charcoal shelf.
runtime = scene.copy()
target_w = 520
scale = target_w / tray.width
placed = tray.resize((target_w, round(tray.height * scale)), Image.Resampling.LANCZOS)
runtime.alpha_composite(placed, (960 - placed.width // 2, 642 - placed.height))
runtime.save(HERE / "review-mdl-service-tray-runtime-fhd-r1.png")
runtime.resize((1280, 720), Image.Resampling.LANCZOS).save(
    HERE / "review-mdl-service-tray-runtime-720-r1.png"
)

# One browser-friendly approval sheet: isolated readability plus actual runtime scale.
sheet = Image.new("RGB", (1920, 1080), (24, 18, 14))
sheet.paste(runtime.convert("RGB").resize((1280, 720), Image.Resampling.LANCZOS), (640, 180))
isolated = tray.copy()
iso_w = 560
iso_scale = iso_w / isolated.width
isolated = isolated.resize((iso_w, round(isolated.height * iso_scale)), Image.Resampling.LANCZOS)
sheet.paste(isolated, (40, 360), isolated)
draw = ImageDraw.Draw(sheet)
draw.text((40, 42), "MDL-SERVICE-TRAY R1", fill=(244, 183, 91), stroke_width=1, stroke_fill=(50, 25, 10))
draw.text((40, 82), "ISOLATED ASSET / RUNTIME PLACEMENT", fill=(235, 225, 208))
draw.text((40, 820), "EMPTY TRANSFER TRAY", fill=(235, 225, 208))
draw.text((680, 920), "ACTUAL SERVICE-COUNTER SCALE", fill=(235, 225, 208))
sheet.save(HERE / "review-mdl-service-tray-approval-fhd-r1.png")

print({"source_bbox": bbox, "runtime_size": placed.size, "runtime_anchor": (960, 642)})
