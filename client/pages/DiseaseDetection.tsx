import React, { useEffect, useRef, useState } from "react";

export default function DiseaseDetection() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [fileRef, setFileRef] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [usingCamera, setUsingCamera] = useState(false);
  const [diseaseMap, setDiseaseMap] = useState<Record<string, any> | null>(
    null,
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [classLabels, setClassLabels] = useState<string[] | null>(null);

  useEffect(() => {
    // Load multilingual disease mapping data
    fetch("/data/diseases_multilingual.json")
      .then((r) => r.json())
      .then((j) => setDiseaseMap(j))
      .catch(() => setDiseaseMap(null));

    // Try to load TFJS labels.json produced during conversion/training, fall back to server metadata endpoint
    fetch("/models/plant_disease/labels.json")
      .then((r) => {
        if (!r.ok) throw new Error("no labels");
        return r.json();
      })
      .then((j) => {
        if (Array.isArray(j)) setClassLabels(j as string[]);
      })
      .catch(async () => {
        // try server endpoint
        try {
          const r2 = await fetch("/api/detect/labels");
          if (!r2.ok) throw new Error("no server labels");
          const payload = await r2.json();
          if (payload && Array.isArray(payload.labels)) setClassLabels(payload.labels as string[]);
          else setClassLabels(null);
        } catch (e) {
          setClassLabels(null);
        }
      });

    return () => stopCamera();
  }, []);

  function stopCamera() {
    try {
      streamRef.current?.getTracks?.().forEach((t) => t.stop());
    } catch (e) {}
    streamRef.current = null;
    setUsingCamera(false);
  }

  async function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera not supported in this browser.");
      return;
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
      setUsingCamera(true);
    } catch (e) {
      console.error("camera start failed", e);
      alert(
        "Unable to access camera. Please allow camera permissions or use file upload.",
      );
    }
  }

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

  function dataURLtoFile(dataurl: string, filename = "capture.jpg") {
    const arr = dataurl.split(",");
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: "image/jpeg" });
  }

  async function captureFromCamera() {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth || 1280;
    canvas.height = v.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setImageData(dataUrl);
    setFileRef(dataURLtoFile(dataUrl));
    setResult(null);
    stopCamera();
  }

  async function submitImage() {
    if (!imageData) return;
    setLoading(true);
    setResult(null);

    // Attempt client-side TFJS inference using a TFJS model in /models/plant_disease/ via CDN
    try {
      const loadScript = (url: string) =>
        new Promise<void>((res, rej) => {
          if (document.querySelector(`script[src="${url}"]`)) return res();
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
          const label = `class_${topIdx}`;
          const score = probs[topIdx];

          const enriched = enrichResult(label, score);

          setResult({
            label,
            score,
            all: probs,
            model: "client-model",
            ...enriched,
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
          const label = cls[0]?.className || "unknown";
          const score = cls[0]?.probability || 0;

          const enriched = enrichResult(label, score);

          setResult({
            label,
            score,
            all: cls,
            model: "client-model",
            ...enriched,
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
        const label = cls[0].className;
        const score = cls[0].probability;
        const enriched = enrichResult(label, score);
        setResult({
          label,
          score,
          all: cls,
          model: "client-mobilenet",
          ...enriched,
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
        const enriched = enrichResult(
          data?.label || data?.disease || "unknown",
          data?.score || 0,
        );
        setResult({ ...data, ...enriched });
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
      const enriched = enrichResult(
        data?.label || data?.disease || "unknown",
        data?.score || 0,
      );
      setResult({ ...data, ...enriched });
    } catch (e: any) {
      setResult({ error: e.message || String(e) });
    } finally {
      setLoading(false);
    }
  }

  function enrichResult(label: string, score: number) {
    if (!diseaseMap) return {};

    // If label is a class index like class_12 and we have classLabels, map it
    const mClass = label.match(/^class_(\d+)$/i);
    if (mClass && (window as any)._classLabels === undefined) {
      // also support older global storage if needed
    }
    if (mClass && classLabels && classLabels.length > 0) {
      const idx = Number(mClass[1]);
      if (!Number.isNaN(idx) && idx >= 0 && idx < classLabels.length) {
        const mapped = classLabels[idx];
        label = String(mapped);
      }
    }

    // direct match
    if (diseaseMap[label]) return { details: diseaseMap[label] };

    // try normalized label: replace spaces with _ and strip odd chars
    const normalized = label.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_()]/g, "");
    if (diseaseMap[normalized]) return { details: diseaseMap[normalized] };

    // attempt to match common PlantVillage patterns by splitting
    const tryKey = (k: string) => {
      if (diseaseMap[k]) return diseaseMap[k];
      return null;
    };

    // if label contains '___' try direct (PlantVillage format)
    if (label.includes("___") && tryKey(label)) return { details: tryKey(label) };

    // fallback: try to parse plant and disease from label like 'Tomato___Late_blight'
    const parts = label.split("___");
    if (parts.length === 2) {
      const key = `${parts[0]}___${parts[1]}`;
      if (diseaseMap[key]) return { details: diseaseMap[key] };
    }

    // If still unresolved and 'healthy' exists, return healthy suggestion for low confidence
    const m = label.match(/^class_(\d+)$/i);
    if (m) {
      if (diseaseMap["healthy"]) return { details: diseaseMap["healthy"] };

      return {
        details: {
          plant_en: "Unknown",
          plant_kn: "ಅನಾಮಧೇಯ",
          disease_en: "Unknown disease",
          disease_kn: "ಅನಾಮಧೇಯ ರೋಗ",
          treatment_en: [
            "Image unclear — retake a close-up of the affected leaf or capture multiple angles.",
            "Provide crop type and recent symptoms for better guidance.",
          ],
          treatment_kn: [
            "ಚಿತ್ರ ಅಸ್ಪಷ್ಟವಾಗಿದೆ — ಪ್ರಭಾವಿತ ಎಲೆನ ಸಮೀಪದಿಂದ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ ಅಥವಾ ಹಲವಾರು ಕೋಣಗಳನ್ನು ಸೆರೆಹಿಡಿಯಿರಿ.",
            "ಉತ್ತಮ ಸಲಹೆಗಾಗಿ ಬೆಳೆ ಪ್ರಕಾರ ಮತ್ತು ಇತ್ತೀಚಿನ ಲಕ್ಷಣಗಳನ್ನು ಒದಗಿಸಿ.",
          ],
          reference: "PlantVillage",
        },
      };
    }

    // final fallback: return nothing
    return {};
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">AI Disease Detection</h1>
      <p className="mb-4 text-gray-600">
        Upload or capture a photo of the plant or leaf and the AI will attempt
        to identify the disease and provide treatment recommendations in English
        and Kannada.
      </p>

      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <input type="file" accept="image/*" onChange={handleFile} />
        <button
          onClick={() => {
            if (usingCamera) stopCamera();
            else startCamera();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          {usingCamera ? "Stop Camera" : "Use Camera"}
        </button>
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

      {usingCamera && (
        <div className="mb-4">
          <video
            ref={videoRef}
            className="w-full rounded-lg border"
            muted
            playsInline
            autoPlay
          />
          <div className="mt-2">
            <button
              onClick={captureFromCamera}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Capture Photo
            </button>
            <button
              onClick={stopCamera}
              className="ml-2 px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {imageData && (
        <div className="mb-4">
          <img
            src={imageData}
            alt="preview"
            className="max-w-full rounded-lg border"
          />
        </div>
      )}

      {result && (
        <div className="p-4 border rounded-lg bg-white">
          {result.error ? (
            <div className="text-red-600">Error: {String(result.error)}</div>
          ) : (
            <div>
              <h3 className="font-semibold">Detection Result</h3>
              <p className="mt-2">
                Label: <strong>{String(result.label)}</strong>
              </p>
              <p>
                Confidence: <strong>{(result.score * 100).toFixed(1)}%</strong>
              </p>

              {result.details ? (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">English</h4>
                    <p className="mt-2">
                      Plant: <strong>{result.details.plant_en}</strong>
                    </p>
                    <p>
                      Disease: <strong>{result.details.disease_en}</strong>
                    </p>
                    <div className="mt-3">
                      <h5 className="font-medium">Treatment (English)</h5>
                      <ol className="list-decimal list-inside mt-2 text-sm">
                        {result.details.treatment_en.map(
                          (s: string, i: number) => (
                            <li key={i} className="mb-1">
                              {s}
                            </li>
                          ),
                        )}
                      </ol>
                    </div>
                    {result.details.reference && (
                      <p className="mt-2 text-xs text-gray-600">
                        Reference: {result.details.reference}
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium">ಕನ್ನಡ</h4>
                    <p className="mt-2">
                      ಸಸ್ಯ: <strong>{result.details.plant_kn}</strong>
                    </p>
                    <p>
                      ರೋಗ: <strong>{result.details.disease_kn}</strong>
                    </p>
                    <div className="mt-3">
                      <h5 className="font-medium">ಚಿಕಿತ್ಸೆ (ಕನ್ನಡ)</h5>
                      <ol className="list-decimal list-inside mt-2 text-sm">
                        {result.details.treatment_kn.map(
                          (s: string, i: number) => (
                            <li key={i} className="mb-1">
                              {s}
                            </li>
                          ),
                        )}
                      </ol>
                    </div>
                  </div>
                </div>
              ) : (
                <details className="mt-2">
                  <summary className="text-sm text-gray-600">
                    Raw output
                  </summary>
                  <pre className="text-xs mt-2 max-h-48 overflow-auto">
                    {JSON.stringify(
                      result.all || result.raw || result,
                      null,
                      2,
                    )}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
