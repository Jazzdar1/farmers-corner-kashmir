// services/gemini.ts

/* ================= INTERNAL AI CALL ================= */

async function callAI(prompt: string): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error("AI request failed");
  }

  const data = await res.json();
  return data.text || "";
}

/* ================= WEATHER ================= */

export async function getDistrictWeather(
  latOrDistrict: number | string,
  lon?: number
): Promise<{ condition: string }> {
  const query =
    typeof latOrDistrict === "number"
      ? `Weather summary for latitude ${latOrDistrict} longitude ${lon}`
      : `Weather summary for district ${latOrDistrict}`;

  const text = await callAI(query);
  return { condition: text };
}

/* ================= MANDI ================= */

export async function findNearbyMandis(
  lat: number,
  lon: number
): Promise<{ text: string }> {
  const text = await callAI(
    `Find nearby mandis and prices near latitude ${lat} longitude ${lon}`
  );
  return { text };
}

/* ================= DEALERS ================= */

export async function findNearbyDealers(
  lat: number,
  lon: number
): Promise<{ text: string }> {
  const text = await callAI(
    `Find nearby fertilizer and seed dealers near latitude ${lat} longitude ${lon}`
  );
  return { text };
}

/* ================= EXPERT CHAT ================= */

export async function getExpertAdvice(
  history: any,
  question: string,
  language: string
): Promise<string> {
  return callAI(
    `You are an agriculture expert. Answer in ${language}.
     Question: ${question}
     Context: ${JSON.stringify(history)}`
  );
}

/* ================= DISEASE ANALYSIS ================= */

export async function analyzeCropDisease(
  image: string,
  language?: string
): Promise<{
  diseaseName: string;
  description: string;
  severity: "Low" | "Medium" | "High";
  confidence: number;
  treatment: string[];
  preventiveMeasures: string[];
}> {
  // Placeholder AI call
  await callAI(
    `Analyze crop disease from image. Respond in ${language || "English"}`
  );

  return {
    diseaseName: "Detected Crop Issue",
    description:
      "The crop shows visible symptoms of stress or infection based on leaf color and texture.",
    severity: "Medium", // ✅ FIXED ENUM
    confidence: 0.85,
    treatment: [
      "Apply recommended fungicide",
      "Avoid over-irrigation",
      "Remove affected leaves"
    ],
    preventiveMeasures: [
      "Use certified seeds",
      "Maintain proper spacing",
      "Regular field inspection"
    ]
  };
}

/* ================= DEEP EXPERT VIEW ================= */

export async function getDeepExpertView(
  data: string,
  diseaseName: string
): Promise<string> {
  return callAI(
    `Provide deep expert agricultural analysis for ${diseaseName}. Data: ${data}`
  );
}

/* ================= AUDIO PLACEHOLDER ================= */

export async function generateUrduDiagnosisAudio(
  analysis: any
): Promise<string> {
  return JSON.stringify(analysis);
}
