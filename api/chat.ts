import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        text: "AI service not configured (missing GEMINI_API_KEY)"
      });
    }

    const { prompt } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ text: "Missing prompt" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini error:", error);

    // ✅ NEVER crash
    return res.status(200).json({
      text: "AI service temporarily unavailable"
    });
  }
}
