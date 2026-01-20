export default async function handler(req: any, res: any) {
  try {
    const category = req.query?.category || "latest";

    res.status(200).json({
      category,
      articles: [
        { title: "Farmers Corner Kashmir launched" },
        { title: "New subsidy announced for farmers" }
      ]
    });
  } catch (err) {
    console.error("NEWS API ERROR:", err);
    res.status(500).json({ error: "News API failed" });
  }
}
