// src/services/gemini.ts
// ===================================================
// AI SERVICE (SAFE MOCK – FRONTEND ONLY)
// ===================================================

export type DiseaseAnalysis = {
  disease: string;
  confidence: number;
  advice: string;
  symptoms: string[];
  recommendations: string[];
  audioBase64?: string | null;
};

// ---------------------------------------------------
// Core mock AI call
// ---------------------------------------------------
async function delay(ms = 600) {
  return new Promise(res => setTimeout(res, ms));
}

export async function callAI(prompt: string) {
  console.log("🤖 AI Prompt:", prompt);
  await delay();

  return {
    text: "AI running in demo mode"
  };
}

// ---------------------------------------------------
// Weather
// ---------------------------------------------------
export async function getDistrictWeather(district: string) {
  await delay();

  return {
    temperature: "22°C",
    condition: "Clear Sky",
    precipitation: "20%",
    humidity: "55%",
    windSpeed: "10 km/h",
    forecast: "Weather is suitable for farming activities.",
    farmerTip: "Avoid over-irrigation.",
    urduSummary: "آج موسم زراعت کے لیے سازگار ہے"
  };
}

// ---------------------------------------------------
// Expert Chat
// ---------------------------------------------------
export async function getExpertAdvice(question: string) {
  await delay();

  return {
    answer:
      "Monitor crops regularly, maintain soil moisture, and follow local advisories."
  };
}

// ---------------------------------------------------
// Crop Disease Analysis (VERY IMPORTANT FIX)
// ---------------------------------------------------
export async function analyzeCropDisease(): Promise<DiseaseAnalysis> {
  await delay();

  return {
    disease: "Leaf Blight",
    confidence: 0.84,
    advice: "Apply recommended fungicide and avoid excess moisture.",
    symptoms: [
      "Brown leaf spots",
      "Yellowing of leaves",
      "Reduced plant vigor"
    ],
    recommendations: [
      "Remove infected leaves",
      "Use certified fungicide",
      "Improve field drainage"
    ],
    audioBase64: null // 🔥 important: null, not undefined
  };
}

// ---------------------------------------------------
// Mandis / Dealers
// ---------------------------------------------------
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
    {
      name: "Agro Seeds Store",
      category: "Seeds & Fertilizer",
      distance: "3 km"
    },
    {
      name: "Kashmir Krishi Kendra",
      category: "Pesticides",
      distance: "6 km"
    }
  ];
}
