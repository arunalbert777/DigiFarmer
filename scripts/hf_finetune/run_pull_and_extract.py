#!/usr/bin/env python3
"""Pull a Kaggle kernel and extract simple hyperparameters from the first notebook found.
Usage:
  python scripts/hf_finetune/run_pull_and_extract.py <kernel-slug> <out-dir>
Prints JSON lines: {"notebook": "/path/to/notebook.ipynb"} and {"params": {...}}
"""
import sys
import subprocess
import json
from pathlib import Path
import zipfile
import shutil
import re


def pull_kernel(kernel, out_dir):
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    kaggle = shutil.which('kaggle')
    if not kaggle:
        raise SystemExit('kaggle CLI not found; run pip install kaggle')
    proc = subprocess.run([kaggle, 'kernels', 'pull', kernel, '-p', str(out_dir)], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    # Continue even if non-zero
    if proc.returncode != 0:
        print(json.dumps({'warning': 'kaggle pull failed', 'stderr': proc.stderr}), file=sys.stderr)
    # unzip any zip files
    for z in out_dir.glob('*.zip'):
        try:
            with zipfile.ZipFile(z, 'r') as zf:
                zf.extractall(path=str(out_dir))
        except Exception as e:
            print(json.dumps({'warning': 'unzip failed', 'zip': str(z), 'error': str(e)}), file=sys.stderr)
    # find a notebook
    nb = None
    for p in out_dir.glob('*.ipynb'):
        nb = p
        break
    if not nb:
        for p in out_dir.rglob('*.ipynb'):
            nb = p
            break
    return str(nb) if nb else None


def extract_params_from_notebook(nb_path):
    if not nb_path:
        return {}
    try:
        with open(nb_path, 'r', encoding='utf8') as f:
            nb = json.load(f)
    except Exception as e:
        return {'error': f'failed to read notebook: {e}'}
    src = '\n'.join(''.join(cell.get('source', [])) for cell in nb.get('cells', []) if cell.get('cell_type') in ('code', 'markdown'))
    patterns = {
        'epochs': [r"--num_train_epochs\s*=?\s*(\d+)", r"epochs\s*=\s*(\d+)", r"num_epochs\s*=\s*(\d+)", r"--epochs\s+(\d+)", r"TRAIN_EPOCHS\s*=\s*(\d+)", r"TRAIN_EPOCHS\s*:\s*(\d+)", r"epochs:\s*(\d+)"] ,
        'batch_size':[r"batch_size\s*=\s*(\d+)", r"--per_device_train_batch_size\s+(\d+)", r"--batch-size\s+(\d+)", r"TRAIN_BATCH\s*=\s*(\d+)", r"--train-batch\s+(\d+)"] ,
        'lr':[r"--learning_rate\s+([0-9eE\-\.]+)", r"learning_rate\s*=\s*([0-9eE\-\.]+)", r"lr\s*=\s*([0-9eE\-\.]+)"] ,
        'model':[r"model_name_or_path\s*=\s*['\"]([^'\"]+)['\"]", r"MODEL_NAME\s*=\s*['\"]([^'\"]+)['\"]", r"from_pretrained\(\s*['\"]([^'\"]+)['\"]", r"--model_name_or_path\s+([^\s]+)"]
    }
    res = {}
    for k,ps in patterns.items():
        for p in ps:
            m = re.search(p, src)
            if m:
                res[k] = m.group(1)
                break
    return res


def main():
    if len(sys.argv) < 3:
        print('Usage: run_pull_and_extract.py <kernel-slug> <out-dir>')
        sys.exit(2)
    kernel = sys.argv[1]
    out_dir = sys.argv[2]
    nb = pull_kernel(kernel, out_dir)
    print(json.dumps({'notebook': nb}))
    params = extract_params_from_notebook(nb)
    print(json.dumps({'params': params}))

if __name__ == '__main__':
    main()
