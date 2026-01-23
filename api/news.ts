import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const category =
    typeof req.query.category === "string"
      ? req.query.category
      : "latest";

  res.status(200).json({
    ok: true,
    category,
    news: [
      {
        title: `Demo ${category} news`,
        description: "API is working correctly",
        source: "Farmers Corner Kashmir"
      }
    ]
  });
}
