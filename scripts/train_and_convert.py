import os
import sys
import json
import pathlib
import subprocess

import tensorflow as tf
import tensorflow_datasets as tfds

OUT_DIR = pathlib.Path('models/plant_disease')
OUT_DIR.mkdir(parents=True, exist_ok=True)
MODEL_H5 = OUT_DIR / 'model.h5'

print('TF version:', tf.__version__)

# Try to load PlantVillage via tfds
try:
    print('Loading PlantVillage dataset (may download ~1GB)...')
    ds, info = tfds.load('plant_village', split='train', shuffle_files=True, as_supervised=True, with_info=True)
except Exception as e:
    print('Failed to load plant_village via tfds:', e)
    # Try loading as full dataset
    try:
        ds_full, info = tfds.load('plant_village', as_supervised=True, with_info=True)
        # ds_full may be dict
        if isinstance(ds_full, dict):
            ds = ds_full['train']
        else:
            ds = ds_full
    except Exception as e2:
        print('Second attempt to load dataset failed:', e2)
        sys.exit(2)

num_classes = info.features['label'].num_classes if info and 'label' in info.features else None
class_names = info.features['label'].names if info and 'label' in info.features else None
print('Num classes:', num_classes)

# Quick preprocessing and subsample for CI-friendly training
IMG_SIZE = 224
BATCH_SIZE = 32

def preprocess(image, label):
    image = tf.image.resize(image, [IMG_SIZE, IMG_SIZE])
    image = tf.cast(image, tf.float32) / 255.0
    return image, label

# Limit dataset size to keep training within action time
TAKE_N = 2000  # take 2000 examples for faster training
SHUFFLE_BUF = 1000

ds = ds.shuffle(SHUFFLE_BUF)
if TAKE_N:
    ds = ds.take(TAKE_N)

train_size = int(0.8 * TAKE_N)
train_ds = ds.take(train_size).map(preprocess).batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)
val_ds = ds.skip(train_size).map(preprocess).batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

if not num_classes:
    # attempt to infer classes from dataset
    try:
        labels = []
        for _, l in ds.take(100):
            labels.append(int(l.numpy()))
        num_classes = max(labels) + 1
    except Exception:
        num_classes = 38  # fallback to common PlantVillage classes

print('Using', num_classes, 'classes')

# Build model (transfer learning MobileNetV2)
base = tf.keras.applications.MobileNetV2(input_shape=(IMG_SIZE, IMG_SIZE, 3), include_top=False, weights='imagenet')
base.trainable = False

inputs = tf.keras.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
x = base(inputs, training=False)
x = tf.keras.layers.GlobalAveragePooling2D()(x)
x = tf.keras.layers.Dropout(0.3)(x)
outputs = tf.keras.layers.Dense(num_classes, activation='softmax')(x)
model = tf.keras.Model(inputs, outputs)

model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4), loss='sparse_categorical_crossentropy', metrics=['accuracy'])

model.summary()

EPOCHS = 3

print('Starting training for', EPOCHS, 'epochs')
model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS)

print('Saving Keras model to', MODEL_H5)
model.save(str(MODEL_H5))

# Save class names if available
if class_names:
    labels_path = OUT_DIR / 'labels.json'
    print('Saving labels to', labels_path)
    with open(labels_path, 'w') as f:
        json.dump(class_names, f)

# Convert to TFJS format using tensorflowjs_converter (CLI)
print('Converting to TFJS format...')
try:
    subprocess.check_call(['tensorflowjs_converter', '--input_format=keras', str(MODEL_H5), str(OUT_DIR)])
except Exception as e:
    print('Conversion failed:', e)
    sys.exit(3)

print('TFJS model generated at', OUT_DIR / 'model.json')
