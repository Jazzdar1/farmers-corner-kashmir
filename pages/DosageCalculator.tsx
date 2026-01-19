import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  FlaskConical, 
  Info, 
  RefreshCw, 
  AlertCircle,
  Bug,
  ChevronRight,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';

const chemicalTemplates = [
  { id: 'scab', name: 'Apple Scab Control', chem: 'Difenoconazole', ratio: 0.3, unit: 'ml/L' },
  { id: 'mites', name: 'Spider Mite Control', chem: 'Abamectin', ratio: 0.5, unit: 'ml/L' },
  { id: 'oil', name: 'Dormant Spray (TSO)', chem: 'HMO Oil', ratio: 20, unit: 'ml/L' },
  { id: 'npk', name: 'Foliar Fertilizer', chem: 'NPK 19:19:19', ratio: 5, unit: 'g/L' },
];

const DosageCalculator: React.FC = () => {
  const [tankSize, setTankSize] = useState<number>(200); // in Liters
  const [selectedChem, setSelectedChem] = useState(chemicalTemplates[0]);
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    setResult(tankSize * selectedChem.ratio);
  }, [tankSize, selectedChem]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
      <header className="text-center space-y-4">
        <div className="w-20 h-20 bg-blue-100 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner text-blue-600">
          <Droplets className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900">Dosage Pro Calculator</h2>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">
            Precision mixing for Kashmiri orchards. Avoid chemical waste and ensure spray effectiveness.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Input Controls */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Spray Target</label>
              <div className="grid grid-cols-1 gap-2">
                {chemicalTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedChem(template)}
                    className={`text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all border ${
                      selectedChem.id === template.id 
                        ? 'bg-blue-900 text-white border-blue-900 shadow-lg' 
                        : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{template.name}</span>
                      <span className="text-[10px] opacity-60">{template.ratio} {template.unit}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Tank Capacity (Liters)</label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[100, 200, 1000].map(size => (
                  <button
                    key={size}
                    onClick={() => setTankSize(size)}
                    className={`py-3 rounded-xl font-bold text-xs transition-all ${
                      tankSize === size ? 'bg-blue-100 text-blue-700 border-2 border-blue-500' : 'bg-slate-50 text-slate-500 border border-slate-100'
                    }`}
                  >
                    {size}L
                  </button>
                ))}
              </div>
              <input 
                type="number" 
                value={tankSize}
                onChange={(e) => setTankSize(Number(e.target.value))}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold"
                placeholder="Custom Tank Size..."
              />
            </div>
          </div>

          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 font-medium leading-relaxed">
              Always use PPE and consult the chemical bottle label. This tool provides general guidance based on SKUAST protocols.
            </p>
          </div>
        </div>

        {/* Results View */}
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="bg-blue-900 rounded-[3rem] p-8 text-white space-y-8 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-400" /> Mixing Formula
              </h3>
              <Zap className="w-5 h-5 text-amber-400 fill-current" />
            </div>

            <div className="space-y-6 relative z-10">
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] text-center">
                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2">Required Quantity of {selectedChem.chem}</p>
                <p className="text-5xl font-black text-white">
                  {result < 1000 ? `${result}` : `${(result/1000).toFixed(2)}`}
                  <span className="text-xl ml-2 font-bold uppercase tracking-widest text-blue-400">
                    {result < 1000 ? selectedChem.unit.split('/')[0] : selectedChem.unit === 'ml/L' ? 'Liters' : 'Kg'}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Water Amount</p>
                  <p className="text-xl font-black text-white">{tankSize} Liters</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Concentration</p>
                  <p className="text-xl font-black text-white">{selectedChem.ratio} {selectedChem.unit}</p>
                </div>
              </div>
            </div>

            <FlaskConical className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 pointer-events-none" />
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Safety Checklist
            </h4>
            <ul className="space-y-3">
              {[
                'Wear protective goggles and gloves.',
                'Do not spray against the wind direction.',
                'Avoid spraying during peak sun hours (Noon).',
                'Keep children and animals away from the spray zone.'
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-xs font-medium text-slate-600 items-start">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => { setTankSize(200); setSelectedChem(chemicalTemplates[0]); }}
            className="w-full bg-slate-50 text-slate-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-slate-100 flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Calculator
          </button>
        </div>
      </div>
    </div>
  );
};

export default DosageCalculator;