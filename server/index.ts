import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleGeminiChat } from "./routes/gemini";
import { handleGeminiChatStream } from "./routes/geminiStream";
import { handleDiseaseDetect, handleDiseaseLabels, handleSolutionSearch } from "./routes/disease";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  // Increase body size limits to accept image uploads as base64
  app.use(express.json({ limit: "12mb" }));
  // Capture JSON parse errors from express.json() and return structured JSON instead of HTML overlay
  app.use(
    (
      err: any,
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (
        err &&
        (err instanceof SyntaxError || err.type === "entity.parse.failed")
      ) {
        console.error("[server] JSON parse error:", err.message);
        return res
          .status(400)
          .json({ error: "Invalid JSON body", message: String(err.message) });
      }
      return next(err);
    },
  );
  app.use(express.urlencoded({ extended: true, limit: "12mb" }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Gemini AI proxy endpoint
  app.post("/api/gemini-chat", handleGeminiChat);

  // Gemini AI streaming (SSE) endpoint
  app.get("/api/gemini-chat-stream", handleGeminiChatStream);

  // Disease detection endpoint
  app.post("/api/detect", handleDiseaseDetect);
  // Expose labels (from local conversion or HF model metadata)
  app.get("/api/detect/labels", handleDiseaseLabels);
  // Search web (Wikipedia) for label solutions
  app.post("/api/detect/solution", handleSolutionSearch);

  return app;
}
