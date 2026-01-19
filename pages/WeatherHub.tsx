
import React, { useState } from 'react';
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
  AlertTriangle,
  ShieldAlert,
  Zap,
  Info,
  ArrowRight
} from 'lucide-react';
import { getDistrictWeather } from '../services/gemini';

const districts = [
  "Srinagar", "Jammu", "Anantnag", "Baramulla", "Budgam", 
  "Pulwama", "Kupwara", "Shopian", "Ganderbal", "Kulgam", 
  "Kathua", "Samba", "Udhampur", "Reasi", "Rajouri", 
  "Poonch", "Doda", "Ramban", "Kishtwar", "Bandipora"
];

const agriAlerts = [
  {
    id: 1,
    title: "Frost Warning (Bloom Phase)",
    severity: "Critical",
    type: "Frost",
    icon: Snowflake,
    color: "rose",
    districts: ["Shopian", "Pulwama", "Anantnag"],
    message: "Sub-zero temperatures expected during late night. High risk of bloom drop in Apple and Cherry orchards.",
    advisory: "Apply light irrigation or create small smudge fires (controlled smoke) in orchards to maintain temperature."
  },
  {
    id: 2,
    title: "Heavy Rainfall Alert",
    severity: "High",
    type: "Rain",
    icon: CloudRain,
    color: "blue",
    districts: ["Kupwara", "Baramulla", "Bandipora"],
    message: "Continuous heavy rain forecast for next 48 hours. Risk of water-logging in low-lying paddy fields.",
    advisory: "Ensure all drainage channels (Vandh) are clear. Postpone any planned pesticide sprays."
  },
  {
    id: 3,
    title: "High Wind Gusts",
    severity: "Moderate",
    type: "Wind",
    icon: Wind,
    color: "amber",
    districts: ["Ganderbal", "Srinagar"],
    message: "Strong winds expected exceeding 40km/h. Potential damage to young saplings and trellis systems.",
    advisory: "Check and reinforce support stakes for high-density plantations. Secure loose equipment."
  }
];

interface WeatherData {
  temperature?: string;
  condition?: string;
  precipitation?: string;
  humidity?: string;
  windSpeed?: string;
  forecast?: string;
  farmerTip?: string;
  urduSummary?: string;
}

const WeatherHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [detailedWeather, setDetailedWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredDistricts = districts.filter(d => 
    d.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchDetails = async (district: string) => {
    setSelectedDistrict(district);
    setLoading(true);
    setDetailedWeather(null);
    try {
      const data = await getDistrictWeather(district);
      setDetailedWeather(data);
    } catch (e) {
      setDetailedWeather({ 
        forecast: "Failed to fetch real-time data. Please check your connection and try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20 no-scrollbar">
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900 mb-2">District Weather Hub</h2>
            <p className="text-slate-500 font-medium">Real-time agricultural weather forecasts for all 20 districts of J&K.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 shadow-sm">
             <Zap className="w-4 h-4 text-emerald-600 animate-pulse" />
             <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Satellite Link: Active</span>
          </div>
        </div>

        {/* Dynamic Agri-Alerts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {agriAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`bg-${alert.color}-50 border border-${alert.color}-100 p-6 rounded-[2rem] relative overflow-hidden group hover:shadow-lg transition-all`}
            >
              <div className="relative z-10 flex flex-col h-full gap-4">
                <div className="flex items-center justify-between">
                  <div className={`p-2 bg-${alert.color}-100 text-${alert.color}-600 rounded-xl`}>
                    <alert.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-${alert.color}-600 text-white shadow-sm`}>
                    {alert.severity} Alert
                  </span>
                </div>
                
                <div>
                  <h4 className={`text-lg font-bold text-${alert.color}-900`}>{alert.title}</h4>
                  <p className={`text-xs text-${alert.color}-800/70 font-bold uppercase tracking-tighter mt-1`}>
                    Affected: {alert.districts.join(", ")}
                  </p>
                </div>

                <div className="bg-white/50 p-3 rounded-xl border border-white/20 backdrop-blur-sm">
                  <p className={`text-xs text-${alert.color}-900 leading-relaxed font-medium italic`}>
                    "{alert.message}"
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-black/5">
                   <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Recommended Action:</p>
                   <p className={`text-xs font-bold text-${alert.color}-700 leading-snug`}>{alert.advisory}</p>
                </div>
              </div>
              <alert.icon className={`absolute -bottom-6 -right-6 w-32 h-32 text-${alert.color}-200/20 group-hover:scale-110 transition-transform duration-700`} />
            </div>
          ))}
        </div>

        <div className="relative group max-w-xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-emerald-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search your district..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4.5 bg-white border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none shadow-sm transition-all font-medium text-slate-800"
          />
        </div>
      </header>

      {/* Grid of Districts */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredDistricts.map((district) => (
          <button
            key={district}
            onClick={() => fetchDetails(district)}
            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col items-center gap-3 text-center group active:scale-95"
          >
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              {district === 'Jammu' ? <Sun className="w-8 h-8" /> : <Cloud className="w-8 h-8" />}
            </div>
            <div>
              <h4 className="font-bold text-slate-900">{district}</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tap for Info</p>
            </div>
          </button>
        ))}
      </div>

      {/* Weather Detail Modal */}
      {selectedDistrict && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedDistrict(null)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="bg-emerald-900 p-8 text-white flex justify-between items-start shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Weather Station</span>
                </div>
                <h3 className="text-3xl font-bold font-heading">{selectedDistrict}</h3>
                <p className="text-emerald-200 text-sm font-medium">{detailedWeather?.condition || 'Loading condition...'}</p>
              </div>
              <button 
                onClick={() => setSelectedDistrict(null)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 lg:p-12 overflow-y-auto no-scrollbar flex-1">
              {loading ? (
                <div className="py-20 flex flex-col items-center gap-4 text-slate-400">
                  <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
                  <p className="font-bold uppercase tracking-widest text-xs">Fetching Satellites...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                       <Thermometer className="w-8 h-8 text-rose-500" />
                       <div>
                         <span className="text-xs font-black text-slate-400 uppercase">Temp</span>
                         <p className="text-xl font-bold text-slate-900">{detailedWeather?.temperature || '--'}</p>
                       </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                       <Droplets className="w-8 h-8 text-blue-500" />
                       <div>
                         <span className="text-xs font-black text-slate-400 uppercase">Rain %</span>
                         <p className="text-xl font-bold text-slate-900">{detailedWeather?.precipitation || '--'}</p>
                       </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                       <Wind className="w-8 h-8 text-slate-500" />
                       <div>
                         <span className="text-xs font-black text-slate-400 uppercase">Wind</span>
                         <p className="text-xl font-bold text-slate-900">{detailedWeather?.windSpeed || '--'}</p>
                       </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                       <Cloud className="w-8 h-8 text-slate-400" />
                       <div>
                         <span className="text-xs font-black text-slate-400 uppercase">Humidity</span>
                         <p className="text-xl font-bold text-slate-900">{detailedWeather?.humidity || '--'}</p>
                       </div>
                    </div>
                  </div>

                  {/* AI Narrative */}
                  <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2rem] relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                      <h4 className="font-bold text-emerald-900 text-lg flex items-center gap-2">
                        <Zap className="w-5 h-5 animate-pulse" /> AI Agri-Meteorological Insight
                      </h4>
                      <p className="text-emerald-800 font-medium leading-relaxed">
                        {detailedWeather?.forecast}
                      </p>
                      
                      <div className="bg-white/60 p-4 rounded-xl border border-emerald-100/50">
                        <p className="text-xs font-black text-emerald-900 uppercase mb-1">Farmer's Tip</p>
                        <p className="text-sm text-emerald-800 font-bold">{detailedWeather?.farmerTip}</p>
                      </div>

                      {detailedWeather?.urduSummary && (
                         <div className="text-right border-t border-emerald-200 pt-4 mt-4">
                            <p className="text-lg text-emerald-900 font-medium leading-loose" dir="rtl">
                               {detailedWeather.urduSummary}
                            </p>
                         </div>
                      )}
                    </div>
                    <Cloud className="absolute -bottom-10 -right-10 w-40 h-40 text-emerald-200/30" />
                  </div>

                  <button 
                    onClick={() => setSelectedDistrict(null)}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2 sticky bottom-0"
                  >
                    Got it, Back to List <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherHub;
