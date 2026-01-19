type AITextResult = { text: string };
type WeatherResult = { condition: string };

async function callAI(prompt: string): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  return data.text || "";
}

/* ---------------- WEATHER ---------------- */
export async function getDistrictWeather(
  latOrDistrict: number | string,
  lon?: number
): Promise<WeatherResult> {
  const query =
    typeof latOrDistrict === "number"
      ? `Weather for latitude ${latOrDistrict} longitude ${lon}`
      : `Weather for district ${latOrDistrict}`;

  const text = await callAI(query);
  return { condition: text };
}

/* ---------------- MANDI ---------------- */
export async function findNearbyMandis(
  lat: number,
  lon: number
): Promise<AITextResult> {
  const text = await callAI(
    `Find nearby mandis for latitude ${lat} longitude ${lon}`
  );
  return { text };
}

/* ---------------- DEALERS ---------------- */
export async function findNearbyDealers(
  lat: number,
  lon: number
): Promise<AITextResult> {
  const text = await callAI(
    `Find nearby fertilizer and seed dealers for latitude ${lat} longitude ${lon}`
  );
  return { text };
}

/* ---------------- EXPERT CHAT ---------------- */
export async function getExpertAdvice(
  history: any,
  question: string,
  language: string
): Promise<string> {
  return callAI(
    `Answer in ${language}. Question: ${question}. Context: ${JSON.stringify(
      history
    )}`
  );
}

/* ---------------- DISEASE ANALYSIS ---------------- */
export async function analyzeCropDisease(
  imageData: string,
  language?: string
): Promise<any> {
  const text = await callAI(
    `Analyze crop disease from image data. Respond in ${
      language || "English"
    }`
  );

  return {
    diseaseName: "Detected issue",
    description: text,
    solution: text,
  };
}

/* ---------------- DEEP EXPERT VIEW ---------------- */
export async function getDeepExpertView(
  data: string,
  diseaseName: string
): Promise<string> {
  return callAI(
    `Provide deep expert analysis for ${diseaseName}. Data: ${data}`
  );
}

/* ---------------- AUDIO PLACEHOLDER ---------------- */
export async function generateUrduDiagnosisAudio(text: string) {
  return text;
}
