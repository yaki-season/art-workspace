# YAKI SEASON PEFT LoRA 파이프라인

승인된 YAKI SEASON 이미지로 이미지 생성용 스타일 LoRA를 학습하는 로컬 파이프라인이다.
OpenAI GPT Image를 변경하지 않으며, 공개 가중치인 Stable Diffusion 1.5에 PEFT 어댑터를
삽입한다. RTX 4060 Ti 8GB에서 먼저 검증할 수 있도록 512×512, batch 1을 기본값으로 둔다.

## 중요한 원칙

- 현재 작업공간의 이미지를 자동으로 전부 학습하지 않는다.
- `approved: true`로 사람이 선정한 이미지만 manifest에 넣는다.
- 가로와 세로를 서로 다른 비율로 늘리지 않는다.
- `contain`은 원본 비율을 유지하고 여백을 더한다.
- `cover`는 원본 비율을 유지하고 중앙을 자른다.
- 학습 산출물은 runtime 에셋이 아니며 기존 승인 게이트를 우회하지 않는다.
- 학습 이미지의 제작 권리와 모델 라이선스는 실행 전에 작업자가 확인한다.

## 구성

| 파일 | 역할 |
| --- | --- |
| `config.example.json` | 8GB GPU용 기본 학습 설정과 고정 검증 프롬프트 |
| `manifests/dataset.example.jsonl` | 데이터셋 레코드 형식 예시 |
| `validate_dataset.py` | 승인 여부, 파일, 이미지, 캡션을 학습 전에 검사 |
| `train_lora.py` | Diffusers UNet에 PEFT LoRA를 추가해 학습 |
| `generate_preview.py` | 같은 시드로 기본 모델과 LoRA 결과를 비교 생성 |

## 1. 환경 설치

작업공간 루트에서 실행한다.

```powershell
uv venv --python 3.12 .venv
.\.venv\Scripts\Activate.ps1
uv pip install torch torchvision --index-url https://download.pytorch.org/whl/cu128
uv pip install -r pipeline/lora/requirements.txt
```

CUDA 휠 주소는 설치 시점의 PyTorch 공식 지원 버전에 맞춰 다시 확인한다.

## 2. 데이터셋 작성

`manifests/dataset.example.jsonl`을 복사해 `manifests/dataset.local.jsonl`을 만든다.
한 줄에 이미지 하나를 기록한다. 경로는 manifest 파일 기준 상대 경로 또는 절대 경로다.

```json
{"image":"../../../review/.../approved.png","caption":"yakiseason_style, adult customer at an izakaya counter, neutral expression, restrained pixel art","approved":true,"kind":"character"}
```

권장 기준은 다음과 같다.

- 첫 실험은 20~50장의 일관된 승인 이미지로 시작한다.
- 화풍 LoRA에는 여러 인물, 배경, 음식과 구도를 골고루 넣는다.
- 특정 캐릭터 동일성 학습은 스타일 데이터셋과 분리한다.
- 왜곡, 다른 화풍, 흐린 보간, 잘못된 손과 소품이 있는 이미지는 제외한다.
- 호출어 `yakiseason_style`을 모든 캡션의 첫 항목으로 둔다.

## 3. 설정과 검증

```powershell
Copy-Item pipeline/lora/config.example.json pipeline/lora/config.local.json
python pipeline/lora/validate_dataset.py pipeline/lora/manifests/dataset.local.jsonl --min-images 20
```

설정 경로는 `config.local.json`이 있는 폴더를 기준으로 해석한다. 이미지의 종횡비를 보존하기
위해 기본 `resize_mode`는 `contain`이다. 장면 이미지에서 여백이 학습되는 문제가 발견되면
작업자 승인 후 `cover`로 비교 실험한다.

## 4. 학습

```powershell
accelerate config default
accelerate launch pipeline/lora/train_lora.py --config pipeline/lora/config.local.json
```

중간 상태는 `output/.../checkpoint-*`, 최종 PEFT 어댑터는 `output/.../lora`에 저장된다.
메모리 부족이 발생하면 먼저 `rank`를 8로 낮추고, 그 다음 resolution을 384로 낮춘다.
학습 스텝을 무작정 줄이는 것은 마지막 선택으로 둔다.

## 5. 고정 프롬프트 비교

```powershell
python pipeline/lora/generate_preview.py `
  --config pipeline/lora/config.local.json `
  --lora pipeline/lora/output/yakiseason-style-v1/lora `
  --output pipeline/lora/previews/yakiseason-style-v1
```

`base`와 `lora` 이미지는 같은 프롬프트와 시드를 사용한다. 다음 항목을 사람이 비교한다.

- 픽셀 밀도, 팔레트, 윤곽선, 조명이 기준 이미지에 가까워졌는가
- 얼굴과 체형이 한 가지로 붕괴하지 않았는가
- 인물 외에도 배경과 음식 프롬프트가 작동하는가
- 이미지 안에 학습 이미지의 구도, 문자, 결함이 복제되지 않았는가
- 가로형·세로형 소비 화면에서 별도 비율 왜곡 없이 적용 가능한가

## 현재 범위

이 초안은 파이프라인과 8GB용 첫 프로필을 구현한 상태다. 실제 학습은 작업자와 아트 규칙을
합의하고 데이터셋 manifest를 승인한 뒤 실행한다. 결과가 유효할 때만 SDXL용 1024px 또는
클라우드 GPU 프로필을 추가한다.
