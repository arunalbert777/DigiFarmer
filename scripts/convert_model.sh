#!/usr/bin/env bash
set -e

# Usage: scripts/convert_model.sh <path-to-keras-h5>
# Converts a Keras .h5 model to TensorFlow.js format into models/plant_disease/

MODEL_H5=${1:-models/plant_disease/model.h5}
OUT_DIR=models/plant_disease

if [ ! -f "$MODEL_H5" ]; then
  echo "Model file not found: $MODEL_H5"
  exit 2
fi

python -m pip install --upgrade pip
python -m pip install tensorflow==2.12.0 tensorflowjs==3.21.0 h5py

mkdir -p "$OUT_DIR"

echo "Converting $MODEL_H5 -> $OUT_DIR"
tensorflowjs_converter --input_format=keras "$MODEL_H5" "$OUT_DIR"

echo "Conversion finished. model.json located at $OUT_DIR/model.json"
