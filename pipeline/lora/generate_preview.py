from __future__ import annotations

import argparse
import json
from pathlib import Path

import torch
from diffusers import StableDiffusionPipeline


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="기본 모델과 YAKI SEASON LoRA 결과를 비교 생성한다.")
    parser.add_argument("--config", type=Path, required=True)
    parser.add_argument("--lora", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=Path("previews"))
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    config = json.loads(args.config.read_text(encoding="utf-8"))
    prompts = config.get("validation_prompts", [])
    if not prompts:
        raise ValueError("validation_prompts가 비어 있습니다.")
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    pipeline = StableDiffusionPipeline.from_pretrained(
        config["base_model"], torch_dtype=torch.float16, safety_checker=None, requires_safety_checker=False
    ).to("cuda")
    pipeline.enable_attention_slicing()
    seed = config.get("seed", 20260823)
    for index, prompt in enumerate(prompts, 1):
        base_generator = torch.Generator(device="cuda").manual_seed(seed + index)
        base = pipeline(prompt, num_inference_steps=30, generator=base_generator).images[0]
        base.save(output / f"{index:02d}-base.png")
    pipeline.load_lora_weights(str(args.lora.resolve()), adapter_name="yakiseason")
    pipeline.set_adapters("yakiseason", adapter_weights=1.0)
    for index, prompt in enumerate(prompts, 1):
        lora_generator = torch.Generator(device="cuda").manual_seed(seed + index)
        adapted = pipeline(prompt, num_inference_steps=30, generator=lora_generator).images[0]
        adapted.save(output / f"{index:02d}-lora.png")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
