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
          const isBase64 = /^[A-Za-z0-9+/=\n\r]+$/.test(
            maybe.replace(/\s+/g, ""),
          );
          if (isDataUrl || isBase64) {
            const raw = maybe.replace(/^data:[^;]+;base64,/, "");
            buffer = Buffer.from(raw, "base64");
            console.log(
              "[disease] decoded buffer from raw string body, length:",
              buffer.length,
            );
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
        const base64 =
          body && typeof body.image === "string" ? body.image : undefined;
        if (!base64) {
          console.error(
            "[disease] Missing image in body; body preview keys:",
            body && typeof body === "object"
              ? Object.keys(body).slice(0, 10)
              : body,
          );
          return res
            .status(400)
            .json({ error: "Missing 'image' (base64) in request body" });
        }

        const raw = base64.replace(/^data:[^;]+;base64,/, "");
        buffer = Buffer.from(raw, "base64");
        console.log("[disease] received image length:", buffer.length);
      }
    }

    if (!buffer || !buffer.length) {
      return res.status(400).json({ error: "Empty image buffer" });
    }

    // Basic image format/size validation to provide clearer 4xx errors
    let detectedMime: string | undefined;
    if ((req as any)._bodyMime) detectedMime = (req as any)._bodyMime;

    const isSvg = () => {
      try {
        const txt = buffer.toString("utf8", 0, Math.min(200, buffer.length)).toLowerCase();
        return txt.includes("<svg") || (detectedMime === "image/svg+xml");
      } catch (e) {
        return false;
      }
    };

    if (isSvg()) {
      return res.status(400).json({ error: "SVG images are not supported. Please upload a photographic image (JPEG/PNG/WebP)." });
    }

    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
    const isPng = buffer.length >= 8 && buffer.readUInt32BE(0) === 0x89504e47;
    const isWebp = buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";

    if (!isJpeg && !isPng && !isWebp) {
      return res.status(400).json({ error: "Unsupported image format. Please upload JPEG, PNG, or WebP images." });
    }

    if (buffer.length < 2000) {
      return res.status(400).json({ error: "Image too small. Please upload a full-size photo (not an icon or SVG)." });
    }

    // Attempt inference with retries and fallbacks
    const hfKey = process.env.HUGGINGFACE_API_KEY;
    const primaryModel = process.env.HUGGINGFACE_MODEL || "microsoft/resnet-50";
    const fallbackModels = [
      "google/vit-base-patch16-224",
    ];

    const modelsToTry = [primaryModel, ...fallbackModels.filter((m) => m !== primaryModel)];

    async function callModel(model: string, timeoutMs = 25000) {
      const url = `https://api-inference.huggingface.co/models/${model}`;
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const resp = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${hfKey}`,
            "Content-Type": "application/octet-stream",
          },
          body: buffer,
          signal: controller.signal,
        });
        clearTimeout(id);
        return resp;
      } catch (e) {
        clearTimeout(id);
        throw e;
      }
    }

    let lastErr: any = null;
    for (const model of modelsToTry) {
      let attempt = 0;
      let backoff = 500;
      while (attempt < 3) {
        attempt += 1;
        try {
          console.log(`[disease] calling model=${model} attempt=${attempt}`);
          const resp = await callModel(model, 25000);
          if (!resp.ok) {
            const text = await resp.text().catch(() => null);
            console.warn(
              `[disease] model ${model} returned status ${resp.status}`,
              text?.slice?.(0, 200),
            );
            if ([429, 502, 503, 504].includes(resp.status)) {
              // transient - retry
              await new Promise((r) =>
                setTimeout(r, backoff + Math.floor(Math.random() * 200)),
              );
              backoff *= 2;
              continue;
            }
            // non-retryable for this model, break and try next model
            lastErr = { status: resp.status, details: text };
            break;
          }

          const json = await resp.json().catch((e) => {
            console.error("[disease] failed to parse HF response as JSON", e);
            return null;
          });

          if (Array.isArray(json) && json.length) {
            const top = json[0];
            return res
              .status(200)
              .json({ label: top.label, score: top.score, all: json, model });
          }

          // If the model returns a different shape (e.g., VQA/text), return raw for now
          return res.status(200).json({ raw: json, model });
        } catch (e: any) {
          console.warn(
            `[disease] model ${model} attempt ${attempt} failed:`,
            e?.message || e,
          );
          lastErr = e;
          // Retry on network / abort errors
          if (
            e?.name === "AbortError" ||
            e?.code === "ECONNRESET" ||
            e?.code === "ETIMEDOUT"
          ) {
            await new Promise((r) =>
              setTimeout(r, backoff + Math.floor(Math.random() * 200)),
            );
            backoff *= 2;
            continue;
          }
          // other errors -> break retry loop and try next model
          break;
        }
      }
    }

    console.error("[disease] all models failed", lastErr);
    return res
      .status(502)
      .json({ error: "Inference failed", details: String(lastErr) });
  } catch (err: any) {
    console.error("[disease] error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};
