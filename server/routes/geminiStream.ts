import { RequestHandler } from "express";

function chunkString(str: string, size = 60) {
  const chunks: string[] = [];
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.slice(i, i + size));
  }
  return chunks;
}

export const handleGeminiChatStream: RequestHandler = async (req, res) => {
  try {
    const message = (req.query.message as string) || "";
    if (!message) {
      res.status(400).json({ error: "Missing 'message' query param" });
      return;
    }

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "text-bison-001";

    if (!apiKey) {
      res.status(500).json({ error: "Server misconfiguration: missing API key" });
      return;
    }

    // Call upstream API to get full response first, then stream it to client in chunks
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateText?key=${apiKey}`;

    const payload = {
      prompt: {
        text: message,
      },
      temperature: 0.2,
      maxOutputTokens: 512,
    };

    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      res.status(502).json({ error: "Upstream API error", details: text });
      return;
    }

    const data = await upstream.json();
    const candidate = data?.candidates?.[0]?.output || data?.output?.[0]?.content || data?.result || null;
    const botText = typeof candidate === "string" ? candidate : JSON.stringify(candidate);

    // Begin SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const chunks = chunkString(botText, 40);

    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= chunks.length) {
        res.write(`event: done\ndata: [DONE]\n\n`);
        clearInterval(interval);
        res.end();
        return;
      }

      const chunk = chunks[idx++];
      // send chunk as data event
      res.write(`data: ${chunk.replace(/\n/g, "\\n")}\n\n`);
    }, 60);

    // If client closes connection, stop interval
    req.on("close", () => {
      clearInterval(interval);
    });
  } catch (err: any) {
    try {
      res.status(500).json({ error: err.message || "Internal server error" });
    } catch (e) {
      // ignore
    }
  }
};
