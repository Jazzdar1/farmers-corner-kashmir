export async function fetchNews(): Promise<string> {
  try {
    const response = await fetch("/api/news");
    const data = await response.json();

    return (data.text ?? "").replace(/\n/g, " ").trim();
  } catch {
    return "Unable to load agricultural news at the moment.";
  }
}
