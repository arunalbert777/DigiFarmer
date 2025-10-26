"""
Fine-tune an image classification model with Hugging Face Trainer.
Example:
  HF_TOKEN=xxx python train.py --dataset_path data/hf_dataset --model_name_or_path google/vit-base-patch16-224 --output_dir outputs/plant-vit --per_device_train_batch_size 16 --num_train_epochs 6 --push_to_hub
"""
import argparse
import os
from pathlib import Path
from datasets import load_dataset, load_metric
from transformers import (
    AutoFeatureExtractor,
    AutoModelForImageClassification,
    TrainingArguments,
    Trainer,
)
import numpy as np
import evaluate


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--dataset_path', required=True, help='Path to dataset directory prepared by prepare_dataset')
    p.add_argument('--model_name_or_path', default='google/vit-base-patch16-224')
    p.add_argument('--output_dir', default='outputs/plant-model')
    p.add_argument('--num_train_epochs', type=int, default=6)
    p.add_argument('--per_device_train_batch_size', type=int, default=16)
    p.add_argument('--per_device_eval_batch_size', type=int, default=32)
    p.add_argument('--learning_rate', type=float, default=3e-5)
    p.add_argument('--push_to_hub', action='store_true')
    p.add_argument('--hub_model_id', type=str, default=None)
    return p.parse_args()


def main():
    args = parse_args()
    data_dir = Path(args.dataset_path)
    if not data_dir.exists():
        raise SystemExit('dataset_path does not exist')

    # Load dataset from imagefolder structure
    dataset = load_dataset('imagefolder', data_dir=str(data_dir))
    labels = dataset['train'].features['label'].names
    num_labels = len(labels)
    print('Detected labels:', labels)

    feature_extractor = AutoFeatureExtractor.from_pretrained(args.model_name_or_path)

    def transform(examples):
        images = [img.convert('RGB') for img in examples['image']]
        inputs = feature_extractor(images, return_tensors='np')
        return {k: v for k, v in inputs.items()}

    # Map train/validation/test if present
    column_names = dataset['train'].column_names
    id2label = {i: l for i, l in enumerate(labels)}
    label2id = {l: i for i, l in id2label.items()}

    model = AutoModelForImageClassification.from_pretrained(
        args.model_name_or_path,
        num_labels=num_labels,
        id2label=id2label,
        label2id=label2id,
    )

    # Preprocess datasets
    prepared = {}
    for split in dataset.keys():
        print('Preparing split', split)
        prepared[split] = dataset[split].with_transform(transform)

    metric_acc = evaluate.load('accuracy')
    metric_f1 = evaluate.load('f1')

    def compute_metrics(p):
        preds = p.predictions[0] if isinstance(p.predictions, tuple) else p.predictions
        preds = np.argmax(preds, axis=1)
        labels = p.label_ids
        acc = metric_acc.compute(predictions=preds, references=labels)
        f1 = metric_f1.compute(predictions=preds, references=labels, average='weighted')
        return {**acc, 'f1': f1['f1']}

    training_args = TrainingArguments(
        output_dir=args.output_dir,
        per_device_train_batch_size=args.per_device_train_batch_size,
        per_device_eval_batch_size=args.per_device_eval_batch_size,
        evaluation_strategy='epoch',
        save_strategy='epoch',
        num_train_epochs=args.num_train_epochs,
        learning_rate=args.learning_rate,
        weight_decay=0.01,
        push_to_hub=args.push_to_hub,
        hub_model_id=args.hub_model_id,
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=prepared.get('train'),
        eval_dataset=prepared.get('validation'),
        compute_metrics=compute_metrics,
    )

    trainer.train()
    trainer.evaluate()

    if args.push_to_hub:
        trainer.push_to_hub()


if __name__ == '__main__':
    main()
