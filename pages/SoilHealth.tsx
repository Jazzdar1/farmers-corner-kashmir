import React, { useState } from 'react';
import { 
  FlaskConical, 
  Search, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  Sparkles,
  Sprout,
  Droplets,
  Wind,
  Layers,
  Info
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const SoilHealth: React.FC = () => {
  const [soilType, setSoilType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeSoil = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a soil scientist for Kashmir. Analyze this soil description: "${description}". Soil type: ${soilType}. 
        Provide a detailed report in Markdown format including:
        1. Soil Classification (Localized names like Karewa, Nambal, etc.)
        2. Nutrient Analysis (Estimated NPK status)
        3. Localized Recommendations (Specific fertilizers and organic amendments available in JK)
        4. Suitable Crops for this soil.
        5. Drainage & Irrigation tips.
        Provide a concise summary in Urdu at the end.`,
      });
      setResult(response.text || "Unable to analyze at this time.");
    } catch (err) {
      setError("AI Analysis failed. Please check your connection or try again.");
    } finally {
      setLoading(false);
    }
  };

  const soilTypes = ["Karewa (Plateau)", "Loamy (Valley Floor)", "Nambal (Marshy)", "Sandy (River Bank)", "Hilly/Forest Soil"];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
      <header className="text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner text-emerald-600">
          <FlaskConical className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900">Soil Health Pro AI</h2>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">
            Advanced soil analysis and fertilizer management tailored for Jammu & Kashmir's unique geology.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Select Land Type</label>
              <div className="flex flex-col gap-2">
                {soilTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSoilType(type)}
                    className={`text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all border ${
                      soilType === type 
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-lg' 
                        : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-emerald-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 font-medium leading-relaxed">
                Soil health affects Apple color and Saffron quality directly. Be as descriptive as possible.
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Soil Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your soil color, texture, moisture level, and what was grown previously. e.g., 'Dark red soil, very dry, used for apples for 10 years...'"
                className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-6 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-800 h-48 resize-none"
              />
            </div>

            <button
              onClick={analyzeSoil}
              disabled={loading || !description.trim()}
              className="w-full bg-emerald-600 text-white py-5 rounded-[2rem] font-bold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Running AI Soil Analysis...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Analyze Soil Health
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] text-rose-700 flex items-center gap-3 animate-in slide-in-from-top-4">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-white p-8 lg:p-12 rounded-[3rem] border border-emerald-100 shadow-2xl animate-in zoom-in-95 duration-500 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-emerald-100/20">
                <FlaskConical className="w-32 h-32" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 leading-none">Soil Analysis Report</h3>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Grounded AI Analysis</p>
                  </div>
                </div>

                <div className="prose prose-emerald max-w-none">
                  <div className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap text-sm lg:text-base">
                    {result}
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                    <Sprout className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-600">Tailored Crop Suggestions</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-bold text-slate-600">Irrigation Guidance</span>
                  </div>
                </div>

                {/* Fixed typo: setResults changed to setResult */}
                <button 
                  onClick={() => { setResult(null); setDescription(''); }}
                  className="mt-8 w-full border-2 border-slate-100 py-4 rounded-2xl text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Start New Test
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoilHealth;