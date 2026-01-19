
import React, { useState } from 'react';
import { MapPin, Navigation2, Loader2, AlertCircle, X, ExternalLink, Map as MapIcon, ShieldCheck, Search, Globe, Info } from 'lucide-react';
import { findNearbyDealers } from '../services/gemini';

const DealerLocator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ text: string; sources?: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLocate = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await findNearbyDealers(position.coords.latitude, position.coords.longitude);
          setResults(res);
        } catch (err) {
          setError("Failed to locate dealers.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Location access denied.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner text-emerald-600">
          <MapPin className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900">Verified Dealer Locator</h2>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">
            Find certified pesticide and fertilizer stores across Jammu & Kashmir to ensure genuine inputs.
          </p>
        </div>
      </header>

      <div className="flex justify-center">
        <button 
          onClick={handleLocate}
          disabled={loading}
          className="bg-emerald-800 text-white px-10 py-5 rounded-[2.5rem] font-bold text-xl flex items-center gap-3 shadow-2xl hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Navigation2 className="w-6 h-6" />}
          Locate Dealers Near Me
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] text-rose-700 flex items-center gap-3 animate-in slide-in-from-top-4">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {results && (
        <div className="bg-white p-8 lg:p-12 rounded-[3.5rem] border-2 border-emerald-100 shadow-2xl animate-in zoom-in-95 duration-500 space-y-8 relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
             <div className="flex items-center gap-3">
               <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg">
                 <ShieldCheck className="w-6 h-6" />
               </div>
               <div>
                 <h3 className="text-2xl font-bold text-slate-900">Nearby Certified Stores</h3>
                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Grounded Satellite Search</p>
               </div>
             </div>
             <button onClick={() => setResults(null)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
               <X className="w-5 h-5 text-slate-400" />
             </button>
          </div>
          
          <div className="prose prose-emerald max-w-none relative z-10">
             <div className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap text-base">
               {results.text}
             </div>
          </div>

          {results.sources && results.sources.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
               {results.sources.map((source: any, i: number) => (
                 <a 
                   key={i} 
                   href={source.maps?.uri || source.web?.uri} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center justify-between bg-slate-50 border border-slate-100 p-5 rounded-2xl group hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                 >
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-white rounded-lg group-hover:bg-emerald-100 transition-colors">
                       <MapIcon className="w-4 h-4 text-emerald-600" />
                     </div>
                     <span className="text-sm font-bold text-slate-700">{source.maps?.title || source.web?.title || 'View Location'}</span>
                   </div>
                   <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                 </a>
               ))}
            </div>
          )}
          
          <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex items-start gap-4">
             {/* Fix: Added missing Info icon import from lucide-react */}
             <Info className="w-6 h-6 text-amber-600 shrink-0" />
             <p className="text-xs text-amber-900 font-medium leading-relaxed">
               Verified dealers are registered with the J&K Department of Agriculture. Always ask for a formal GST invoice to ensure product quality and guarantee.
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerLocator;
