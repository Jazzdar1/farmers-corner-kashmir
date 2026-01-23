// src/services/ai.ts
// ======================================
// NORMALIZED AI LAYER (CRASH-PROOF)
// ======================================

/* ---------- Types ---------- */

export type ExpertReply = {
  answer: string;
};

export type DiseaseResult = {
  diseaseName: string;
  confidence: number;
  description: string;
  severity: "Low" | "Medium" | "High";
  treatment: string[];
};

/* ---------- Helpers ---------- */

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));

const safeArray = <T,>(v: any): T[] => (Array.isArray(v) ? v : []);
const safeString = (v: any, fallback = "") =>
  typeof v === "string" ? v : fallback;

/* ---------- Expert Chat ---------- */

export async function getExpertAdvice(question: string): Promise<ExpertReply> {
  await delay();

  return {
    answer:
      "Based on local conditions, ensure proper irrigation, monitor pests weekly, and follow SKUAST-K advisories."
  };
}

/* ---------- Crop Diagnosis ---------- */

export async function analyzeCropDisease(
  imageBase64: string,
  lang: "ur" | "en" = "en"
): Promise<DiseaseResult> {
  await delay(800);

  return {
    diseaseName: "Leaf Blight",
    confidence: 0.84,
    severity: "Medium",
    description:
      "Fungal infection causing brown lesions and reduced photosynthesis.",
    treatment: safeArray([
      "Apply recommended fungicide",
      "Avoid overhead irrigation",
      "Remove infected leaves"
    ])
  };
}
