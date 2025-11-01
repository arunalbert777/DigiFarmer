import React, { useState } from "react";

export default function DiseaseDetection() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [fileRef, setFileRef] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileRef(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(String(reader.result || ""));
      setResult(null);
    };
    reader.readAsDataURL(file);
  }

  async function submitImage() {
    if (!imageData) return;
    setLoading(true);
    setResult(null);

    // Attempt client-side TFJS inference using a TFJS model in /models/plant_disease/ via CDN
    try {
      const loadScript = (url: string) =>
        new Promise<void>((res, rej) => {
          if (document.querySelector(`script[src=\"${url}\"]`)) return res();
          const s = document.createElement("script");
          s.src = url;
          s.onload = () => res();
          s.onerror = (e) => rej(e);
          document.head.appendChild(s);
        });

      // Load TFJS runtime from CDN if not present
      if (!(window as any).tf) {
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js",
        );
      }

      const tf = (window as any).tf;
      const modelUrl = "/models/plant_disease/model.json";
      let model: any = null;
      try {
        model = await tf.loadLayersModel(modelUrl);
      } catch (err) {
        try {
          model = await tf.loadGraphModel(modelUrl);
        } catch (err2) {
          model = null;
        }
      }

      if (model) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        const src = imageData as string;
        await new Promise<void>((res, rej) => {
          img.onload = () => res();
          img.onerror = (e) => rej(e);
          img.src = src;
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);

        let tensor = tf.browser.fromPixels(canvas).toFloat();
        tensor = tf.image.resizeBilinear(tensor, [224, 224]);
        tensor = tensor.expandDims(0).div(255.0);

        const out = model.predict(tensor) as any;
        let preds: number[] | any = null;
        if (out && out.data) {
          preds = Array.from(await out.data());
        } else if (Array.isArray(out) && out[0] && out[0].data) {
          preds = Array.from(await out[0].data());
        }

        if (preds && preds.length) {
          const arr = preds.map(Number);
          const max = Math.max(...arr);
          const exps = arr.map((a) => Math.exp(a - max));
          const sum = exps.reduce((a, b) => a + b, 0) || 1;
          const probs = exps.map((e) => e / sum);
          const topIdx = probs.indexOf(Math.max(...probs));
          setResult({
            label: `class_${topIdx}`,
            score: probs[topIdx],
            all: probs,
            model: "client-model",
          });
          setLoading(false);
          try {
            tensor.dispose?.();
          } catch (e) {}
          try {
            (out as any).dispose?.();
          } catch (e) {}
          return;
        }

        if (model.classify) {
          const cls = await model.classify(img);
          setResult({
            label: cls[0]?.className || "unknown",
            score: cls[0]?.probability || 0,
            all: cls,
            model: "client-model",
          });
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn(
        "[detection] client-side tfjs/model not available or failed",
        e,
      );
    }

    // Try client-side MobileNet as fallback via CDN
    try {
      if (!(window as any).mobilenet) {
        await new Promise<void>((res, rej) => {
          const s1 = document.createElement("script");
          s1.src =
            "https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0/dist/mobilenet.min.js";
          s1.onload = () => res();
          s1.onerror = (e) => rej(e);
          document.head.appendChild(s1);
        });
      }
      if (!(window as any).tf) {
        await new Promise<void>((res, rej) => {
          const s2 = document.createElement("script");
          s2.src =
            "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js";
          s2.onload = () => res();
          s2.onerror = (e) => rej(e);
          document.head.appendChild(s2);
        });
      }

      const mobilenet = (window as any).mobilenet;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageData as string;
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = (e) => rej(e);
      });
      const m = await mobilenet.load({ version: 2, alpha: 1.0 });
      const cls = await m.classify(img as any);
      if (cls && cls.length) {
        setResult({
          label: cls[0].className,
          score: cls[0].probability,
          all: cls,
          model: "client-mobilenet",
        });
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn("[detection] client-side mobilenet fallback failed", e);
    }

    // fallback: send to server for detection
    try {
      if (fileRef) {
        const fd = new FormData();
        fd.append("file", fileRef);
        const res = await fetch("/api/detect", { method: "POST", body: fd });
        const data = await res.json().catch(() => null);
        if (!res.ok)
          throw new Error(data?.error || data?.details || JSON.stringify(data));
        setResult(data);
        return;
      }

      const res = await fetch("/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok)
        throw new Error(data?.error || data?.details || JSON.stringify(data));
      setResult(data);
    } catch (e: any) {
      setResult({ error: e.message || String(e) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">AI Disease Detection</h1>
      <p className="mb-4 text-gray-600">
        Upload a photo of the plant or leaf and the AI will attempt to identify
        the disease.
      </p>

      <div className="mb-4">
        <input type="file" accept="image/*" onChange={handleFile} />
      </div>

      {imageData && (
        <div className="mb-4">
          <img
            src={imageData}
            alt="preview"
            className="max-w-full rounded-lg border"
          />
        </div>
      )}

      <div className="flex items-center space-x-2 mb-6">
        <button
          onClick={submitImage}
          disabled={!imageData || loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-60"
        >
          {loading ? "Detecting..." : "Detect Disease"}
        </button>
        <button
          onClick={() => {
            setImageData(null);
            setResult(null);
          }}
          className="px-4 py-2 border rounded-lg"
        >
          Clear
        </button>
      </div>

      {result && (
        <div className="p-4 border rounded-lg bg-white">
          {result.error ? (
            <div className="text-red-600">Error: {String(result.error)}</div>
          ) : (
            <div>
              <h3 className="font-semibold">Detection Result</h3>
              <p className="mt-2">
                Label: <strong>{result.label}</strong>
              </p>
              <p>
                Confidence: <strong>{(result.score * 100).toFixed(1)}%</strong>
              </p>
              <details className="mt-2">
                <summary className="text-sm text-gray-600">Raw output</summary>
                <pre className="text-xs mt-2 max-h-48 overflow-auto">
                  {JSON.stringify(result.all || result.raw || result, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
