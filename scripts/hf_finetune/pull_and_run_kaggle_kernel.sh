#!/usr/bin/env bash
set -euo pipefail

# Pull and optionally execute a Kaggle kernel (notebook) locally.
# Usage:
# 1) Ensure Kaggle CLI is installed and credentials are set (~/.kaggle/kaggle.json or KAGGLE_USERNAME/KAGGLE_KEY env vars).
# 2) Run: ./pull_and_run_kaggle_kernel.sh imtkaggleteam/plant-diseases-detection-pytorch
# 3) The kernel notebook will be downloaded to ./kaggle_kernels/<kernel-slug>/
# 4) To execute the notebook (optional), ensure papermill is installed and pass --execute

KERNEL_SLUG=${1:-}
EXECUTE=false
OUT_DIR="kaggle_kernels"

if [ -z "$KERNEL_SLUG" ]; then
  echo "Usage: $0 <kaggle-kernel-slug> [--execute]"
  echo "Example: $0 imtkaggleteam/plant-diseases-detection-pytorch --execute"
  exit 1
fi
if [ "${2:-}" = "--execute" ]; then
  EXECUTE=true
fi

mkdir -p "$OUT_DIR"

# Check kaggle CLI
if ! command -v kaggle >/dev/null 2>&1; then
  echo "kaggle CLI not found. Install with: pip install kaggle" >&2
  exit 2
fi

# Verify credentials
if [ ! -f "$HOME/.kaggle/kaggle.json" ] && [ -z "${KAGGLE_USERNAME:-}" ]; then
  echo "Kaggle credentials not found. Place ~/.kaggle/kaggle.json or set KAGGLE_USERNAME/KAGGLE_KEY env vars." >&2
  exit 3
fi

# Pull the kernel
echo "Pulling Kaggle kernel: $KERNEL_SLUG"
TARGET_DIR="$OUT_DIR/$(echo "$KERNEL_SLUG" | tr '/' '_')"
mkdir -p "$TARGET_DIR"

if ! kaggle kernels pull "$KERNEL_SLUG" -p "$TARGET_DIR" ; then
  echo "Failed to pull kernel $KERNEL_SLUG" >&2
  exit 4
fi

# If a zip artifact was downloaded by the CLI, unzip it into the target directory
ZIPFILE="$(ls "$TARGET_DIR"/*.zip 2>/dev/null | head -n1 || true)"
if [ -n "$ZIPFILE" ]; then
  echo "Unzipping $ZIPFILE into $TARGET_DIR"
  unzip -o "$ZIPFILE" -d "$TARGET_DIR" || true
fi

echo "Kernel pulled to: $TARGET_DIR"

# Find notebook file
NOTEBOOK="$(ls "$TARGET_DIR"/*.ipynb 2>/dev/null | head -n1 || true)"
if [ -z "$NOTEBOOK" ]; then
  echo "No notebook (.ipynb) found in $TARGET_DIR" >&2
  exit 5
fi

echo "Found notebook: $NOTEBOOK"

if [ "$EXECUTE" = true ]; then
  if ! command -v papermill >/dev/null 2>&1; then
    echo "papermill not found. Installing papermill..."
    pip install papermill
  fi
  echo "Executing notebook with papermill..."
  OUTPUT_NOTEBOOK="${NOTEBOOK%.*}-executed.ipynb"
  papermill "$NOTEBOOK" "$OUTPUT_NOTEBOOK" --cwd "$TARGET_DIR"
  echo "Executed notebook output: $OUTPUT_NOTEBOOK"
fi

echo "Done."
