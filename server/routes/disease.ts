import type { RequestHandler } from "express";

// Disease detection endpoint with resizing, caching, and model fallbacks
export const handleDiseaseDetect: RequestHandler = async (req, res) => {
  try {
    console.log("[disease] incoming headers:", req.headers);

    // 1) Extract image buffer (multipart or JSON/dataURL/raw base64)
    let buffer: Buffer | undefined;

    // If multipart/form-data arrives, parse using busboy
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

    // Use robust file-type detection when available
    try {
      const fileType = await import("file-type");
      const ft = await (fileType as any).fileTypeFromBuffer(buffer);
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!ft || !allowed.includes(ft.mime)) {
        return res
          .status(400)
          .json({
            error:
              "Unsupported image format. Please upload JPEG, PNG, or WebP images.",
          });
      }
    } catch (e) {
      // Fallback to magic bytes detection
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
    }

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

    // 5) Try local specialized TFJS plant-disease model, then fallback to MobileNet
    try {
      const tf = await import("@tensorflow/tfjs-node");
      const path = await import("path");
      const fs = await import("fs");

      const modelRel =
        process.env.PLANT_MODEL_PATH || "models/plant_disease/model.json";
      const modelAbs = path.resolve(modelRel);

      async function predictWithGraphModel(
        graphModel: any,
        labels: string[] | null,
      ) {
        // decode, resize, normalize
        let img = (tf as any).node.decodeImage(usedBuffer, 3);
        try {
          img = (tf as any).image.resizeBilinear(img, [224, 224]);
        } catch (e) {
          // some TF versions use tf.image, some have it on tf
          img = (tf as any).resizeBilinear(img, [224, 224]);
        }
        img = (img as any).expandDims(0).toFloat().div(255);

        const pred = (graphModel as any).predict(img) as any;
        let scores: number[] = [];

        if (Array.isArray(pred)) {
          // sometimes model returns array of tensors
          const out = await Promise.all(pred.map((p: any) => p.array()));
          scores = out.flat(1)[0] || out.flat();
        } else if (pred.array) {
          const arr = await pred.array();
          scores = Array.isArray(arr[0]) ? arr[0] : arr;
        } else if (pred.data) {
          const d = await pred.data();
          scores = Array.from(d as any);
        }

        // ensure scores is 1d
        if (!Array.isArray(scores)) scores = [Number(scores)];

        // softmax
        const max = Math.max(...scores);
        const exps = scores.map((s) => Math.exp(s - max));
        const sum = exps.reduce((a, b) => a + b, 0) || 1;
        const probs = exps.map((e) => e / sum);

        // top-5
        const indexed = probs.map((p, i) => ({ i, p }));
        indexed.sort((a, b) => b.p - a.p);
        const top = indexed.slice(0, 5).map((x) => ({
          index: x.i,
          label: labels?.[x.i] ?? `class_${x.i}`,
          probability: x.p,
        }));

        try {
          img.dispose?.();
        } catch (e) {}
        try {
          pred.dispose?.();
        } catch (e) {}

        return top;
      }

      // If specialized model exists locally, load and use it
      if (fs.existsSync(modelAbs)) {
        if (!(global as any)._plantGraphModel) {
          console.log("[disease] loading local plant model from", modelAbs);
          (global as any)._plantGraphModel = await (tf as any).loadGraphModel(
            "file://" + modelAbs,
          );

          // try to load labels.json next to model
          const labelsPath = path.join(path.dirname(modelAbs), "labels.json");
          if (fs.existsSync(labelsPath)) {
            try {
              (global as any)._plantLabels = JSON.parse(
                fs.readFileSync(labelsPath, "utf8"),
              );
              console.log(
                "[disease] loaded labels.json with",
                (global as any)._plantLabels.length,
                "labels",
              );
            } catch (e) {
              console.warn("[disease] failed to parse labels.json", e);
              (global as any)._plantLabels = null;
            }
          } else {
            (global as any)._plantLabels = null;
          }
        }

        const modelLocal = (global as any)._plantGraphModel;
        const labels = (global as any)._plantLabels || null;
        const top = await predictWithGraphModel(modelLocal, labels);

        const output = {
          label: top[0]?.label ?? "unknown",
          score: top[0]?.probability ?? 0,
          all: top,
          model: "local-plant-model",
        };

        cache.set(key, { value: output, expires: Date.now() + CACHE_TTL });
        if (cache.size > CACHE_MAX) {
          const it = cache.keys();
          const first = it.next().value;
          if (first) cache.delete(first);
        }

        return res.status(200).json(output);
      }

      // Fallback: MobileNet (general) if no specialized model
      try {
        const mobilenet = await import("@tensorflow-models/mobilenet");

        if (!(global as any)._tfMobilenetModel) {
          console.log("[disease] loading mobilenet model...");
          (global as any)._tfMobilenetModel = await (mobilenet as any).load({
            version: 2,
            alpha: 1.0,
          });
          console.log("[disease] mobilenet model loaded");
        }

        const model = (global as any)._tfMobilenetModel;
        const imageTensor = (tf as any).node.decodeImage(usedBuffer, 3);
        const predictions = await model.classify(imageTensor as any, 5);
        try {
          imageTensor.dispose?.();
        } catch (e) {}

        const output = {
          label: predictions?.[0]?.className || "unknown",
          score: predictions?.[0]?.probability || 0,
          all: predictions,
          model: "mobilenet-v2",
        };

        cache.set(key, { value: output, expires: Date.now() + CACHE_TTL });
        if (cache.size > CACHE_MAX) {
          const it = cache.keys();
          const first = it.next().value;
          if (first) cache.delete(first);
        }

        return res.status(200).json(output);
      } catch (e) {
        console.error("[disease] mobilenet fallback failed", e);
        return res
          .status(500)
          .json({ error: "Local inference failed", details: String(e) });
      }
    } catch (e) {
      console.error("[disease] local tfjs inference failed", e);
      return res
        .status(500)
        .json({ error: "Local inference failed", details: String(e) });
    }
  } catch (err: any) {
    console.error("[disease] error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};
