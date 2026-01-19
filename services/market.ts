import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const url =
      "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070" +
      `?api-key=${process.env.MANDI_API_KEY}&format=json&limit=20`;

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch mandi data" });
  }
}
