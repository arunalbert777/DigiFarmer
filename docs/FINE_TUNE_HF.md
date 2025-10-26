# Fine-tune and host a Plant Leaf Disease Model on Hugging Face

This guide explains how to prepare a dataset, fine-tune an image-classification model using the Hugging Face Hub, and deploy it for inference.

Overview

- Dataset format: image folders per class (ImageNet-style) or CSV mapping image -> label
- Training: use Hugging Face `datasets` + `transformers` with ViT or ResNet backbones
- Hosting: push the fine-tuned model to the Hugging Face Hub and use the Inference API

Requirements

- Python 3.8+
- Install: `pip install datasets transformers accelerate timm torchvision evaluate huggingface_hub` (see scripts/requirements.txt)
- A Hugging Face account and a write token (HF_TOKEN) with repo:create, repo:write scopes

Dataset

- Preferred layout (ImageFolder):

  dataset/
  train/
  EarlyBlight/
  img1.jpg
  img2.jpg
  LateBlight/
  Healthy/
  validation/
  EarlyBlight/
  LateBlight/
  Healthy/

- Alternatively a CSV: `path,label` per line.
- Aim for balanced classes, min ~100 images per class for basic fine-tuning; more data yields better accuracy.
- Recommended split: 80% train, 10% validation, 10% test.

Preprocessing & Augmentation

- Resize images to 224x224 (ViT) or 256->224 crop for ResNet
- Use random flips/rotations, color jitter, and brightness adjustments to increase robustness
- Normalize using the image processor's mean/std

Training Steps (high level)

1. Prepare dataset in ImageFolder format (or CSV). Use `scripts/hf_finetune/prepare_dataset.py` to convert and create splits.
2. Train with `scripts/hf_finetune/train.py` using a pre-trained ViT or ResNet checkpoint. Default uses `google/vit-base-patch16-224`.
3. Evaluate on the validation and test sets; tune hyperparameters.
4. Push the trained model to the Hugging Face Hub using `--push_to_hub` and your HF_TOKEN.
5. Set the `HUGGINGFACE_MODEL` env var on your server to the model repo id and redeploy.

Files added

- scripts/hf_finetune/prepare_dataset.py — convert folder/CSV to HF dataset and create splits
- scripts/hf_finetune/train.py — fine-tune ViT or ResNet, evaluate, optionally push to hub
- scripts/hf_finetune/requirements.txt — Python deps

Quick start example

1. Install dependencies

python -m pip install -r scripts/hf_finetune/requirements.txt

2. Put images under `data/plant_dataset/train/` and `data/plant_dataset/validation/` as described

3. Run training (example):

HF_TOKEN="<your_hf_token>" python scripts/hf_finetune/train.py \
 --dataset_path data/plant_dataset --model_name_or_path google/vit-base-patch16-224 \
 --output_dir outputs/plant-vit --per_device_train_batch_size 16 --learning_rate 3e-5 --num_train_epochs 8 --push_to_hub

After push, update your server HUGGINGFACE_MODEL to your-hf-username/repo-name and redeploy.

If you want, I can:

- Prepare a colab/notebook for training on GPU
- Implement a script to convert common plant-disease datasets (PlantVillage) into the required layout
- Kick off fine-tuning if you provide HF_TOKEN and dataset (you can connect Supabase/Neon or provide dataset link).

---
