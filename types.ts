
export interface CropPrice {
  id: string;
  name: string;
  mandi: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface DiseaseAnalysis {
  diseaseName: string;
  severity: 'Low' | 'Medium' | 'High';
  confidence: number;
  description: string;
  treatment: string[];
  preventiveMeasures: string[];
}
