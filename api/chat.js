import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY missing"
      });
    }

    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        error: "Invalid prompt"
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    res.status(200).json({
      answer: completion.choices?.[0]?.message?.content ?? "No response"
    });
  } catch (err) {
    console.error("CHAT API ERROR:", err);
    res.status(500).json({
      error: "AI request failed",
      detail: err?.message
    });
  }
}
