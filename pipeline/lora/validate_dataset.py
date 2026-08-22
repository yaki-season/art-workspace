from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from pathlib import Path

from PIL import Image


ALLOWED_MODES = {"RGB", "RGBA"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="YAKI SEASON LoRA 데이터셋을 검증한다.")
    parser.add_argument("manifest", type=Path, help="JSONL manifest 경로")
    parser.add_argument("--trigger", default="yakiseason_style")
    parser.add_argument("--min-images", type=int, default=10)
    return parser.parse_args()


def resolve_image(manifest: Path, raw_path: str) -> Path:
    candidate = Path(raw_path)
    if not candidate.is_absolute():
        candidate = manifest.parent / candidate
    return candidate.resolve()


def main() -> int:
    args = parse_args()
    manifest = args.manifest.resolve()
    if not manifest.is_file():
        print(f"오류: manifest가 없습니다: {manifest}", file=sys.stderr)
        return 2

    errors: list[str] = []
    warnings: list[str] = []
    records: list[dict] = []
    dimensions: Counter[tuple[int, int]] = Counter()
    kinds: Counter[str] = Counter()

    for line_number, raw_line in enumerate(manifest.read_text(encoding="utf-8").splitlines(), 1):
        if not raw_line.strip():
            continue
        try:
            record = json.loads(raw_line)
        except json.JSONDecodeError as exc:
            errors.append(f"{line_number}행: JSON 오류: {exc.msg}")
            continue
        if record.get("approved") is not True:
            errors.append(f"{line_number}행: approved=true인 이미지만 학습할 수 있습니다.")
        caption = record.get("caption", "")
        if not isinstance(caption, str) or not caption.strip():
            errors.append(f"{line_number}행: caption이 비어 있습니다.")
        elif args.trigger not in caption.split(",", 1)[0]:
            warnings.append(f"{line_number}행: caption 첫 항목에 호출어 {args.trigger!r}가 없습니다.")
        image_value = record.get("image")
        if not isinstance(image_value, str) or not image_value:
            errors.append(f"{line_number}행: image 경로가 없습니다.")
            continue
        image_path = resolve_image(manifest, image_value)
        if not image_path.is_file():
            errors.append(f"{line_number}행: 이미지가 없습니다: {image_path}")
            continue
        try:
            with Image.open(image_path) as image:
                image.verify()
            with Image.open(image_path) as image:
                dimensions[image.size] += 1
                if image.mode not in ALLOWED_MODES:
                    warnings.append(f"{line_number}행: 이미지 모드가 {image.mode}입니다: {image_path.name}")
        except (OSError, ValueError) as exc:
            errors.append(f"{line_number}행: 이미지를 읽을 수 없습니다: {exc}")
            continue
        kinds[str(record.get("kind", "unspecified"))] += 1
        records.append(record)

    if len(records) < args.min_images:
        warnings.append(f"승인 이미지가 {len(records)}장입니다. 최소 권장값은 {args.min_images}장입니다.")

    print(f"manifest: {manifest}")
    print(f"승인 레코드: {len(records)}")
    print("종류: " + ", ".join(f"{key}={value}" for key, value in sorted(kinds.items())))
    print("원본 크기: " + ", ".join(f"{w}x{h}={count}" for (w, h), count in sorted(dimensions.items())))
    for warning in warnings:
        print(f"경고: {warning}")
    for error in errors:
        print(f"오류: {error}", file=sys.stderr)
    if errors:
        print(f"검증 실패: 오류 {len(errors)}개", file=sys.stderr)
        return 1
    print(f"검증 통과: 경고 {len(warnings)}개")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
