import React, { useState } from "react";

export default function DiseaseDetection() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
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
    try {
      const res = await fetch("/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await res.json();
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
