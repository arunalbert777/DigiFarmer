#!/usr/bin/env python3
"""Pull a Kaggle kernel (notebook) into a target directory and unzip any downloaded zip archive.

Usage:
  python scripts/hf_finetune/pull_kaggle_kernel.py imtkaggleteam/plant-diseases-detection-pytorch /tmp/kaggle_kernel

This script prefers using the kaggle CLI but handles cases where the CLI downloads a .zip file.
"""
import sys
import os
import subprocess
import shutil
from pathlib import Path
import zipfile

def main():
    if len(sys.argv) < 3:
        print("Usage: pull_kaggle_kernel.py <kernel-slug> <out-dir>")
        sys.exit(2)
    kernel = sys.argv[1]
    out_dir = Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)

    # Ensure kaggle CLI is available
    kaggle_cmd = shutil.which('kaggle')
    if not kaggle_cmd:
        print('kaggle CLI not found. Please install with: pip install kaggle', file=sys.stderr)
        sys.exit(3)

    print(f'Pulling Kaggle kernel: {kernel} -> {out_dir}')
    proc = subprocess.run([kaggle_cmd, 'kernels', 'pull', kernel, '-p', str(out_dir)], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if proc.returncode != 0:
        print('kaggle kernels pull failed:', proc.stderr, file=sys.stderr)
        # still continue to look for files

    # If a zip file is present, unzip it
    zip_files = list(out_dir.glob('*.zip'))
    if zip_files:
        for z in zip_files:
            try:
                print(f'Unzipping {z} -> {out_dir}')
                with zipfile.ZipFile(z, 'r') as zf:
                    zf.extractall(path=str(out_dir))
            except Exception as e:
                print('Failed to unzip', z, 'error:', e, file=sys.stderr)

    # Find a notebook inside the directory
    notebooks = list(out_dir.glob('*.ipynb'))
    if notebooks:
        nb = notebooks[0]
        print('Found notebook:', nb)
        print(str(nb))
        return

    # If no notebook found, try to search recursively
    notebooks = list(out_dir.rglob('*.ipynb'))
    if notebooks:
        nb = notebooks[0]
        print('Found notebook (recursive):', nb)
        print(str(nb))
        return

    print('No notebook (.ipynb) found in', out_dir, file=sys.stderr)
    sys.exit(5)

if __name__ == '__main__':
    main()
