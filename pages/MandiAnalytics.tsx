import React, { useState } from 'react';
import { 
  LineChart as ChartIcon, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  AlertCircle, 
  ChevronRight,
  BarChart3,
  ArrowUpRight,
  Info,
  Zap
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

const data = [
  { month: 'Jul', price: 950, volume: 120 },
  { month: 'Aug', price: 1050, volume: 200 },
  { month: 'Sep', price: 1100, volume: 450 },
  { month: 'Oct', price: 1350, volume: 800 },
  { month: 'Nov', price: 1280, volume: 600 },
  { month: 'Dec', price: 1450, volume: 300 },
];

const MandiAnalytics: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('Apple');

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900 mb-1">Mandi Analytics Pro</h2>
          <p className="text-slate-500 font-medium">Data-driven market insights for the Kashmir Valley.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          {['Apple', 'Saffron', 'Walnut'].map(crop => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                selectedCrop === crop 
                  ? 'bg-emerald-900 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-emerald-700'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart Card */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <ChartIcon className="w-5 h-5 text-emerald-600" /> Price Trend Analysis
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium Grade</span>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fontWeight: 700, fill: '#64748b'}} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fontWeight: 700, fill: '#64748b'}}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                  itemStyle={{fontSize: '14px', fontWeight: 700}}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-50">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Highest Rate</p>
              <p className="text-2xl font-black text-slate-900">₹1,450</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lowest Rate</p>
              <p className="text-2xl font-black text-slate-900">₹950</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Growth Forecast</p>
              <p className="text-2xl font-black text-emerald-600 flex items-center gap-1">
                +12% <ArrowUpRight className="w-5 h-5" />
              </p>
            </div>
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-6 relative overflow-hidden">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Zap className="w-5 h-5 text-emerald-400" /> AI Market Advisory
            </h3>
            
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Best Time to Sell</span>
                </div>
                <p className="text-sm font-bold text-slate-200">Wait for December week 3</p>
                <p className="text-xs text-slate-400">Demand from South Indian markets is projected to peak before year-end festivities.</p>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Risk Alert</span>
                </div>
                <p className="text-sm font-bold text-slate-200">Inventory Surcharge</p>
                <p className="text-xs text-slate-400">CA Storage rates in Pulwama expected to rise by 5% next month.</p>
              </div>
            </div>

            <button className="w-full bg-emerald-600 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/40">
              Download Full Report <ChevronRight className="w-4 h-4" />
            </button>
            <BarChart3 className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 pointer-events-none" />
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" /> Data Sources
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Averaged from Sopore Mandi, Parimpora, and Delhi Azadpur terminal data. Updated daily at 4:00 PM IST.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-blue-700 uppercase tracking-widest cursor-pointer hover:underline">
              Verify Official Mandi Records <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MandiAnalytics;