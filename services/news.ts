export async function fetchNewsTicker(
  category?: string
): Promise<string> {
  try {
    const url = category
      ? `/api/news?category=${encodeURIComponent(category)}`
      : `/api/news`;

    const res = await fetch(url);
    const data = await res.json();

    return data.text || "";
  } catch {
    return "";
  }
}
