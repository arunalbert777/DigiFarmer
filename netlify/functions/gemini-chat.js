// Netlify Function: netlify/functions/gemini-chat.js
// Securely proxy requests to Google Generative Language API (Gemini)
// Reads API key from process.env.GOOGLE_API_KEY

const { GoogleGenAI } = require("@google/genai");

// Netlify Function: netlify/functions/gemini-chat.js
// Uses @google/genai SDK and reads API key from process.env.GOOGLE_API_KEY or process.env.GEMINI_API_KEY

exports.handler = async function (event, context) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Method Not Allowed" }),
      };
    }

    let body = {};
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (e) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Invalid JSON body" }),
      };
    }

    // Accept multiple shapes: prompt, message, input.text, contents
    let prompt = undefined;
    if (typeof body.prompt === "string") prompt = body.prompt;
    else if (typeof body.message === "string") prompt = body.message;
    else if (body.input && typeof body.input.text === "string")
      prompt = body.input.text;
    else if (body.contents && Array.isArray(body.contents)) {
      try {
        const first = body.contents[0];
        prompt = first?.parts?.[0]?.text || first?.text || undefined;
      } catch (e) {
        prompt = undefined;
      }
    }

    if (!prompt || typeof prompt !== "string") {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Missing 'prompt' or 'message' in request body",
        }),
      };
    }

    const apiKey =
      process.env.GOOGLE_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Server misconfiguration: missing API key",
        }),
      };
    }

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-preview-05-20";

    // Initialize client
    const client = new GoogleGenAI({ apiKey });

    // Build request shape for generateContent
    const request = {
      model,
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    // Call SDK
    let resp;
    try {
      resp = await client.models.generateContent(request);
    } catch (upErr) {
      console.error("[netlify/gemini-chat] SDK error:", String(upErr));
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Upstream API error",
          details: String(upErr),
        }),
      };
    }

    // Extract text from SDK response
    const extractText = (obj) => {
      try {
        if (!obj) return null;
        // If SDK returns text property
        if (typeof obj.text === "string" && obj.text.trim())
          return obj.text.trim();
        // candidates shape
        const candidates =
          obj.candidates || obj?.result?.candidates || obj?.candidates;
        if (Array.isArray(candidates) && candidates.length) {
          const c0 = candidates[0];
          const parts =
            c0?.content?.parts ||
            c0?.content?.[0]?.parts ||
            c0?.content?.[0]?.content?.parts;
          if (Array.isArray(parts) && parts.length)
            return parts
              .map((p) => p?.text || p?.raw || "")
              .join(" ")
              .trim();
          const maybe =
            c0?.content?.[0]?.parts?.[0]?.text ||
            c0?.content?.[0]?.text ||
            c0?.text;
          if (maybe) return maybe;
        }
        // fallback
        if (typeof obj === "string") return obj;
        if (obj?.raw && typeof obj.raw === "string") return obj.raw;
        return JSON.stringify(obj);
      } catch (e) {
        return null;
      }
    };

    const botText = extractText(resp) || extractText(resp?.result) || "";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ response: botText, raw: resp }),
    };
  } catch (err) {
    console.error("[netlify/gemini-chat] error:", err);
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
