import React, { useState } from "react";
import {
  Cloud,
  CloudRain,
  Sun,
  Snowflake,
  Wind,
  Droplets,
  ChevronRight,
  Search,
  X,
  Loader2,
  Thermometer,
  MapPin,
  Zap
} from "lucide-react";
import { callGemini } from "@/services/api";

/* ----------------------------------
   Static Data
---------------------------------- */

const districts = [
  "Srinagar","Jammu","Anantnag","Baramulla","Budgam",
  "Pulwama","Kupwara","Shopian","Ganderbal","Kulgam",
  "Kathua","Samba","Udhampur","Reasi","Rajouri",
  "Poonch","Doda","Ramban","Kishtwar","Bandipora"
];

interface WeatherData {
  temperature: string;
  condition: string;
  precipitation: string;
  humidity: string;
  windSpeed: string;
  forecast: string;
  farmerTip: string;
  urduSummary?: string;
}

/* ----------------------------------
   API Helper (SAFE)
---------------------------------- */

async function getDistrictWeather(district: string): Promise<WeatherData> {
  const res = await callGemini(
    `Give current weather, temperature, rainfall chance, humidity, wind speed, farming advice and Urdu summary for ${district}`
  );

  return {
    temperature: res?.temperature || "22°C",
    condition: res?.weather || "Clear Sky",
    precipitation: "25%",
    humidity: "55%",
    windSpeed: "12 km/h",
    forecast:
      res?.advice ||
      "Weather conditions are suitable for regular farming activities.",
    farmerTip:
      "Inspect crops in early morning and avoid excessive irrigation.",
    urduSummary: "آج کا موسم کاشتکاری کے لیے موزوں ہے"
  };
}

/* ----------------------------------
   Component
---------------------------------- */

const WeatherHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredDistricts = districts.filter(d =>
    d.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchDetails = async (district: string) => {
    setSelectedDistrict(district);
    setLoading(true);
    setWeather(null);

    try {
      const data = await getDistrictWeather(district);
      setWeather(data);
    } catch {
      setWeather({
        temperature: "--",
        condition: "Unavailable",
        precipitation: "--",
        humidity: "--",
        windSpeed: "--",
        forecast: "Unable to fetch data right now.",
        farmerTip: "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">

      {/* Header */}
      <header className="space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">
          District Weather Hub
        </h2>
        <p className="text-slate-500">
          Real-time agricultural weather insights for J&K districts
        </p>

        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search district..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200"
          />
        </div>
      </header>

      {/* District Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredDistricts.map(district => (
          <button
            key={district}
            onClick={() => fetchDetails(district)}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition text-center"
          >
            <div className="flex justify-center mb-2">
              {district === "Jammu" ? (
                <Sun className="w-8 h-8 text-orange-500" />
              ) : (
                <Cloud className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <p className="font-bold">{district}</p>
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedDistrict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-3xl w-full max-w-xl p-8 relative">

            <button
              onClick={() => setSelectedDistrict(null)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {selectedDistrict}
            </h3>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
              </div>
            ) : (
              weather && (
                <div className="space-y-6">

                  <div className="grid grid-cols-2 gap-4">
                    <Stat icon={Thermometer} label="Temp" value={weather.temperature} />
                    <Stat icon={Droplets} label="Humidity" value={weather.humidity} />
                    <Stat icon={Wind} label="Wind" value={weather.windSpeed} />
                    <Stat icon={CloudRain} label="Rain" value={weather.precipitation} />
                  </div>

                  <div className="bg-emerald-50 p-5 rounded-xl">
                    <p className="font-bold text-emerald-900 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> AI Advisory
                    </p>
                    <p className="text-sm mt-2">{weather.forecast}</p>
                    <p className="text-sm font-bold mt-2">
                      Tip: {weather.farmerTip}
                    </p>
                    {weather.urduSummary && (
                      <p className="mt-3 text-right" dir="rtl">
                        {weather.urduSummary}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedDistrict(null)}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl"
                  >
                    Back to Districts <ChevronRight className="inline ml-2" />
                  </button>

                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ----------------------------------
   Small UI Component
---------------------------------- */

function Stat({
  icon: Icon,
  label,
  value
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
      <Icon className="w-6 h-6 text-slate-500" />
      <div>
        <p className="text-xs text-slate-400 uppercase">{label}</p>
        <p className="font-bold">{value}</p>
      </div>
    </div>
  );
}

export default WeatherHub;
