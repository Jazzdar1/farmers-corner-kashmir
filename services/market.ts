import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const url = `https://api.data.gov.in/resource/YOUR_RESOURCE_ID?api-key=${process.env.MANDI_API_KEY}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Market data failed" });
  }
}
