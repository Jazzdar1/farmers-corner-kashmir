export default async function handler(req: any, res: any) {
  try {
    const city = req.query?.city || "Kashmir";

    res.status(200).json({
      city,
      temperature: "18°C",
      condition: "Clear",
      humidity: "55%"
    });
  } catch (err) {
    console.error("WEATHER API ERROR:", err);
    res.status(500).json({ error: "Weather API failed" });
  }
}
