
import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Zap, 
  Navigation,
  Loader2,
  CloudRain,
  Snowflake,
  ArrowRight,
  ScanEye,
  RefreshCw,
  FlaskConical,
  Calculator,
  ShieldCheck,
  Globe,
  LineChart,
  Droplets,
  MessageSquare,
  Stethoscope,
  Warehouse,
  MapPin,
  Award,
  Sun
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { findNearbyMandis, getDistrictWeather } from '../services/gemini';

// Re-using the districts list from WeatherHub for consistency
const districts = [
  "Srinagar", "Jammu", "Anantnag", "Baramulla", "Budgam", 
  "Pulwama", "Kupwara", "Shopian", "Ganderbal", "Kulgam", 
  "Kathua", "Samba", "Udhampur", "Reasi", "Rajouri", 
  "Poonch", "Doda", "Ramban", "Kishtwar", "Bandipora"
];

const WeatherScene: React.FC<{ condition: 'rain' | 'snow' | 'sun' }> = ({ condition }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem]">
      {condition === 'rain' && Array.from({ length: 20 }).map((_, i) => (
        <div 
          key={i} 
          className="absolute bg-blue-400/40 w-[1px] h-6 animate-rainfall"
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `-${Math.random() * 20}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${0.5 + Math.random() * 0.5}s`
          }} 
        />
      ))}
      {condition === 'snow' && Array.from({ length: 15 }).map((_, i) => (
        <div 
          key={i} 
          className="absolute bg-white/60 w-1 h-1 rounded-full animate-snowfall blur-[1px]"
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `-${Math.random() * 20}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }} 
        />
      ))}
       {condition === 'sun' && (
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-amber-400/20 rounded-full blur-[60px] animate-pulse" />
      )}
      <style>{`
        @keyframes rainfall {
          0% { transform: translateY(0) rotate(15deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(400px) rotate(15deg); opacity: 0; }
        }
        @keyframes snowfall {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(400px) translateX(20px); opacity: 0; }
        }
        .animate-rainfall { animation: rainfall linear infinite; }
        .animate-snowfall { animation: snowfall linear infinite; }
      `}</style>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [nearbyMandi, setNearbyMandi] = useState<string | null>(null);
  const [loadingMandi, setLoadingMandi] = useState(false);
  const [mandiError, setMandiError] = useState<string | null>(null);
  const [weatherCondition, setWeatherCondition] = useState<'rain' | 'snow' | 'sun'>('rain');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [selectedWeatherDistrict, setSelectedWeatherDistrict] = useState<string>('Srinagar');
  const [loadingWeather, setLoadingWeather] = useState(false);

  const fetchMandi = async () => {
    setLoadingMandi(true);
    mandiError && setMandiError(null);
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const res = await findNearbyMandis(pos.coords.latitude, pos.coords.longitude);
              if (res && res.text) {
                setNearbyMandi(res.text.slice(0, 150) + (res.text.length > 150 ? '...' : ''));
              } else {
                setNearbyMandi("No Mandis found near your location.");
              }
            } catch (err) {
              setMandiError("AI Search failed.");
            } finally {
              setLoadingMandi(false);
            }
          }, 
          (err) => {
            setMandiError("Location access denied.");
            setLoadingMandi(false);
          },
          { timeout: 10000 }
        );
      } else {
        setMandiError("Geolocation not supported.");
        setLoadingMandi(false);
      }
    } catch (e) {
      setMandiError("Failed to fetch Mandis.");
      setLoadingMandi(false);
    }
  };

  const loadWeather = async (district: string) => {
    setLoadingWeather(true);
    try {
      const data = await getDistrictWeather(district);
      setWeatherData(data);
      if (data.condition) {
        const cond = data.condition.toLowerCase();
        if (cond.includes('rain') || cond.includes('drizzle')) setWeatherCondition('rain');
        else if (cond.includes('snow') || cond.includes('sleet')) setWeatherCondition('snow');
        else setWeatherCondition('sun');
      }
    } catch (e) {
      console.error("Dashboard weather fetch failed", e);
      setWeatherData({ forecast: "Weather data unavailable." });
      setWeatherCondition('sun'); // Default to sun if error
    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    fetchMandi();
  }, []);

  useEffect(() => {
    loadWeather(selectedWeatherDistrict); // Load weather initially for selected district
    const interval = setInterval(() => loadWeather(selectedWeatherDistrict), 15000); // Poll every 15 seconds
    return () => clearInterval(interval); // Clean up interval on component unmount or district change
  }, [selectedWeatherDistrict]);

  return (
    <div className="space-y-8 lg:space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-1">Salaam, Farmer! 👋</h2>
          <p className="text-slate-500 font-medium tracking-tight">Your AI-powered agricultural bridge in the Kashmir Valley.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm self-start md:self-auto">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-slate-700">Digital Hub: Online</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-[3rem] p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 flex flex-col justify-between h-full gap-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">SmartDiagnose Pro</span>
              </div>
              <h3 className="text-4xl lg:text-5xl font-heading font-bold leading-[1.1]">
                Diagnose Diseases <br/>
                <span className="text-emerald-400">Instantly.</span>
              </h3>
              <p className="text-emerald-100/70 text-lg font-medium max-w-lg leading-relaxed">
                Scan your crop with our advanced AI laboratory. Get Urdu voice results following SKUAST-K guidelines.
              </p>
              <Link 
                to="/smart-diagnose" 
                className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-emerald-500/20 active:scale-95 group"
              >
                Start Smart Diagnose <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 p-12 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <Stethoscope className="w-64 h-64" />
          </div>
        </div>

        {/* Real-View Weather Card */}
        <div className="lg:col-span-4 bg-slate-900 rounded-[3rem] border border-white/5 p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
          <WeatherScene condition={weatherCondition} />
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl border ${weatherCondition === 'sun' ? 'bg-amber-500/20 text-amber-400 border-amber-500/20' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20'}`}>
                  {weatherCondition === 'rain' ? <CloudRain className="w-6 h-6" /> : weatherCondition === 'snow' ? <Snowflake className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                </div>
                <h4 className="font-bold text-white text-lg">Real-View</h4>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
                Live
              </div>
            </div>
            
            <div className="space-y-1">
              {loadingWeather ? (
                <Loader2 className="w-10 h-10 animate-spin text-emerald-400" />
              ) : (
                <span className="text-5xl font-black text-white">{weatherData ? weatherData.temperature : '--'}</span>
              )}
              <p className="text-emerald-400 text-sm font-bold uppercase tracking-[0.2em]">{weatherData ? weatherData.condition : "Fetching..."}</p>
              
              <select
                value={selectedWeatherDistrict}
                onChange={(e) => setSelectedWeatherDistrict(e.target.value)}
                className="w-full bg-white/10 text-slate-300 border border-white/20 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-emerald-400 outline-none"
              >
                {districts.map(d => (
                  <option key={d} value={d}>{d}, Jammu & Kashmir</option>
                ))}
              </select>
            </div>

            <Link to="/weather" className="block bg-white/10 hover:bg-white/20 p-4 rounded-2xl border border-white/5 transition-all group/link">
              <p className="text-xs text-slate-300 font-medium leading-relaxed italic mb-2 line-clamp-3">
                "{loadingWeather ? "Loading forecast..." : (weatherData ? weatherData.forecast : "Weather data unavailable.")}"
              </p>
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-emerald-400 tracking-widest">
                <span>See all 20 Districts</span>
                <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Advanced Features Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Zap className="w-6 h-6 text-emerald-600" /> Advanced Agri-Tools
          </h3>
          <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">AI Enhanced</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/soil" className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FlaskConical className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Soil Health Pro</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">Analyze soil type and get localized fertilizer NPK recommendations.</p>
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-emerald-700 tracking-widest">
              <span>Test Soil Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link to="/ca-storage" className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Warehouse className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">CA Storage Hub</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">Find cold storage availability and rates across Pulwama & Shopian.</p>
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-blue-700 tracking-widest">
              <span>Find Storage</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link to="/dealers" className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MapPin className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Verified Dealers</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">Locate registered pesticide and fertilizer stores in your area.</p>
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-amber-700 tracking-widest">
              <span>Locate Shops</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          <Link to="/grading" className="group bg-slate-900 p-6 rounded-[2.5rem] border border-white/5 shadow-xl hover:shadow-emerald-500/10 transition-all">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-emerald-500/20">
              <Award className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-white mb-2">Grading Guide</h4>
            <p className="text-xs text-emerald-100/50 font-medium leading-relaxed mb-4">Expert guide for sorting apples (Grade A/B/C) to get best prices.</p>
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-emerald-400 tracking-widest">
              <span>View Guide</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>
      </section>

      {/* Mandi & Experts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Navigation className="w-5 h-5 text-emerald-600" /> Mandi Locator
            </h3>
            <button onClick={fetchMandi} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <RefreshCw className={`w-4 h-4 text-slate-400 ${loadingMandi ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
             {loadingMandi ? (
               <div className="flex items-center gap-3 text-slate-400">
                 <Loader2 className="w-5 h-5 animate-spin" />
                 <span className="text-sm font-bold uppercase tracking-widest">Scanning nearby mandis...</span>
               </div>
             ) : mandiError ? (
               <p className="text-rose-600 text-sm font-medium">{mandiError}</p>
             ) : (
               <div className="space-y-4">
                 <p className="text-slate-700 font-medium leading-relaxed">{nearbyMandi || "Press refresh to find nearest market centers."}</p>
                 <Link to="/market" className="inline-flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-widest hover:underline">
                   View Price Hub <ArrowRight className="w-3.5 h-3.5" />
                 </Link>
               </div>
             )}
          </div>
        </div>

        <div className="bg-emerald-900 rounded-[3rem] p-8 text-white space-y-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Need Expert Help?</h3>
            <p className="text-emerald-100/70 text-sm font-medium leading-relaxed mb-6">
              Chat with Zahoor Ahmad, our AI-Specialist for Kashmiri orchards.
            </p>
            <Link to="/expert" className="w-full bg-white text-emerald-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-50 transition-all shadow-xl">
              <MessageSquare className="w-5 h-5" /> Start Consultation
            </Link>
          </div>
          <MessageSquare className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
