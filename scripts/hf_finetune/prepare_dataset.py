"""
Prepare image dataset for Hugging Face training.
Usage:
  python prepare_dataset.py --data_dir path/to/imagefolder --out_dir data/hf_dataset --val_split 0.1 --test_split 0.1

Assumes ImageFolder structure: data_dir/train/<class>/*.jpg or single folder with subfolders per class.
"""
import argparse
import os
import shutil
from pathlib import Path
from sklearn.model_selection import train_test_split


def gather_images(data_dir):
    data_dir = Path(data_dir)
    classes = [p.name for p in data_dir.iterdir() if p.is_dir()]
    items = []
    for cls in classes:
        for img in (data_dir / cls).glob('*'):
            if img.is_file():
                items.append((str(img), cls))
    return items


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--data_dir', required=True)
    p.add_argument('--out_dir', required=True)
    p.add_argument('--val_split', type=float, default=0.1)
    p.add_argument('--test_split', type=float, default=0.1)
    args = p.parse_args()

    items = gather_images(args.data_dir)
    if not items:
        print('No images found in', args.data_dir)
        return

    paths, labels = zip(*items)
    train_paths, temp_paths, train_labels, temp_labels = train_test_split(paths, labels, test_size=(args.val_split + args.test_split), stratify=labels, random_state=42)
    if args.test_split <= 0:
        val_paths, val_labels = temp_paths, temp_labels
        test_paths, test_labels = [], []
    else:
        rel_test = args.test_split / (args.val_split + args.test_split)
        val_paths, test_paths, val_labels, test_labels = train_test_split(temp_paths, temp_labels, test_size=rel_test, stratify=temp_labels, random_state=42)

    out = Path(args.out_dir)
    for split, sp_paths, sp_labels in [('train', train_paths, train_labels), ('validation', val_paths, val_labels), ('test', test_paths, test_labels)]:
        d = out / split
        if d.exists():
            shutil.rmtree(d)
        for pth, lbl in zip(sp_paths, sp_labels):
            tgt_dir = d / lbl
            tgt_dir.mkdir(parents=True, exist_ok=True)
            shutil.copy(pth, tgt_dir / Path(pth).name)
    print('Dataset prepared at', out)


if __name__ == '__main__':
    main()
