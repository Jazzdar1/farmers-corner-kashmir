import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const { type, prompt, image, language } = req.body;

    // ---------------- Expert Chat ----------------
    if (type === "expert") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an agriculture expert from SKUAST-K advising farmers."
          },
          { role: "user", content: prompt }
        ]
      });

      return res.json({
        answer: completion.choices[0].message.content
      });
    }

    // ---------------- Crop Diagnosis (TEXT MODE) ----------------
    if (type === "crop-diagnosis") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a plant pathologist. Return JSON only."
          },
          {
            role: "user",
            content: `
Analyze crop disease and respond in JSON:
{
  "diseaseName": "",
  "confidence": 0.0,
  "severity": "Low | Medium | High",
  "description": "",
  "treatment": []
}
Language: ${language}
`
          }
        ]
      });

      // Try parsing JSON safely
      let parsed: any = {};
      try {
        parsed = JSON.parse(
          completion.choices[0].message.content || "{}"
        );
      } catch {
        parsed = {};
      }

      return res.json(parsed);
    }

    res.status(400).json({ error: "Invalid request type" });
  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "AI backend failed" });
  }
}
