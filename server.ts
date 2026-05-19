import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/ask", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(401).json({ error: "Gemini API Key is missing. Please set it in Settings > Secrets." });
      }

      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are a friendly, encouraging AI teacher for kids learning the Malayalam language.
Your name is Appu (an elephant).
You MUST reply to all questions in the Malayalam language (മലയാളം), using Malayalam script.
Answer questions about Malayalam letters, words, history, or culture. 
Keep your answers very simple, short, and easy for a 5-8 year old to understand.
Use emojis to make it fun!
If a question is off-topic, gently steer it back to learning Malayalam.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ answer: response.text });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to connect to the AI teacher. Try again later!" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
