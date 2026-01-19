async function callAI(prompt: string): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  if (!res.ok) throw new Error("AI request failed");
  const data = await res.json();
  return data.text || "";
}

export const getDistrictWeather = (district: string) =>
  callAI(`Give current weather summary for ${district} district for farmers`);

export const analyzeCropDisease = (details: string) =>
  callAI(`Analyze crop disease and suggest treatment: ${details}`);

export const findNearbyDealers = (location: string) =>
  callAI(`Find nearby fertilizer and seed dealers near ${location}`);

export const getExpertAdvice = (question: string) =>
  callAI(`You are an agriculture expert. Answer: ${question}`);

export const findNearbyMandis = (crop: string) =>
  callAI(`List nearby mandis and prices for ${crop}`);

export const getDeepExpertView = (topic: string) =>
  callAI(`Give a deep expert-level agriculture analysis on ${topic}`);

export const generateUrduDiagnosisAudio = async (text: string) => {
  // placeholder – keeps build working
  return text;
};
