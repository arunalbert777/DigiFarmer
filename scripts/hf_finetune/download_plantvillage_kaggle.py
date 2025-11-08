"""
Download the PlantVillage dataset from Kaggle and prepare it for fine-tuning.

Usage (recommended in local dev or Colab):

1) Ensure Kaggle credentials are available as environment variables or kaggle.json in ~/.kaggle/
   - KAGGLE_USERNAME and KAGGLE_KEY, OR
   - place ~/.kaggle/kaggle.json (with {"username":"...","key":"..."})

2) Install dependencies (locally or in Colab):
   pip install kaggle

3) Run the script to download and extract dataset, then prepare HF dataset layout:
   python download_plantvillage_kaggle.py --dataset emmarex/plantdisease --out_dir data/plantvillage_raw --prepare_out data/hf_dataset

Notes:
- This script only downloads and organizes files. It will call prepare_dataset.py (already included in this repo) to create train/validation/test splits in ImageFolder format.
- If you run in Colab, you can mount Google Drive and set --out_dir to a Drive path to persist data.
"""

import argparse
import os
import subprocess
import sys
from pathlib import Path


def run_cmd(cmd, cwd=None):
    print("Running:", " ".join(cmd))
    proc = subprocess.Popen(cmd, cwd=cwd)
    proc.communicate()
    if proc.returncode != 0:
        raise SystemExit(f"Command failed: {' '.join(cmd)}")


def download_with_kaggle_cli(dataset_slug: str, download_dir: Path):
    # Use kaggle CLI (preferred when kaggle package not installed)
    download_dir.mkdir(parents=True, exist_ok=True)
    cmd = [sys.executable, "-m", "kaggle", "datasets", "download", "-d", dataset_slug, "-p", str(download_dir), "--unzip"]
    run_cmd(cmd)


def download_with_kaggle_api(dataset_slug: str, download_dir: Path):
    try:
        from kaggle.api.kaggle_api_extended import KaggleApi
    except Exception as e:
        raise
    api = KaggleApi()
    api.authenticate()
    download_dir.mkdir(parents=True, exist_ok=True)
    print("Downloading via Kaggle API to", download_dir)
    api.dataset_download_files(dataset_slug, path=str(download_dir), unzip=True)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--dataset", default="emmarex/plantdisease", help="Kaggle dataset slug, e.g. emmarex/plantdisease")
    p.add_argument("--out_dir", default="data/plantvillage_raw", help="Where to download/unzip the raw dataset")
    p.add_argument("--prepare_out", default="data/hf_dataset", help="Output dir for prepared HF ImageFolder dataset (train/validation/test)")
    p.add_argument("--use_api", action="store_true", help="Use kaggle API python package instead of kaggle CLI module")
    args = p.parse_args()

    dataset_slug = args.dataset
    out_dir = Path(args.out_dir)

    print("Checking Kaggle credentials...")
    kaggle_json = Path.home() / ".kaggle" / "kaggle.json"
    if not args.use_api:
        # Try to use kaggle CLI via python -m kaggle; ensure environment variables or kaggle.json exist
        if ("KAGGLE_USERNAME" in os.environ and "KAGGLE_KEY" in os.environ) or kaggle_json.exists():
            try:
                download_with_kaggle_cli(dataset_slug, out_dir)
            except Exception as e:
                print("kaggle CLI download failed:", e)
                print("Trying kaggle API package as fallback...")
                download_with_kaggle_api(dataset_slug, out_dir)
        else:
            print("Kaggle credentials not found. Set KAGGLE_USERNAME and KAGGLE_KEY or place ~/.kaggle/kaggle.json")
            raise SystemExit(1)
    else:
        download_with_kaggle_api(dataset_slug, out_dir)

    print("Download complete. Inspecting folder:", out_dir)
    # Try to locate a top-level folder containing images
    # Common layout: PlantVillage dataset contains 'images' folder or 'plantdisease' subfolders
    candidates = [p for p in out_dir.iterdir() if p.is_dir()]
    if not candidates:
        print("No directories found in downloaded dataset. Please inspect:", out_dir)
        return

    # If there's a single folder that looks like images/classes, use it
    data_src = None
    for c in candidates:
        # Heuristic: folder contains subfolders or many image files
        subdirs = [x for x in c.iterdir() if x.is_dir()]
        files = [x for x in c.iterdir() if x.is_file()]
        if subdirs:
            data_src = c
            break
        if len(files) > 50:
            data_src = c
            break

    if not data_src:
        # fallback to first candidate
        data_src = candidates[0]

    print("Using data source:", data_src)

    # Call prepare_dataset.py to create train/validation/test splits in ImageFolder format
    prepare_script = Path(__file__).resolve().parent / "prepare_dataset.py"
    if prepare_script.exists():
        cmd = [sys.executable, str(prepare_script), "--data_dir", str(data_src), "--out_dir", str(Path(args.prepare_out)), "--val_split", "0.1", "--test_split", "0.1"]
        run_cmd(cmd)
        print("Prepared HF dataset at", args.prepare_out)
    else:
        print("prepare_dataset.py not found. Please run it manually with the downloaded files.")


if __name__ == '__main__':
    main()
