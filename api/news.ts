import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const category = req.query.category || "latest";

    // Example: static response (safe test)
    res.status(200).json({
      category,
      news: [
        { title: "Farmers benefit from new scheme" },
        { title: "Weather update for Kashmir" }
      ]
    });

  } catch (err) {
    console.error("NEWS API ERROR:", err);
    res.status(500).json({ error: "News API failed" });
  }
}
