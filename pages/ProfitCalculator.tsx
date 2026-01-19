
import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Coins, 
  Landmark, 
  ArrowRight, 
  RefreshCw, 
  Info,
  DollarSign,
  PieChart,
  Target
} from 'lucide-react';

const ProfitCalculator: React.FC = () => {
  const [landSize, setLandSize] = useState<number>(10); // in Kanals
  const [cropType, setCropType] = useState('Apple');
  const [expectedPrice, setExpectedPrice] = useState<number>(1200);
  const [yieldPerKanal, setYieldPerKanal] = useState<number>(40); // in Boxes
  
  const [results, setResults] = useState<{
    revenue: number;
    costs: number;
    netProfit: number;
    roi: number;
  } | null>(null);

  const calculate = () => {
    const revenue = landSize * yieldPerKanal * expectedPrice;
    
    // Estimated local costs per box (Packaging, Labor, Pesticides, Transport)
    const costFactors: Record<string, number> = {
      'Apple': 450,
      'Saffron': 120, // per g
      'Walnut': 300, // per kg
      'Cherry': 150 // per box
    };

    const costPerUnit = costFactors[cropType] || 200;
    const totalCosts = landSize * yieldPerKanal * costPerUnit;
    const netProfit = revenue - totalCosts;
    const roi = (netProfit / totalCosts) * 100;

    setResults({
      revenue,
      costs: totalCosts,
      netProfit,
      roi
    });
  };

  useEffect(() => {
    calculate();
  }, [landSize, cropType, expectedPrice, yieldPerKanal]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
      <header className="text-center space-y-4">
        <div className="w-20 h-20 bg-blue-100 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner text-blue-600">
          <Calculator className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900">Profit Estimator Pro</h2>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">
            Plan your harvest finances. Estimate revenue based on local J&K Mandi rates.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Input Controls */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Crop Type</label>
              <select 
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold"
              >
                <option>Apple</option>
                <option>Saffron</option>
                <option>Walnut</option>
                <option>Cherry</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Land Size (Kanals)</label>
              <input 
                type="number" 
                value={landSize}
                onChange={(e) => setLandSize(Number(e.target.value))}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Expected Price (per unit)</label>
              <input 
                type="number" 
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(Number(e.target.value))}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Expected Yield (per Kanal)</label>
              <input 
                type="number" 
                value={yieldPerKanal}
                onChange={(e) => setYieldPerKanal(Number(e.target.value))}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900 font-medium leading-relaxed">
              Estimates include standard costs for packaging, labor, and transport based on Sopore Mandi data.
            </p>
          </div>
        </div>

        {/* Results View */}
        {results && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="bg-slate-900 rounded-[3rem] p-8 text-white space-y-8 relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-400" /> Revenue Forecast
                </h3>
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">2024-25 Season</span>
              </div>

              <div className="grid grid-cols-1 gap-6 relative z-10">
                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem]">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Estimated Revenue</p>
                  <p className="text-4xl font-black text-white">₹{results.revenue.toLocaleString()}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem]">
                    <p className="text-[10px] font-bold text-rose-400 uppercase mb-1">Total Costs</p>
                    <p className="text-xl font-black text-white">₹{results.costs.toLocaleString()}</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2rem]">
                    <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Net Profit</p>
                    <p className="text-xl font-black text-emerald-400">₹{results.netProfit.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-[2rem] flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Return on Investment</p>
                    <p className="text-2xl font-black text-white">{results.roi.toFixed(1)}%</p>
                  </div>
                  <Target className="w-10 h-10 text-blue-400 opacity-20" />
                </div>
              </div>

              <PieChart className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 pointer-events-none" />
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900">Breakdown of Costs</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Packaging & Grading', val: '₹120/box' },
                  { label: 'Pesticides & Spray', val: '₹80/box' },
                  { label: 'Labor (Picking/Sorting)', val: '₹100/box' },
                  { label: 'Mandi Commission & Transport', val: '₹150/box' }
                ].map((item, i) => (
                  <li key={i} className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">{item.label}</span>
                    <span className="font-bold text-slate-900">{item.val}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="w-full bg-slate-50 text-slate-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-slate-100 flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Reset Calculator
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfitCalculator;
