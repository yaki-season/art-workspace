from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[5]
APP = ROOT / "app"
HERE = Path(__file__).resolve().parent

station = Image.open(APP / "public/assets/core/drink/st-drink-beer-tier-1-r4-b1.png").convert("RGBA")
base = station.copy()

# 승인 R4에서 손잡이만 제거한다. 탱크 위는 투명 복구하고, 탱크와 겹친 좁은 목 부분은
# 바로 왼쪽 황동 표면을 복제한다. 피벗·탭·트레이는 건드리지 않는다.
for y in range(252, 350):
    for x in range(974, 1017):
        base.putpixel((x, y), (0, 0, 0, 0))
for y in range(350, 382):
    for x in range(978, 1009):
        sx = max(952, x - 38)
        base.putpixel((x, y), station.getpixel((sx, y)))

lever = Image.open(HERE / "mdl-beer-lever-r1-alpha.png").convert("RGBA")
lever = lever.crop(lever.getchannel("A").getbbox())
lever = lever.resize((42, 182), Image.Resampling.LANCZOS)

# lever crop의 피벗 중심은 아래에서 약 18% 지점이다.
pivot_local = (21, 148)
target_pivot = (989, 386)


def rotated(angle: float) -> Image.Image:
    canvas = Image.new("RGBA", (400, 400))
    center = (200, 200)
    canvas.alpha_composite(lever, (center[0] - pivot_local[0], center[1] - pivot_local[1]))
    return canvas.rotate(angle, resample=Image.Resampling.BICUBIC, center=center)


def state(angle: float, name: str) -> Image.Image:
    frame = base.copy()
    sprite = rotated(angle)
    frame.alpha_composite(sprite, (target_pivot[0] - 200, target_pivot[1] - 200))
    frame.save(HERE / f"st-drink-lever-{name}-r1.png", optimize=True)
    return frame


neutral = state(0, "neutral")
beer = state(-22, "beer")
foam = state(22, "foam")

bg = Image.open(APP / "public/assets/core/drink/bg-workspace-drink-r2-b1.png").convert("RGBA")
review = Image.new("RGB", (1920, 1080))
for i, layer in enumerate((neutral, beer, foam)):
    shot = bg.copy(); shot.alpha_composite(layer)
    thumb = shot.resize((640, 360), Image.Resampling.LANCZOS).convert("RGB")
    review.paste(thumb, (i * 640, 360))
review.save(HERE / "review-mdl-beer-lever-states-r1.png", optimize=True)
