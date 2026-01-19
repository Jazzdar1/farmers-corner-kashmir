import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const url = `https://newsapi.org/v2/everything?q=agriculture&apiKey=${process.env.NEWS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    const text =
      data.articles?.slice(0, 5).map((a: any) => a.title).join(". ") || "";

    res.status(200).json({ text });
  } catch {
    res.status(500).json({ text: "" });
  }
}
