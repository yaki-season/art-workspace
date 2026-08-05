from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[5]
APP = ROOT / "app"
HERE = Path(__file__).resolve().parent


def subject(path: Path) -> Image.Image:
    image = Image.open(path).convert("RGBA")
    box = image.getchannel("A").getbbox()
    return image.crop(box)


def fit_width(image: Image.Image, width: int) -> Image.Image:
    height = round(image.height * width / image.width)
    return image.resize((width, height), Image.Resampling.LANCZOS)


background = Image.open(APP / "public/assets/core/drink/bg-workspace-drink-r2-b1.png").convert("RGBA")
station = Image.open(APP / "public/assets/core/drink/st-drink-beer-tier-1-r4-b1.png").convert("RGBA")
deck = fit_width(subject(HERE / "mdl-beer-glass-deck-r1-alpha.png"), 470)
glass = fit_width(subject(HERE / "mdl-beer-glass-r1-alpha.png"), 132)

frame = background.copy()
frame.alpha_composite(station)
frame.alpha_composite(deck, (365, 500))
frame.alpha_composite(glass, (894, 505))
frame.convert("RGB").save(HERE / "review-mdl-beer-glass-fhd-r1.png", optimize=True)
frame.resize((1280, 720), Image.Resampling.LANCZOS).convert("RGB").save(
    HERE / "review-mdl-beer-glass-720-r1.png", optimize=True
)
