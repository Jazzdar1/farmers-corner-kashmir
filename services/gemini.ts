
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { DiseaseAnalysis } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCropDisease = async (base64Image: string, language: 'en' | 'ur' | 'hi' = 'en'): Promise<DiseaseAnalysis> => {
  const ai = getAI();
  const langPrompt = language === 'ur' ? "Provide response in Urdu script." : language === 'hi' ? "Provide response in Hindi script." : "Provide response in English.";
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: `Act as a senior pathologist from SKUAST-K (Sher-e-Kashmir University of Agricultural Sciences and Technology). 
          Analyze this plant image for diseases common in Jammu & Kashmir (like Apple Scab, Alternaria, San Jose Scale, Saffron Corm Rot). 
          ${langPrompt} 
          Provide details strictly in JSON format including:
          - diseaseName
          - severity (Low/Medium/High)
          - confidence (0-1)
          - description (Clinical signs observed)
          - treatment (List of specific fungicide/pesticide brands used in Kashmir like Captan, Mancozeb, Hexaconazole, etc. with exact dosage per 100L water)
          - preventiveMeasures (Agricultural practices like pruning, sanitation, drainage).`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diseaseName: { type: Type.STRING },
          severity: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          description: { type: Type.STRING },
          treatment: { type: Type.ARRAY, items: { type: Type.STRING } },
          preventiveMeasures: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["diseaseName", "severity", "confidence", "description", "treatment", "preventiveMeasures"]
      }
    },
  });

  return JSON.parse(response.text || '{}');
};

export const getDeepExpertView = async (base64Image: string, diseaseName: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: `You are a world-class AI Agricultural Scientist specializing in Himalayan temperate climates. 
          The previous diagnosis identified this as ${diseaseName}. 
          Provide an advanced "Deep Expert View" covering:
          1. Biological cycle of the pathogen.
          2. Specific environmental triggers (micro-climate, humidity thresholds, degree-day models).
          3. Advanced bio-control strategies (e.g., Trichoderma viride applications).
          4. Long-term orchard management to build resilience.
          
          Use scientific yet accessible language. Format with professional Markdown.`,
        },
      ],
    },
    config: {
      thinkingConfig: { thinkingBudget: 1000 }
    }
  });
  return response.text || "Expert analysis currently unavailable.";
};

export const generateUrduDiagnosisAudio = async (analysis: DiseaseAnalysis) => {
  const ai = getAI();
  const prompt = `As a friendly female agricultural expert from Kashmir, speak the following diagnosis in clear, natural Urdu (native accent). 
  Start with: "As-salamu alaykum. Aap ki fasal ka mushahida karne ke baad, hamein ${analysis.diseaseName} ki nishandahi hui hai."
  Then describe the severity: "Is ki shiddat ${analysis.severity} hai."
  Summarize the treatment: "Hamaari tajveez hai ke aap ${analysis.treatment.slice(0, 2).join(' aur ')} ka istemal karein."
  End with the question: "Kya aap ko is ke mutaliq mazeed kisi madad ki zaroorat hai? (Do you need any further help with this?)"`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' }, 
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const getExpertAdvice = async (history: { role: string; parts: { text: string }[] }[], prompt: string, language: 'en' | 'ur' | 'hi' = 'en') => {
  const ai = getAI();
  const langInstruction = {
    ur: "Speak and write primarily in Urdu (اردو). Help farmers in their native language.",
    hi: "Speak and write primarily in Hindi (हिंदी). Help farmers in their native language.",
    en: "Speak and write primarily in English, but use local Kashmiri/Urdu terms where appropriate."
  }[language];

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [...history.map(h => ({ role: h.role, parts: h.parts })), { role: 'user', parts: [{ text: prompt }] }],
    config: {
      systemInstruction: `You are 'Zahoor Ahmad', a world-class agricultural expert specializing in the Kashmir Valley. 
      ${langInstruction}
      You help farmers manage their orchards (Apples, Pears, Walnuts, Almonds) and spice fields (Saffron).
      Your advice is strictly localized to the temperate climate of Jammu & Kashmir and must align with SKUAST-K guidelines.
      Use a polite, fatherly, and professional tone.`,
      tools: [{ googleSearch: {} }]
    },
  });
  
  return response.text;
};

export const getDistrictWeather = async (district: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Retrieve current real-time weather data for ${district} district, Jammu and Kashmir. 
    Using Google Search, get the live temperature, condition, precipitation chance, humidity, and wind speed.
    Also generate a short forecast and a relevant farmer tip for this specific weather condition in J&K context.
    Translate the summary to Urdu.
    
    Return the response in strict JSON format with the following schema:
    {
      "temperature": "string (e.g. 12°C)",
      "condition": "string (e.g. Rainy, Cloudy, Sunny)",
      "precipitation": "string (e.g. 80%)",
      "humidity": "string (e.g. 65%)",
      "windSpeed": "string (e.g. 15 km/h)",
      "forecast": "string (Brief outlook)",
      "farmerTip": "string (Agricultural advice)",
      "urduSummary": "string (Urdu translation)"
    }`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          temperature: { type: Type.STRING },
          condition: { type: Type.STRING },
          precipitation: { type: Type.STRING },
          humidity: { type: Type.STRING },
          windSpeed: { type: Type.STRING },
          forecast: { type: Type.STRING },
          farmerTip: { type: Type.STRING },
          urduSummary: { type: Type.STRING }
        },
        required: ["temperature", "condition", "precipitation", "forecast", "farmerTip"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const findNearbyMandis = async (lat: number, lng: number) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Find the nearest Fruit and Vegetable Mandis (Market Yards) to my current location (lat: ${lat}, lng: ${lng}) in Kashmir.`,
    config: {
      tools: [{ googleMaps: {} }, { googleSearch: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng
          }
        }
      }
    },
  });
  return {
    text: response.text || "No Mandis found near your location.",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

export const findNearbyDealers = async (lat: number, lng: number) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Find the nearest verified pesticide and fertilizer dealers or agricultural stores near my current location (lat: ${lat}, lng: ${lng}) in Kashmir. Focus on shops in Sopore, Srinagar, Pulwama, and Shopian areas.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng
          }
        }
      }
    },
  });
  return {
    text: response.text || "No verified dealers found nearby.",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};
