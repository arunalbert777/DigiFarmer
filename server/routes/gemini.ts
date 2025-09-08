import { RequestHandler } from "express";

export const handleGeminiChat: RequestHandler = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json({ error: "Missing 'message' in request body" });
    }

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Server misconfiguration: missing API key" });
    }

    // Google Generative Language API endpoint (v1beta generateContent)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

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

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
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

    // Try to extract text from known response shapes
    let candidate: string | null = null;

    // common: candidates[index].content.parts[0].text
    candidate =
      candidate ||
      data?.candidates?.[0]?.content?.[0]?.text ||
      data?.candidates?.[0]?.content?.[0]?.raw ||
      data?.candidates?.[0]?.output?.[0]?.content?.[0]?.text ||
      data?.outputs?.[0]?.content?.[0]?.text ||
      data?.results?.[0]?.output?.[0]?.content?.[0]?.text ||
      null;

    if (!candidate) {
      // As a fallback, try to stringify potentially useful fields
      try {
        if (typeof data === "string") candidate = data;
        else candidate = JSON.stringify(data);
      } catch (e) {
        candidate = null;
      }
    }

    return res.status(200).json({ bot: candidate });
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
};
