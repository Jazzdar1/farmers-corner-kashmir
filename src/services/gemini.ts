// src/services/gemini.ts

// ?? Fake delay helper (simulate API)
const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function analyzeCropDisease(imageBase64?: string) {
  await wait(800);
  return {
    disease: "Leaf Blight",
    confidence: 0.82,
    advice: "Use recommended fungicide and avoid over-irrigation."
  };
}

export async function generateUrduDiagnosisAudio(text: string) {
  await wait(500);
  return {
    audioUrl: null, // placeholder
    message: "Audio generation will be enabled soon"
  };
}

export async function getDeepExpertView(disease: string) {
  await wait(700);
  return {
    explanation: `Detailed expert analysis for ${disease}`,
    prevention: [
      "Crop rotation",
      "Proper spacing",
      "Early detection"
    ]
  };
}

export async function findNearbyMandis(location?: string) {
  await wait(600);
  return [
    { name: "Srinagar Mandi", distance: "5 km" },
    { name: "Anantnag Mandi", distance: "32 km" }
  ];
}
