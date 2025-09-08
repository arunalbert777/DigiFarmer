import { RequestHandler } from "express";

export const handleGeminiChat: RequestHandler = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Missing 'message' in request body" });
    }

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "text-bison-001";

    if (!apiKey) {
      return res.status(500).json({ error: "Server misconfiguration: missing API key" });
    }

    // Google Generative Language API endpoint (v1)
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateText?key=${apiKey}`;

    const payload = {
      prompt: {
        text: message,
      },
      temperature: 0.2,
      maxOutputTokens: 512,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(502).json({ error: "Upstream API error", details: text });
    }

    const data = await response.json();

    // Expected response shape: { candidates: [{ output: string }] } or { output: ... }
    const candidate = data?.candidates?.[0]?.output || data?.output?.[0]?.content || data?.result || null;

    if (!candidate || typeof candidate !== "string") {
      // If the response structure is different, send entire data to client
      return res.status(200).json({ bot: JSON.stringify(data) });
    }

    return res.status(200).json({ bot: candidate });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
};
