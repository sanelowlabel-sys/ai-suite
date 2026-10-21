import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Generic AI Tool endpoint
app.post("/api/ai/tool", async (req, res) => {
  try {
    const toolId = req.body.toolId;
    const input = req.body.input || req.body.prompt;

    if (!toolId || !input) {
      return res.status(400).json({ error: "Missing toolId or input" });
    }

    // Determine the system instruction based on the tool
    let systemInstruction = "You are a helpful assistant part of the AI Suite.";
    
    // Some specific instructions for key tools mentioned
    if (toolId === 'bio-generator') {
      systemInstruction = "You are a professional social media bio generator. Create short, engaging, and relevant bios based on the user's description.";
    } else if (toolId === 'song-identifier') {
      systemInstruction = "You are a music expert. The user will provide lyrics or a description of a song. Identify the song, artist, and album.";
    } else if (toolId === 'lyrics-generator') {
      systemInstruction = "You are a world-class songwriter. Write creative and emotional lyrics based on the user's theme and genre.";
    } else if (toolId === 'smart-writer') {
      systemInstruction = "You are a professional editor and writer. Improve the clarity, tone, and grammar of the user's input.";
    } else {
      systemInstruction = `You are a specialized AI tool for: ${toolId.replace(/-/g, ' ')}. Perform the requested task professionally.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: input,
      config: {
        systemInstruction,
      },
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error("AI Tool Error:", error);
    res.status(500).json({ error: error.message || "Failed to process AI request" });
  }
});

async function startServer() {
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
