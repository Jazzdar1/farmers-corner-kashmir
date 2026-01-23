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
    const { type, prompt } = req.body;

    if (type === "expert") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an agriculture expert advising Indian farmers."
          },
          { role: "user", content: prompt }
        ]
      });

      return res.json({
        answer: completion.choices[0].message.content
      });
    }

    return res.status(400).json({ error: "Invalid request" });
  } catch (err) {
    console.error("AI backend error:", err);
    return res.status(500).json({ error: "AI backend failed" });
  }
}
