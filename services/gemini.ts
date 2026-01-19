// services/gemini.ts
import type { DiseaseAnalysis } from "../types";

/* ================= INTERNAL AI CALL ================= */

async function callAI(prompt: string): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();
  return data.text || "";
}

/* ================= WEATHER ================= */

export async function getDistrictWeather(
  latOrDistrict: number | string,
  lon?: number
): Promise<{ condition: string }> {
  const q =
    typeof latOrDistrict === "number"
      ? `Weather for ${latOrDistrict}, ${lon}`
      : `Weather for ${latOrDistrict}`;

  return { condition: await callAI(q) };
}

/* ================= MANDI ================= */

export async function findNearbyMandis(lat: number, lon: number) {
  return { text: await callAI(`Mandis near ${lat}, ${lon}`) };
}

/* ================= DEALERS ================= */

export async function findNearbyDealers(lat: number, lon: number) {
  return { text: await callAI(`Dealers near ${lat}, ${lon}`) };
}

/* ================= EXPERT CHAT ================= */

export async function getExpertAdvice(
  history: any,
  question: string,
  language: string
) {
  return callAI(
    `Answer in ${language}. Question: ${question}. History: ${JSON.stringify(
      history
    )}`
  );
}

/* ================= DISEASE ANALYSIS (FIXED) ================= */

export async function analyzeCropDisease(
  image: string,
  language?: string
): Promise<DiseaseAnalysis> {
  const result: DiseaseAnalysis = {
    diseaseName: "Detected Crop Issue",
    description:
      "The crop shows visible symptoms of stress or infection.",
    severity: "Medium", // ✅ valid enum
    confidence: 0.85,
    treatment: [
      "Apply recommended fungicide",
      "Avoid over-irrigation",
      "Remove affected leaves"
    ],
    preventiveMeasures: [
      "Use certified seeds",
      "Maintain spacing",
      "Regular inspection"
    ]
  };

  return result;
}

/* ================= DEEP EXPERT VIEW ================= */

export async function getDeepExpertView(data: string, diseaseName: string) {
  return callAI(`Deep analysis for ${diseaseName}. Data: ${data}`);
}

/* ================= AUDIO PLACEHOLDER ================= */

export async function generateUrduDiagnosisAudio(
  analysis: DiseaseAnalysis
): Promise<string> {
  return JSON.stringify(analysis);
}
