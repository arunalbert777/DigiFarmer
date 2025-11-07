// Simplified disease detection endpoint: accepts image (multipart or JSON/dataURL)
// Performs validation/resizing and delegates inference to client-side TFJS or hosted model.
export const handleDiseaseDetect: RequestHandler = async (req, res) => {
  try {
    console.log("[disease] incoming headers:", req.headers);

    // 1) Extract image buffer (multipart or JSON/dataURL/raw base64)
    let buffer: Buffer | undefined;

    // Try multipart parsing via busboy if present
    try {
      const contentType = (req.headers["content-type"] || "") as string;
      if (!buffer && contentType.startsWith("multipart/")) {
        const Busboy = (await import("busboy")).default;
        console.log("[disease] parsing multipart with busboy");
        await new Promise<void>((resolve, reject) => {
          const bb = new Busboy({ headers: req.headers as any });
          bb.on("file", (_name, stream) => {
            const chunks: Buffer[] = [];
            stream.on("data", (c: Buffer) => chunks.push(c));
            stream.on("end", () => {
              buffer = Buffer.concat(chunks);
              console.log(
                "[disease] parsed multipart file, size=",
                buffer.length,
              );
            });
          });
          bb.on("error", (err: any) => reject(err));
          bb.on("finish", () => resolve());
          req.pipe(bb as any);
        });
      }
    } catch (e) {
      console.warn(
        "[disease] busboy parse failed or not available, continuing",
        e,
      );
    }

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
      return res.status(400).json({
        error:
          "SVG images are not supported. Please upload a photographic image (JPEG/PNG/WebP).",
      });

    // Use file-type if available
    try {
      const fileType = await import("file-type");
      const ft = await (fileType as any).fileTypeFromBuffer(buffer);
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!ft || !allowed.includes(ft.mime)) {
        return res.status(400).json({
          error:
            "Unsupported image format. Please upload JPEG, PNG, or WebP images.",
        });
      }
    } catch (e) {
      // fallback magic bytes
      const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
      const isPng = buffer.length >= 8 && buffer.readUInt32BE(0) === 0x89504e47;
      const isWebp =
        buffer.length >= 12 &&
        buffer.toString("ascii", 0, 4) === "RIFF" &&
        buffer.toString("ascii", 8, 12) === "WEBP";
      if (!isJpeg && !isPng && !isWebp)
        return res.status(400).json({
          error:
            "Unsupported image format. Please upload JPEG, PNG, or WebP images.",
        });
    }

    if (buffer.length < 2000)
      return res.status(400).json({
        error:
          "Image too small. Please upload a full-size photo (not an icon).",
      });

    // 3) Resize using sharp if available
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

    // 4) Simple caching
    const CACHE_TTL = 1000 * 60 * 10;
    const CACHE_MAX = 1000;
    if (!(global as any)._detectionCache)
      (global as any)._detectionCache = new Map();
    const cache: Map<string, { value: any; expires: number }> = (global as any)
      ._detectionCache;

    const crypto = await import("crypto");
    const key = crypto.createHash("sha256").update(usedBuffer).digest("hex");
    const now = Date.now();
    const cached = cache.get(key);
    if (cached && cached.expires > now)
      return res.status(200).json({ ...cached.value, cached: true });

    // 5) Try Hugging Face Inference API if configured (fallback to client-side)
    const HF_KEY = process.env.HUGGINGFACE_API_KEY;
    const HF_MODEL = process.env.HUGGINGFACE_MODEL;
    if (HF_KEY && HF_MODEL) {
      try {
        const hfUrl = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
        console.log("[disease] calling HuggingFace model:", HF_MODEL);
        const resp = await fetch(hfUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_KEY}`,
            "Content-Type": detectedMime || "application/octet-stream",
            Accept: "application/json",
          },
          body: usedBuffer,
        });
        const out = await resp.json().catch(() => null);
        if (!resp.ok) {
          console.error("[disease] HF inference failed", resp.status, out);
          throw new Error(
            out?.error || `HF inference failed with ${resp.status}`,
          );
        }

        // Expected output: array of {label, score} or model specific JSON
        if (Array.isArray(out) && out.length) {
          const top = out[0];
          const label = top.label || top.class_name || "unknown";
          const score = top.score || top.probability || 0;
          const value = { label, score, raw: out };
          cache.set(key, { value, expires: now + CACHE_TTL });
          return res.status(200).json(value);
        }

        // Generic return if shape different
        const value = { raw: out };
        cache.set(key, { value, expires: now + CACHE_TTL });
        return res.status(200).json(value);
      } catch (e) {
        console.error("[disease] HuggingFace inference error:", e);
      }
    }

    // 6) No server-side inference available
    return res.status(501).json({
      error:
        "No server-side model available. Please perform client-side inference or configure HUGGINGFACE_MODEL and HUGGINGFACE_API_KEY in server env to enable hosted-model server-side inference.",
    });
  } catch (err: any) {
    console.error("[disease] error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};

// Endpoint to expose class labels (from local labels.json or HF model metadata)
export const handleDiseaseLabels: RequestHandler = async (_req, res) => {
  try {
    // 1) Try to read local labels file generated during training/convert
    try {
      const fs = await import("fs/promises");
      const p = "models/plant_disease/labels.json";
      try {
        const raw = await fs.readFile(p, "utf8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed))
          return res.status(200).json({ labels: parsed });
      } catch (e) {
        // file not found or invalid — continue
      }
    } catch (e) {
      // fs import failed — continue
    }

    // 2) Try to fetch model metadata from HuggingFace if configured
    const HF_KEY = process.env.HUGGINGFACE_API_KEY;
    const HF_MODEL = process.env.HUGGINGFACE_MODEL;
    if (HF_KEY && HF_MODEL) {
      try {
        const hfMetaUrl = `https://huggingface.co/api/models/${HF_MODEL}`;
        const resp = await fetch(hfMetaUrl, {
          headers: { Authorization: `Bearer ${HF_KEY}` },
        });
        if (resp.ok) {
          const meta = await resp.json().catch(() => null);
          if (meta) {
            const id2label =
              meta?.id2label ||
              meta?.config?.id2label ||
              meta?.config?.decoder?.id2label;
            if (id2label && typeof id2label === "object") {
              const keys = Object.keys(id2label).sort(
                (a, b) => Number(a) - Number(b),
              );
              const labels = keys.map((k) => id2label[k]);
              return res.status(200).json({ labels });
            }
            if (meta?.labels && Array.isArray(meta.labels))
              return res.status(200).json({ labels: meta.labels });
          }
        }
      } catch (e) {
        console.warn("[disease] HF metadata fetch failed", e);
      }
    }

    return res
      .status(404)
      .json({
        error:
          "No labels found. Provide models/plant_disease/labels.json or configure HUGGINGFACE_MODEL to fetch metadata.",
      });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
};

// POST /api/detect/solution - searches the web (Wikipedia) for the label and returns a summary or search URL
export const handleSolutionSearch: RequestHandler = async (req, res) => {
  try {
    const body = req.body || {};
    const label = (typeof body === 'string' ? body : body.label) || body?.q || '';
    if (!label) return res.status(400).json({ error: 'Missing label to search' });

    const qs = [
      `${label} plant disease management`,
      `${label} disease treatment`,
      `${label} plant disease`,
      `${label}`,
    ];

    const searchWiki = async (query: string) => {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        query,
      )}&utf8=1&format=json`;
      const sresp = await fetch(searchUrl);
      if (!sresp.ok) return null;
      const sjson = await sresp.json().catch(() => null);
      const first = sjson?.query?.search?.[0];
      if (!first) return null;
      const title = first.title;
      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        title,
      )}`;
      const presp = await fetch(summaryUrl, { headers: { Accept: 'application/json' } });
      if (!presp.ok) return { title, url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}` };
      const pjson = await presp.json().catch(() => null);
      return {
        title,
        extract: pjson?.extract || null,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
      };
    };

    for (const q of qs) {
      try {
        const found = await searchWiki(q);
        if (found && (found.extract || found.url)) {
          return res.status(200).json({ source: 'wikipedia', ...found });
        }
      } catch (e) {
        console.warn('[solution] wiki search error', e);
      }
    }

    const google = `https://www.google.com/search?q=${encodeURIComponent(
      label + ' plant disease treatment',
    )}`;
    return res.status(200).json({ source: 'google', url: google });
  } catch (e: any) {
    console.error('[solution] error', e);
    return res.status(500).json({ error: e.message || String(e) });
  }
};
