import { RequestHandler } from "express";

export const handleDiseaseDetect: RequestHandler = async (req, res) => {
  try {
    // Debug incoming request
    console.log("[disease] incoming headers:", req.headers);
    // Accept JSON { image: base64 string } or multipart (not implemented)
    const body = req.body || {};
    console.log("[disease] body keys:", Object.keys(body));
    const base64 = typeof body.image === "string" ? body.image : undefined;

    if (!base64) {
      console.error(
        "[disease] Missing image in body; body preview keys:",
        Object.keys(body).slice(0, 10),
      );
      return res
        .status(400)
        .json({ error: "Missing 'image' (base64) in request body" });
    }

    console.log("[disease] received image length:", base64.length);

    const hfKey = process.env.HUGGINGFACE_API_KEY;
    const hfModel =
      process.env.HUGGINGFACE_MODEL ||
      process.env.HUGGINGFACE_MODEL ||
      "nateraw/plant-disease-classification";

    if (!hfKey) {
      return res.status(500).json({
        error: "Server misconfiguration: missing HUGGINGFACE_API_KEY",
      });
    }

    // Decode base64 (allow data URL or raw base64)
    const raw = base64.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(raw, "base64");

    const url = `https://api-inference.huggingface.co/models/${hfModel}`;

    const r = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfKey}`,
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    });

    if (!r.ok) {
      const text = await r.text().catch(() => null);
      return res.status(502).json({
        error: "Upstream inference error",
        details: text || r.statusText,
      });
    }

    const json = await r.json();
    // Expected shape for image-classification: [{label,score}, ...]
    if (Array.isArray(json) && json.length) {
      const top = json[0];
      // Return friendly result
      return res
        .status(200)
        .json({ label: top.label, score: top.score, all: json });
    }

    // If model returned a different shape, return raw
    return res.status(200).json({ raw: json });
  } catch (err: any) {
    console.error("[disease] error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};
