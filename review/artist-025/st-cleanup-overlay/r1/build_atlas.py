from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
source = Image.open(HERE / "st-cleanup-overlay-wiping-r1-alpha.png").convert("RGBA")
bbox = source.getchannel("A").getbbox()
if not bbox:
    raise RuntimeError("cleanup overlay alpha is empty")
sprite = source.crop(bbox)

frame_size = (512, 256)
subject_w = 448
scale = subject_w / sprite.width
sprite = sprite.resize((subject_w, round(sprite.height * scale)), Image.Resampling.NEAREST)

atlas = Image.new("RGBA", (frame_size[0] * 2, frame_size[1]), (0, 0, 0, 0))
for frame, x_shift in ((sprite, -14), (sprite.transpose(Image.Transpose.FLIP_LEFT_RIGHT), 14)):
    index = 0 if x_shift < 0 else 1
    x = index * frame_size[0] + (frame_size[0] - frame.width) // 2 + x_shift
    y = (frame_size[1] - frame.height) // 2
    atlas.alpha_composite(frame, (x, y))

atlas.save(HERE / "st-cleanup-overlay-r1-atlas.png")
print({"source_bbox": bbox, "atlas_size": atlas.size, "frame_size": frame_size})
