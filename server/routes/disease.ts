import type { RequestHandler } from "express";

// Disease detection endpoint with resizing, caching, and model fallbacks
export const handleDiseaseDetect: RequestHandler = async (req, res) => {
  try {
    console.log("[disease] incoming headers:", req.headers);

    // 1) Extract image buffer (multipart or JSON/dataURL/raw base64)
    let buffer: Buffer | undefined;
    if ((req as any).file && (req as any).file.buffer) {
      buffer = (req as any).file.buffer as Buffer;
      console.log("[disease] received multipart file, size:", buffer.length);
    } else {
      let body: any = req.body;
      console.log("[disease] raw body type:", typeof body);

      if (typeof body === "string") {
        try {
          body = JSON.parse(body);
          console.log("[disease] parsed string body as JSON");
        } catch (e) {
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
            const m = maybe.match(/^data:([^;]+);base64,/);
            if (m) (req as any)._bodyMime = m[1];
          }
        }
      }

      if (!buffer && Buffer.isBuffer(body)) {
        buffer = body as Buffer;
        console.log("[disease] body is buffer, length:", buffer.length);
      }

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
        const m = base64.match(/^data:([^;]+);base64,/);
        if (m) (req as any)._bodyMime = m[1];
        console.log("[disease] received image length:", buffer.length);
      }
    }

    // 2) Basic validation
    if (!buffer || !buffer.length)
      return res.status(400).json({ error: "Empty image buffer" });

    const detectedMime = (req as any)._bodyMime;
    if (detectedMime) console.log("[disease] detected mime:", detectedMime);

    const isSvg = (() => {
      try {
        const txt = buffer
          .toString("utf8", 0, Math.min(200, buffer.length))
          .toLowerCase();
        return txt.includes("<svg") || detectedMime === "image/svg+xml";
      } catch (e) {
        return false;
      }
    })();
    if (isSvg)
      return res
        .status(400)
        .json({
          error:
            "SVG images are not supported. Please upload a photographic image (JPEG/PNG/WebP).",
        });

    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
    const isPng = buffer.length >= 8 && buffer.readUInt32BE(0) === 0x89504e47;
    const isWebp =
      buffer.length >= 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP";
    if (!isJpeg && !isPng && !isWebp)
      return res
        .status(400)
        .json({
          error:
            "Unsupported image format. Please upload JPEG, PNG, or WebP images.",
        });
    if (buffer.length < 2000)
      return res
        .status(400)
        .json({
          error:
            "Image too small. Please upload a full-size photo (not an icon).",
        });

    // 3) Server-side resizing (sharp optional)
    let usedBuffer = buffer;
    try {
      const sharp = await import("sharp");
      if (sharp) {
        try {
          const out = await (sharp as any)(buffer)
            .rotate()
            .resize({ width: 1024, height: 1024, fit: "inside" })
            .toFormat("jpeg", { quality: 80 })
            .toBuffer();
          console.log(
            "[disease] resized image from",
            buffer.length,
            "to",
            out.length,
          );
          usedBuffer = out;
        } catch (e) {
          console.warn(
            "[disease] sharp resize failed, using original buffer",
            e,
          );
        }
      }
    } catch (e) {
      console.log("[disease] sharp not installed, skipping resize");
    }

    // 4) Caching (simple in-memory LRU with TTL)
    const CACHE_TTL = 1000 * 60 * 10; // 10 minutes
    const CACHE_MAX = 1000;
    if (!(global as any)._detectionCache)
      (global as any)._detectionCache = new Map<
        string,
        { value: any; expires: number }
      >();
    const cache: Map<string, { value: any; expires: number }> = (global as any)
      ._detectionCache;

    const crypto = await import("crypto");
    const hfModel =
      process.env.HUGGINGFACE_MODEL || "nateraw/plant-disease-classification";
    const key = crypto
      .createHash("sha256")
      .update(usedBuffer)
      .update(hfModel)
      .digest("hex");

    const now = Date.now();
    const cached = cache.get(key);
    if (cached && cached.expires > now) {
      console.log("[disease] cache hit");
      return res.status(200).json({ ...cached.value, cached: true });
    }

    // 5) Inference with retries & model fallbacks
    const hfKey = process.env.HUGGINGFACE_API_KEY;
    if (!hfKey)
      return res
        .status(500)
        .json({
          error: "Server misconfiguration: missing HUGGINGFACE_API_KEY",
        });

    const fallbackModels = [
      "microsoft/resnet-50",
      "google/vit-base-patch16-224",
    ];
    const modelsToTry = [
      hfModel,
      ...fallbackModels.filter((m) => m !== hfModel),
    ];

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
          body: usedBuffer,
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
              await new Promise((r) =>
                setTimeout(r, backoff + Math.floor(Math.random() * 200)),
              );
              backoff *= 2;
              continue;
            }
            lastErr = { status: resp.status, details: text };
            break;
          }

          const json = await resp.json().catch((e) => {
            console.error("[disease] failed to parse HF response as JSON", e);
            return null;
          });

          const output =
            Array.isArray(json) && json.length
              ? { label: json[0].label, score: json[0].score, all: json, model }
              : { raw: json, model };

          // store in cache with TTL
          cache.set(key, { value: output, expires: Date.now() + CACHE_TTL });
          if (cache.size > CACHE_MAX) {
            const it = cache.keys();
            const first = it.next().value;
            if (first) cache.delete(first);
          }

          return res.status(200).json(output);
        } catch (e: any) {
          console.warn(
            `[disease] model ${model} attempt ${attempt} failed:`,
            e?.message || e,
          );
          lastErr = e;
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
