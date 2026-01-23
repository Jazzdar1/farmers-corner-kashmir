import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const category =
      typeof req.query.category === "string"
        ? req.query.category
        : "latest";

    const news = [
      {
        title: `Latest ${category} news`,
        description:
          "News service is running in demo mode. Replace with real API later.",
        source: "Farmers Corner Kashmir",
        time: new Date().toISOString()
      }
    ];

    res.status(200).json({
      success: true,
      category,
      news
    });
  } catch (error) {
    console.error("NEWS API ERROR:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch news"
    });
  }
}
