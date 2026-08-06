from pathlib import Path
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
ARTIST = HERE.parents[1]
SCENE_PATH = ARTIST / "st-service-counter" / "r4" / "review-st-service-counter-runtime-fhd-r4.png"
DISH_PATH = ARTIST / "pr-empty-dish-set" / "r1" / "pr-empty-dish-set-r1-alpha.png"

def cropped(path):
    image = Image.open(path).convert("RGBA")
    bbox = image.getchannel("A").getbbox()
    if not bbox:
        raise RuntimeError(f"empty alpha: {path}")
    return image.crop(bbox), bbox

scene = Image.open(SCENE_PATH).convert("RGBA")
dishes, dish_bbox = cropped(DISH_PATH)
cloth, cloth_bbox = cropped(HERE / "st-cleanup-overlay-wiping-r1-alpha.png")

runtime = scene.copy()
anchor = (1050, 688)
dish_w = 158
dish_scale = dish_w / dishes.width
dishes = dishes.resize((dish_w, round(dishes.height * dish_scale)), Image.Resampling.LANCZOS)
runtime.alpha_composite(dishes, (anchor[0] - dishes.width // 2, anchor[1] - dishes.height))

cloth_w = 72
cloth_scale = cloth_w / cloth.width
cloth = cloth.resize((cloth_w, round(cloth.height * cloth_scale)), Image.Resampling.NEAREST)
cloth_pos = (anchor[0] - 22, anchor[1] - 41)
runtime.alpha_composite(cloth, (cloth_pos[0] - cloth.width // 2, cloth_pos[1] - cloth.height // 2))
runtime.save(HERE / "review-st-cleanup-overlay-runtime-fhd-r1.png")
runtime.resize((1280, 720), Image.Resampling.LANCZOS).save(
    HERE / "review-st-cleanup-overlay-runtime-720-r1.png"
)

sheet = Image.new("RGB", (1920, 1080), (24, 18, 14))
sheet.paste(runtime.convert("RGB").resize((1280, 720), Image.Resampling.LANCZOS), (640, 180))
isolated, _ = cropped(HERE / "st-cleanup-overlay-wiping-r1-alpha.png")
iso_w = 500
iso_scale = iso_w / isolated.width
isolated = isolated.resize((iso_w, round(isolated.height * iso_scale)), Image.Resampling.NEAREST)
sheet.paste(isolated, (55, 390), isolated)
draw = ImageDraw.Draw(sheet)
draw.text((40, 42), "ST-CLEANUP-OVERLAY R1 / WIPING", fill=(244, 183, 91), stroke_width=1, stroke_fill=(50, 25, 10))
draw.text((40, 82), "ISOLATED FRAME / EMPTY-DISH COMPOSITE", fill=(235, 225, 208))
draw.text((40, 800), "CLOTH + LATERAL MOTION ONLY", fill=(235, 225, 208))
draw.text((680, 920), "THREE-SECOND GAUGE REMAINS DOM", fill=(235, 225, 208))
sheet.save(HERE / "review-st-cleanup-overlay-approval-fhd-r1.png")

print({"dish_bbox": dish_bbox, "cloth_bbox": cloth_bbox, "cloth_runtime_size": cloth.size})
