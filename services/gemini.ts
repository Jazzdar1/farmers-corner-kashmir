// services/gemini.ts
// SAFE MOCK LAYER (frontend only)

const delay = (ms = 500) => new Promise(res => setTimeout(res, ms));

export async function getExpertAdvice(question: string) {
  await delay();
  return {
    answer:
      "Based on local conditions, monitor crops regularly, manage irrigation carefully, and follow SKUAST-K advisories."
  };
}

export async function analyzeCropDisease() {
  await delay();
  return {
    disease: "Leaf Blight",
    confidence: 0.82,
    advice: "Apply recommended fungicide and avoid excess moisture.",
    symptoms: [
      "Brown spots on leaves",
      "Yellowing",
      "Reduced growth"
    ],
    recommendations: [
      "Remove infected leaves",
      "Use certified fungicide",
      "Improve drainage"
    ],
    audioBase64: null
  };
}

export async function findNearbyMandis() {
  await delay();
  return [
    { name: "Srinagar Mandi", distance: "5 km" },
    { name: "Anantnag Mandi", distance: "32 km" }
  ];
}

export async function findNearbyDealers() {
  await delay();
  return [
    { name: "Agro Seeds Store", distance: "3 km" },
    { name: "Krishi Kendra", distance: "6 km" }
  ];
}
