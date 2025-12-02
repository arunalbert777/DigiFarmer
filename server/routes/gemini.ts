import { RequestHandler } from "express";

export const handleGeminiChat: RequestHandler = async (req, res) => {
  try {
    // Log incoming request for debugging
    console.log("[gemini] Incoming request headers:", req.headers);
    console.log("[gemini] Incoming request body:", req.body);

    // Accept multiple payload shapes for 'message' (prompt, input, contents)
    let message: string | undefined = undefined;
    if (req.body) {
      if (typeof req.body.message === "string") message = req.body.message;
      else if (typeof req.body.prompt === "string") message = req.body.prompt;
      else if (typeof req.body.input === "string") message = req.body.input;
      else if (req.body.input && typeof req.body.input.text === "string") message = req.body.input.text;
      else if (req.body.contents && Array.isArray(req.body.contents)) {
        // contents: [{ parts: [{ text }] }]
        try {
          const first = req.body.contents[0];
          message = first?.parts?.[0]?.text || first?.text || undefined;
        } catch (e) {
          message = undefined;
        }
      }
    }

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Missing 'message' (or 'prompt') in request body", received: req.body });
    }

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

    if (!apiKey) {
      console.error("[server/gemini] Error: API key not found in environment variables");
      console.error("[server/gemini] Available env vars:", Object.keys(process.env).filter(k => k.includes('GOOGLE') || k.includes('GEMINI') || k.includes('API')));
      return res.status(500).json({
        error: "Server misconfiguration: missing GOOGLE_API_KEY or GEMINI_API_KEY",
        hint: "Please set GOOGLE_API_KEY as an environment variable (in Netlify: Site settings > Build & deploy > Environment variables) and redeploy"
      });
    }

    // Google Generative Language API endpoint (v1beta generateContent)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: message,
            },
          ],
        },
      ],
    };

    console.log("[gemini] Calling Generative API", { url, model });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      return res
        .status(502)
        .json({ error: "Upstream API error", details: text });
    }

    const data = await response.json();

    // Try to extract text from known response shapes robustly
    let botText: string | null = null;

    const tryExtractFromParts = (obj: any) => {
      try {
        // candidates[].content[].parts[].text (generateContent)
        const parts = obj?.candidates?.[0]?.content?.[0]?.parts;
        if (Array.isArray(parts)) {
          return (
            parts
              .map((p: any) => p?.text || "")
              .join(" ")
              .trim() || null
          );
        }

        // outputs or output arrays with content.parts
        const outputs = obj?.outputs || obj?.output || obj?.results;
        if (Array.isArray(outputs)) {
          for (const out of outputs) {
            const cont = out?.content || out?.output || out;
            if (Array.isArray(cont)) {
              for (const c of cont) {
                const p = c?.parts || c?.content || c;
                if (Array.isArray(p))
                  return p
                    .map((x: any) => x?.text || x?.raw || "")
                    .join(" ")
                    .trim();
              }
            }
          }
        }

        // legacy: candidates[0].content[0].text or raw
        const legacy =
          obj?.candidates?.[0]?.content?.[0]?.text ||
          obj?.candidates?.[0]?.content?.[0]?.raw;
        if (legacy && typeof legacy === "string") return legacy;
      } catch (e) {
        // ignore
      }
      return null;
    };

    botText = tryExtractFromParts(data);

    if (!botText) {
      // If we still have structured fields, try to serialize a user-friendly summary
      try {
        if (typeof data === "string") botText = data;
        else {
          // attempt to locate any plain strings in common places
          const maybe =
            data?.candidates?.[0]?.content?.[0]?.text ||
            data?.candidates?.[0]?.output?.[0]?.content?.[0]?.text ||
            data?.outputs?.[0]?.content?.[0]?.text ||
            null;
          if (maybe && typeof maybe === "string") botText = maybe;
          else botText = JSON.stringify(data);
        }
      } catch (e) {
        botText = null;
      }
    }

    if (!botText) {
      return res
        .status(502)
        .json({ error: "Failed to parse upstream response" });
    }

    return res.status(200).json({ bot: botText });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};
