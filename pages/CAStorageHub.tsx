
import React, { useState } from 'react';
import { Warehouse, MapPin, Phone, Snowflake, TrendingUp, Info, ChevronRight, Activity, Globe } from 'lucide-react';

const caStorages = [
  { name: 'Lassipora Cold Storage', location: 'Pulwama', capacity: '10,000 MT', status: 'Available', phone: '01933-222000', icon: '❄️' },
  { name: 'Sopore CA Hub', location: 'Baramulla', capacity: '5,000 MT', status: 'Limited', phone: '01954-222111', icon: '🍎' },
  { name: 'Ahmad Cold Store', location: 'Shopian', capacity: '2,500 MT', status: 'Full', phone: '9419012345', icon: '🏢' },
  { name: 'IGC Lassipora-2', location: 'Pulwama', capacity: '15,000 MT', status: 'Available', phone: '9018123456', icon: '🏭' },
  { name: 'Kashmir Fruit Storage', location: 'Rangreth, Srinagar', capacity: '4,000 MT', status: 'Available', phone: '0194-230000', icon: '📦' },
];

const CAStorageHub: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 no-scrollbar">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900">CA Storage Hub</h2>
          <p className="text-slate-500 font-medium">Track availability and book cold storage capacity for your apple harvest.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 shadow-sm">
           <Snowflake className="w-4 h-4 text-blue-600 animate-spin-slow" />
           <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Live Inventory</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caStorages.map((store, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-slate-50 text-2xl flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                    {store.icon}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                    store.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 
                    store.status === 'Limited' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {store.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">{store.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                    <MapPin className="w-4 h-4" />
                    {store.location}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Capacity</p>
                    <p className="text-lg font-bold text-slate-900">{store.capacity}</p>
                  </div>
                  <a href={`tel:${store.phone}`} className="p-4 bg-blue-900 text-white rounded-2xl shadow-lg hover:bg-black transition-colors">
                    <Phone className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[3rem] p-8 text-white space-y-6 relative overflow-hidden shadow-2xl">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> Market Intelligence
            </h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              CA stored apples typically fetch 40-60% higher prices in February-April compared to harvest season.
            </p>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">Current Trend</span>
              </div>
              <p className="text-xs font-medium text-slate-200">
                Storage rates in Lassipora are stable at ₹0.80 - ₹1.20 per kg/month.
              </p>
            </div>
            <button className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
              Calculate Storage ROI <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-blue-50 p-8 rounded-[3rem] border border-blue-100 shadow-sm space-y-4">
             <div className="flex items-center gap-3">
               <Info className="w-6 h-6 text-blue-600" />
               <h4 className="font-bold text-blue-900">Important Tip</h4>
             </div>
             <p className="text-xs text-blue-800 leading-relaxed font-medium">
               Ensure your fruit is pre-cooled within 24 hours of harvest to maximize CA life. Only store Grade-A fruit for long-term storage.
             </p>
             <button className="text-blue-900 font-black uppercase text-[10px] tracking-widest hover:underline flex items-center gap-1">
               Read Full CA Guide <Globe className="w-3.5 h-3.5" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CAStorageHub;
