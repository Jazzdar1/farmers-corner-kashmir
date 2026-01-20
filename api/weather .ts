import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const city = req.query.city || "Kashmir";

    // TEMP SAFE RESPONSE
    res.status(200).json({
      city,
      temperature: "18°C",
      condition: "Clear",
      humidity: "55%"
    });

  } catch (err) {
    console.error("WEATHER ERROR:", err);
    res.status(500).json({ error: "Weather API failed" });
  }
}
