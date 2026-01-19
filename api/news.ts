import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    if (!process.env.NEWS_API_KEY) {
      return res.status(200).json({
        text: "News service not configured"
      });
    }

    const category =
      typeof req.query.category === "string"
        ? req.query.category
        : "agriculture";

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      category
    )}&language=en&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(200).json({
        text: "Unable to fetch news at the moment"
      });
    }

    const data = await response.json();

    const text =
      data.articles?.map((a: any) => a.title).join(" • ") ||
      "No news available";

    return res.status(200).json({ text });
  } catch (error) {
    console.error("News API error:", error);

    // ✅ NEVER crash
    return res.status(200).json({
      text: "News service temporarily unavailable"
    });
  }
}
