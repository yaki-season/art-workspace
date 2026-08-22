from __future__ import annotations

import argparse
import json
import math
from pathlib import Path

import torch
import torch.nn.functional as F
from accelerate import Accelerator
from accelerate.utils import set_seed
from diffusers import DDPMScheduler, StableDiffusionPipeline
from diffusers.optimization import get_scheduler
from diffusers.utils import convert_state_dict_to_diffusers
from peft import LoraConfig, get_peft_model_state_dict
from PIL import Image
from torch.utils.data import DataLoader, Dataset


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="PEFT 기반 YAKI SEASON 이미지 LoRA 학습")
    parser.add_argument("--config", type=Path, required=True)
    parser.add_argument("--resume", type=Path)
    return parser.parse_args()


def load_config(path: Path) -> dict:
    config = json.loads(path.read_text(encoding="utf-8"))
    required = {"base_model", "dataset_manifest", "output_dir", "resolution"}
    missing = sorted(required - config.keys())
    if missing:
        raise ValueError(f"config 필수 키가 없습니다: {', '.join(missing)}")
    config["_root"] = path.resolve().parent
    return config


def resolve_from(root: Path, value: str) -> Path:
    path = Path(value)
    return path.resolve() if path.is_absolute() else (root / path).resolve()


def contain(image: Image.Image, size: int, fill: tuple[int, int, int]) -> Image.Image:
    image = image.convert("RGBA")
    scale = min(size / image.width, size / image.height)
    target = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    resized = image.resize(target, Image.Resampling.NEAREST)
    canvas = Image.new("RGBA", (size, size), (*fill, 255))
    position = ((size - target[0]) // 2, (size - target[1]) // 2)
    canvas.alpha_composite(resized, position)
    return canvas.convert("RGB")


def cover(image: Image.Image, size: int) -> Image.Image:
    image = image.convert("RGB")
    scale = max(size / image.width, size / image.height)
    target = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    resized = image.resize(target, Image.Resampling.NEAREST)
    left = (target[0] - size) // 2
    top = (target[1] - size) // 2
    return resized.crop((left, top, left + size, top + size))


class ArtDataset(Dataset):
    def __init__(self, manifest: Path, tokenizer, resolution: int, resize_mode: str, padding_rgb: list[int]):
        self.manifest = manifest
        self.tokenizer = tokenizer
        self.resolution = resolution
        self.resize_mode = resize_mode
        self.padding_rgb = tuple(padding_rgb)
        self.records = []
        for raw_line in manifest.read_text(encoding="utf-8").splitlines():
            if not raw_line.strip():
                continue
            record = json.loads(raw_line)
            if record.get("approved") is not True:
                raise ValueError(f"승인되지 않은 학습 이미지입니다: {record.get('image')}")
            image_path = Path(record["image"])
            if not image_path.is_absolute():
                image_path = (manifest.parent / image_path).resolve()
            if not image_path.is_file():
                raise FileNotFoundError(image_path)
            self.records.append((image_path, record["caption"]))
        if not self.records:
            raise ValueError("학습할 승인 이미지가 없습니다.")

    def __len__(self) -> int:
        return len(self.records)

    def __getitem__(self, index: int) -> dict[str, torch.Tensor]:
        image_path, caption = self.records[index]
        with Image.open(image_path) as source:
            image = source.copy()
        if self.resize_mode == "contain":
            image = contain(image, self.resolution, self.padding_rgb)
        elif self.resize_mode == "cover":
            image = cover(image, self.resolution)
        else:
            raise ValueError("resize_mode은 contain 또는 cover여야 합니다.")
        pixels = torch.from_numpy(__import__("numpy").array(image)).float()
        pixels = pixels.permute(2, 0, 1) / 127.5 - 1.0
        input_ids = self.tokenizer(
            caption,
            max_length=self.tokenizer.model_max_length,
            padding="max_length",
            truncation=True,
            return_tensors="pt",
        ).input_ids[0]
        return {"pixel_values": pixels, "input_ids": input_ids}


def save_lora(unet, output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    state = convert_state_dict_to_diffusers(get_peft_model_state_dict(unet))
    StableDiffusionPipeline.save_lora_weights(output_dir, unet_lora_layers=state)


@torch.no_grad()
def validate(pipeline, prompts: list[str], output_dir: Path, step: int, seed: int) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    generator = torch.Generator(device=pipeline.device).manual_seed(seed)
    for index, prompt in enumerate(prompts):
        image = pipeline(prompt, num_inference_steps=30, generator=generator).images[0]
        image.save(output_dir / f"step-{step:06d}-{index + 1}.png")


def main() -> int:
    args = parse_args()
    config = load_config(args.config)
    root = config["_root"]
    output_dir = resolve_from(root, config["output_dir"])
    manifest = resolve_from(root, config["dataset_manifest"])
    precision = config.get("mixed_precision", "fp16")
    accelerator = Accelerator(
        gradient_accumulation_steps=config.get("gradient_accumulation_steps", 4),
        mixed_precision=precision,
    )
    set_seed(config.get("seed", 20260823))

    dtype = torch.float16 if precision == "fp16" else torch.float32
    pipeline = StableDiffusionPipeline.from_pretrained(
        config["base_model"], torch_dtype=dtype, safety_checker=None, requires_safety_checker=False
    )
    tokenizer = pipeline.tokenizer
    text_encoder = pipeline.text_encoder.requires_grad_(False)
    vae = pipeline.vae.requires_grad_(False)
    unet = pipeline.unet
    # 혼합 정밀도에서도 학습 대상 LoRA 가중치는 float32로 유지한다.
    # VAE와 text encoder만 아래에서 fp16으로 내려 8GB VRAM 사용량을 줄인다.
    unet.to(dtype=torch.float32)
    noise_scheduler = DDPMScheduler.from_config(pipeline.scheduler.config)

    lora_config = LoraConfig(
        r=config.get("rank", 16),
        lora_alpha=config.get("rank", 16),
        init_lora_weights="gaussian",
        target_modules=["to_k", "to_q", "to_v", "to_out.0"],
    )
    unet.add_adapter(lora_config)
    if config.get("gradient_checkpointing", True):
        unet.enable_gradient_checkpointing()

    trainable = [parameter for parameter in unet.parameters() if parameter.requires_grad]
    optimizer = torch.optim.AdamW(trainable, lr=config.get("learning_rate", 1e-4))
    dataset = ArtDataset(
        manifest,
        tokenizer,
        config.get("resolution", 512),
        config.get("resize_mode", "contain"),
        config.get("padding_rgb", [24, 17, 13]),
    )
    loader = DataLoader(dataset, batch_size=config.get("train_batch_size", 1), shuffle=True, num_workers=0)
    max_steps = config.get("max_train_steps", 1200)
    updates_per_epoch = math.ceil(len(loader) / accelerator.gradient_accumulation_steps)
    epochs = math.ceil(max_steps / updates_per_epoch)
    scheduler = get_scheduler(
        "cosine",
        optimizer=optimizer,
        num_warmup_steps=min(100, max_steps // 10),
        num_training_steps=max_steps,
    )
    unet, optimizer, loader, scheduler = accelerator.prepare(unet, optimizer, loader, scheduler)
    vae.to(accelerator.device, dtype=dtype)
    text_encoder.to(accelerator.device, dtype=dtype)

    global_step = 0
    if args.resume:
        accelerator.load_state(str(args.resume))
        try:
            global_step = int(args.resume.name.rsplit("-", 1)[1])
        except (IndexError, ValueError):
            global_step = 0

    for _epoch in range(epochs):
        unet.train()
        for batch in loader:
            with accelerator.accumulate(unet):
                with torch.no_grad():
                    latents = vae.encode(batch["pixel_values"].to(dtype=dtype)).latent_dist.sample()
                    latents = latents * vae.config.scaling_factor
                    encoder_hidden_states = text_encoder(batch["input_ids"])[0]
                noise = torch.randn_like(latents)
                timesteps = torch.randint(
                    0, noise_scheduler.config.num_train_timesteps, (latents.shape[0],), device=latents.device
                ).long()
                noisy_latents = noise_scheduler.add_noise(latents, noise, timesteps)
                prediction = unet(noisy_latents, timesteps, encoder_hidden_states).sample
                target = noise
                if noise_scheduler.config.prediction_type == "v_prediction":
                    target = noise_scheduler.get_velocity(latents, noise, timesteps)
                loss = F.mse_loss(prediction.float(), target.float(), reduction="mean")
                accelerator.backward(loss)
                if accelerator.sync_gradients:
                    accelerator.clip_grad_norm_(trainable, 1.0)
                optimizer.step()
                scheduler.step()
                optimizer.zero_grad(set_to_none=True)

            if accelerator.sync_gradients:
                global_step += 1
                if accelerator.is_main_process and global_step % 10 == 0:
                    print(f"step={global_step}/{max_steps} loss={loss.detach().item():.6f}", flush=True)
                checkpoint_steps = config.get("checkpoint_steps", 200)
                if global_step % checkpoint_steps == 0:
                    accelerator.save_state(str(output_dir / f"checkpoint-{global_step}"))
                if global_step >= max_steps:
                    break
        if global_step >= max_steps:
            break

    accelerator.wait_for_everyone()
    if accelerator.is_main_process:
        unwrapped = accelerator.unwrap_model(unet)
        save_lora(unwrapped, output_dir / "lora")
        metadata = {
            "base_model": config["base_model"],
            "dataset_manifest": str(manifest),
            "resolution": config.get("resolution", 512),
            "resize_mode": config.get("resize_mode", "contain"),
            "rank": config.get("rank", 16),
            "steps": global_step,
            "seed": config.get("seed", 20260823),
        }
        (output_dir / "training-metadata.json").write_text(
            json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
    accelerator.end_training()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
