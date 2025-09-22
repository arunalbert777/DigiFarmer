// Netlify Function: netlify/functions/gemini-chat.js
// Securely proxy requests to Google Generative Language API (Gemini)
// Reads API key from process.env.GOOGLE_API_KEY

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
    else if (body.input && typeof body.input.text === "string") prompt = body.input.text;
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
        body: JSON.stringify({ message: "Missing 'prompt' or 'message' in request body" }),
      };
    }

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Server misconfiguration: missing API key" }),
      };
    }

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-preview-05-20"; // or fallback to gemini-2.0-flash

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const payload = {
      // generateContent shape
      // See: https://developers.generativeai.google/reference/rest/v1beta/models/generateContent
      // We send contents -> parts -> text
      contents: [
        {
          content: {
            // Some endpoints expect content.parts, some expect parts directly. Provide common shape.
            parts: [
              {
                text: prompt,
              },
            ],
          },
        },
      ],
      // Optionally you can tune safety, temperature, etc in other fields (not included here)
    };

    // Call upstream API
    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();
    if (!upstream.ok) {
      // return upstream body if available
      let details = text;
      try {
        const parsed = JSON.parse(text);
        details = parsed.error || parsed.details || JSON.stringify(parsed);
      } catch (e) {
        // keep text
      }
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Upstream API error", details }),
      };
    }

    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      // non-json response
      data = { raw: text };
    }

    // Extract human-friendly text from common response shapes
    const extractText = (obj) => {
      try {
        // generateContent -> candidates[].content[].parts[].text
        const parts = obj?.candidates?.[0]?.content?.[0]?.parts;
        if (Array.isArray(parts)) return parts.map((p) => p?.text || p?.raw || "").join(" ").trim();

        // outputs -> content -> parts
        const outputs = obj?.outputs || obj?.output || obj?.results;
        if (Array.isArray(outputs)) {
          for (const out of outputs) {
            const cont = out?.content || out?.output || out;
            if (Array.isArray(cont)) {
              for (const c of cont) {
                const p = c?.parts || c?.content || c;
                if (Array.isArray(p)) return p.map((x) => x?.text || x?.raw || "").join(" ").trim();
              }
            }
          }
        }

        // candidates[].content[0].text
        const legacy = obj?.candidates?.[0]?.content?.[0]?.text || obj?.candidates?.[0]?.content?.[0]?.raw;
        if (legacy && typeof legacy === "string") return legacy;

        // if raw text field exists
        if (typeof obj?.text === "string") return obj.text;

        // fallback stringify
        return JSON.stringify(obj);
      } catch (e) {
        return null;
      }
    };

    const botText = extractText(data) || "";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        // allow the same origin; adjust as needed
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ response: botText, raw: data }),
    };
  } catch (err) {
    console.error("[netlify/gemini-chat] error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Internal server error", details: String(err) }),
    };
  }
};
