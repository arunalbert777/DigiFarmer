import { RequestHandler } from "express";

export const handleDiseaseDetect: RequestHandler = async (req, res) => {
  try {
    console.log("[disease] incoming headers:", req.headers);

    // Support both multipart file uploads (req.file.buffer) and JSON { image: 'data:...base64,...' }
    let buffer: Buffer | undefined;

    // Multipart parsers (multer, busboy, etc.) were removed to avoid build issues
    // but some clients may still attempt multipart uploads. Detect if middleware
    // populated req.file and use it.
    if ((req as any).file && (req as any).file.buffer) {
      buffer = (req as any).file.buffer as Buffer;
      console.log("[disease] received multipart file, size:", buffer.length);
    } else {
      // req.body may be an object (parsed JSON), a string (raw body forwarded), or a Buffer
      let body: any = req.body;
      console.log("[disease] raw body type:", typeof body);

      // If body is a string, try to parse it as JSON. Some serverless adapters
      // forward the body as a JSON string instead of an object.
      if (typeof body === "string") {
        try {
          body = JSON.parse(body);
          console.log("[disease] parsed string body as JSON");
        } catch (e) {
          // Not JSON — it might be a raw data URL or raw base64 string
          const maybe = body as string;
          const isDataUrl = maybe.startsWith("data:");
          const isBase64 = /^[A-Za-z0-9+/=\n\r]+$/.test(maybe.replace(/\s+/g, ""));
          if (isDataUrl || isBase64) {
            const raw = maybe.replace(/^data:[^;]+;base64,/, "");
            buffer = Buffer.from(raw, "base64");
            console.log("[disease] decoded buffer from raw string body, length:", buffer.length);
          }
        }
      }

      // If body is a Buffer (some adapters may supply it), use it directly
      if (!buffer && Buffer.isBuffer(body)) {
        buffer = body as Buffer;
        console.log("[disease] body is buffer, length:", buffer.length);
      }

      // If we still don't have a buffer, expect a JSON object like { image: 'data:...base64,...' }
      if (!buffer) {
        const base64 = body && typeof body.image === "string" ? body.image : undefined;
        if (!base64) {
          console.error("[disease] Missing image in body; body preview keys:", body && typeof body === "object" ? Object.keys(body).slice(0, 10) : body);
          return res.status(400).json({ error: "Missing 'image' (base64) in request body" });
        }

        const raw = base64.replace(/^data:[^;]+;base64,/, "");
        buffer = Buffer.from(raw, "base64");
        console.log("[disease] received image length:", buffer.length);
      }
    }

    const hfKey = process.env.HUGGINGFACE_API_KEY;
    const hfModel = process.env.HUGGINGFACE_MODEL || "malifiahm/plant_disease_classification";

    if (!hfKey) {
      return res.status(500).json({ error: "Server misconfiguration: missing HUGGINGFACE_API_KEY" });
    }

    if (!buffer || !buffer.length) {
      return res.status(400).json({ error: "Empty image buffer" });
    }

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
      console.error("[disease] upstream error status:", r.status, text);
      return res.status(502).json({ error: "Upstream inference error", details: text || r.statusText });
    }

    const json = await r.json().catch((e) => {
      console.error("[disease] failed to parse HF response as JSON", e);
      return null;
    });

    if (Array.isArray(json) && json.length) {
      const top = json[0];
      return res.status(200).json({ label: top.label, score: top.score, all: json });
    }

    // If model returned a different shape or null, return raw
    return res.status(200).json({ raw: json });
  } catch (err: any) {
    console.error("[disease] error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
};
