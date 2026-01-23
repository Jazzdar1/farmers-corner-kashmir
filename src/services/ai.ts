// src/services/ai.ts
// =================================================
// NORMALIZED AI SERVICE (FRONTEND SAFE)
// =================================================

/* ------------------ Types ------------------ */

export type ExpertReply = {
  answer: string;
};

export type DiseaseResult = {
  diseaseName: string;
  confidence: number;
  severity: "Low" | "Medium" | "High";
  description: string;
  treatment: string[];
};

/* ------------------ Helpers ------------------ */

const safeString = (v: any, fallback = "") =>
  typeof v === "string" ? v : fallback;

const safeArray = <T,>(v: any): T[] => (Array.isArray(v) ? v : []);

/* ------------------ Expert Chat ------------------ */

export async function getExpertAdvice(
  question: string
): Promise<ExpertReply> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "expert",
      prompt: question
    })
  });

  if (!res.ok) {
    throw new Error("AI backend failed");
  }

  const data = await res.json();

  return {
    answer: safeString(data?.answer, "Expert response unavailable.")
  };
}

/* ------------------ Crop Diagnosis ------------------ */

export async function analyzeCropDisease(
  imageBase64: string,
  lang: "ur" | "en" = "en"
): Promise<DiseaseResult> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "crop-diagnosis",
      image: imageBase64,
      language: lang
    })
  });

  if (!res.ok) {
    throw new Error("Diagnosis failed");
  }

  const data = await res.json();

  return {
    diseaseName: safeString(data?.diseaseName, "Unknown Disease"),
    confidence: typeof data?.confidence === "number" ? data.confidence : 0.5,
    severity:
      data?.severity === "High" ||
      data?.severity === "Medium" ||
      data?.severity === "Low"
        ? data.severity
        : "Low",
    description: safeString(
      data?.description,
      "No detailed description available."
    ),
    treatment: safeArray<string>(data?.treatment)
  };
}
