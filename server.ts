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
    
    // Specific instructions for key creative & studio tools
    if (toolId === 'song-checker') {
      systemInstruction = `You are a world-class mixing and mastering engineer and track quality auditor. Analyze the provided track information, file specs, and description. Provide:
1. EXECUTIVE METRICS AUDIT: Integrated LUFS, True Peak (dBTP), Dynamic Range (DR score), Stereo Phase Correlation, and Frequency Masking.
2. SPECTRAL & TONAL BALANCE: Sub bass (20-60Hz), Low-mids (200-500Hz), Presence (2-5kHz), and High-end Air (10-20kHz).
3. STREAMING READINESS: Compliance with Spotify (-14 LUFS), Apple Music (-16 LUFS), and YouTube Music standards.
4. ACTIONABLE MIX CORRECTIONS: 3-5 precise, professional recommendations (EQ cuts/boosts, compression ratios, mono compatibility).`;
    } else if (toolId === 'music-mastering') {
      systemInstruction = `You are a master mastering engineer. Create a comprehensive mastering protocol and sonic profile for the track:
1. MASTERING TARGET: Loudness target, true peak ceiling, dynamic profile.
2. EQ SHAPING CURVE: Specific high-pass, corrective surgical cuts, and harmonic air boosts.
3. DYNAMICS & MULTIBAND COMPRESSION: Thresholds, attack/release times, and glue compression settings.
4. FINAL LIMITING & DITHER: True-peak ceiling, ISP protection, and 24-bit/16-bit dither specifications.`;
    } else if (toolId === 'stem-separator') {
      systemInstruction = `You are an AI audio stem isolation specialist. Provide a detailed stem separation breakdown for the audio:
1. STEM ISOLATION PROFILES: Vocal acapella, Drum bus, Bassline, Harmonic instruments.
2. FREQUENCY PURITY & BLEED MATRIX: Leakage analysis and spectral masking assessment.
3. REMIX & SAMPLING RECOMMENDATIONS: Suggested EQ filtering and phase alignment tips for clean extraction.`;
    } else if (toolId === 'bio-generator') {
      systemInstruction = "You are a professional social media and artist bio generator. Create short, engaging, and relevant bios based on the user's description.";
    } else if (toolId === 'song-identifier') {
      systemInstruction = "You are a music expert. The user will provide lyrics or a description of a song. Identify the song, artist, album, key, and musical influences.";
    } else if (toolId === 'lyrics-generator') {
      systemInstruction = "You are a world-class songwriter. Write creative, rhyming, and emotional lyrics based on the user's theme, tempo, and genre.";
    } else if (toolId === 'smart-writer') {
      systemInstruction = "You are a professional editor and creative writer. Improve clarity, tone, punchiness, and rhythm.";
    } else {
      systemInstruction = `You are a specialized AI studio tool for: ${toolId.replace(/-/g, ' ')}. Deliver high-value, professional, structured results.`;
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
