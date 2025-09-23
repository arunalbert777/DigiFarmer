// netlify/functions/gemini-proxy.js
// Lightweight Netlify serverless function to proxy text requests to Google Generative AI (Gemini)
// Supports payload: { type: 'text'|'audio', text: string, lang?: string }
// For 'text' type this returns { text, raw }
// For 'audio' type this returns 501 (not implemented) with guidance to use client-side TTS or connect a TTS provider

const { GoogleGenAI } = require("@google/genai");

exports.handler = async function (event, context) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Method Not Allowed" }),
      };
    }

    // Parse JSON body
    let body = null;
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (e) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Invalid JSON body",
          message: String(e.message),
        }),
      };
    }

    const type = (body.type || "text").toString();
    const text =
      typeof body.text === "string"
        ? body.text
        : typeof body.message === "string"
          ? body.message
          : undefined;
    const lang = typeof body.lang === "string" ? body.lang : "en";

    if (!text || !text.trim()) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing 'text' in request body" }),
      };
    }

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Server misconfiguration: missing API key",
        }),
      };
    }

    // Initialize Google GenAI client
    const client = new GoogleGenAI({ apiKey });

    if (type === "text") {
      // Create payload compatible with generateContent
      const model =
        process.env.GEMINI_MODEL || "gemini-2.5-flash-preview-05-20";
      const request = {
        model,
        contents: [
          {
            parts: [
              {
                text: text,
              },
            ],
          },
        ],
      };

      let resp;
      try {
        resp = await client.models.generateContent(request);
      } catch (upErr) {
        console.error("[gemini-proxy] SDK error:", String(upErr));
        return {
          statusCode: 502,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            error: "Upstream API error",
            details: String(upErr),
          }),
        };
      }

      // Extract text from SDK response robustly
      const extractText = (obj) => {
        try {
          if (!obj) return null;
          if (typeof obj === "string" && obj.trim()) return obj.trim();
          if (typeof obj.text === "string" && obj.text.trim())
            return obj.text.trim();

          const candidates =
            obj?.candidates ||
            obj?.result?.candidates ||
            obj?.output?.candidates;
          if (Array.isArray(candidates) && candidates.length) {
            const c0 = candidates[0];
            const parts =
              c0?.content?.parts ||
              c0?.content?.[0]?.parts ||
              c0?.content?.[0]?.content?.parts;
            if (Array.isArray(parts) && parts.length) {
              return parts
                .map((p) => p?.text || p?.raw || "")
                .join(" ")
                .trim();
            }
            const maybe =
              c0?.content?.[0]?.parts?.[0]?.text ||
              c0?.content?.[0]?.text ||
              c0?.text;
            if (maybe) return maybe;
          }

          // outputs shape
          const outputs = obj?.outputs || obj?.output || obj?.results;
          if (Array.isArray(outputs) && outputs.length) {
            for (const out of outputs) {
              const cont = out?.content || out?.output || out;
              if (Array.isArray(cont)) {
                for (const c of cont) {
                  const p = c?.parts || c?.content || c;
                  if (Array.isArray(p))
                    return p
                      .map((x) => x?.text || x?.raw || "")
                      .join(" ")
                      .trim();
                }
              }
            }
          }

          if (obj?.raw && typeof obj.raw === "string") return obj.raw;
          return JSON.stringify(obj);
        } catch (e) {
          return null;
        }
      };

      const botText = extractText(resp) || extractText(resp?.result) || "";

      // If the client requested a plain text response (body.plain === true or ?plain=1), return text/plain
      const qs = (event && event.queryStringParameters) || {};
      const plainRequested = (body && (body.plain === true || body.plain === 'true')) || (qs.plain === '1' || qs.plain === 'true');

      if (plainRequested) {
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*",
          },
          body: String(botText || ""),
        };
      }

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ text: botText, raw: resp }),
      };
    }

    // Audio generation using Google Cloud Text-to-Speech (REST)
    if (type === "audio") {
      try {
        const ttsUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
        const languageCode = lang === "kn" ? "kn-IN" : "en-US";
        const voiceName = lang === "kn" ? "kn-IN-Wavenet-A" : "en-US-Wavenet-D";

        const ttsRequest = {
          input: { text: text },
          voice: { languageCode, name: voiceName },
          audioConfig: { audioEncoding: "LINEAR16", sampleRateHertz: 24000 },
        };

        const ttsResp = await fetch(ttsUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ttsRequest),
        });

        if (!ttsResp.ok) {
          const details = await ttsResp.text();
          console.error("[gemini-proxy] TTS upstream error:", details);
          return {
            statusCode: 502,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ error: "TTS upstream error", details }),
          };
        }

        const ttsJson = await ttsResp.json();
        const audioContent = ttsJson?.audioContent;
        if (!audioContent) {
          return {
            statusCode: 502,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              error: "TTS upstream returned no audio",
              raw: ttsJson,
            }),
          };
        }

        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ audioData: audioContent, raw: ttsJson }),
        };
      } catch (e) {
        console.error("[gemini-proxy] TTS error:", e);
        return {
          statusCode: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ error: "TTS error", details: String(e) }),
        };
      }
    }

    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Unsupported 'type' in request body" }),
    };
  } catch (err) {
    console.error("[gemini-proxy] error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Internal server error",
        details: String(err),
      }),
    };
  }
};
