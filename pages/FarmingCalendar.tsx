
import React, { useState } from 'react';
import { CalendarDays, ChevronRight, Apple, Sprout, Droplets, Scissors, Info, Sparkles, Wind, Snowflake, Sun } from 'lucide-react';

const months = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const calendarData: Record<string, any[]> = {
  "January": [
    { crop: "Apple", activity: "Pruning", icon: Scissors, color: "blue", details: "Major pruning phase for structure and fruit-wood quality." },
    { crop: "General", activity: "Vandh Maintenance", icon: Snowflake, details: "Maintain drainage channels to avoid water-logging during snow melt." }
  ],
  "February": [
    { crop: "Apple", activity: "Dormant Spray", icon: Droplets, color: "rose", details: "Apply Servo Oil/Horticulture Mineral Oil for San Jose Scale control." },
    { crop: "Walnut", activity: "Pruning", icon: Scissors, details: "Start pruning older walnut trees before sap flow starts." }
  ],
  "March": [
    { crop: "Almond", activity: "Bloom (Badam Wari)", icon: Sparkles, color: "emerald", details: "Monitor for early frost damage during full bloom." },
    { crop: "Vegetables", activity: "Seed Sowing", icon: Sprout, details: "Nursery preparation for Kohlrabi (Haakh) and Collard Greens." }
  ],
  "April": [
    { crop: "Apple", activity: "Pink Bud Phase", icon: Sun, color: "amber", details: "Critical time for Apple Scab prevention sprays." },
    { crop: "Cherry", activity: "Full Bloom", icon: Sparkles, details: "Pollination management - ensure bee activity in orchards." }
  ],
  "May": [
    { crop: "Apple", activity: "Nut-Size Stage", icon: Droplets, details: "Fertilizer application (Urea/MOP) based on soil test results." },
    { crop: "General", activity: "Weeding", icon: Sprout, details: "Aggressive weeding to prevent nutrient competition." }
  ],
  "June": [
    { crop: "Cherry", activity: "Harvesting", icon: Apple, color: "rose", details: "Peak harvesting season for Mishri and Double varieties." },
    { crop: "Apple", activity: "Thinning", icon: Scissors, details: "Manual thinning to improve fruit size and avoid alternate bearing." }
  ],
  "July": [
    { crop: "Apple", activity: "Summer Pruning", icon: Scissors, details: "Light pruning to allow sunlight into the center of the canopy." },
    { crop: "Rice", activity: "Weeding", icon: Sprout, details: "Second phase of manual weeding in paddy fields." }
  ],
  "August": [
    { crop: "Saffron", activity: "Corm Planting", icon: Sprout, color: "emerald", details: "Planting of healthy Saffron corms in well-drained loamy soil." },
    { crop: "Walnut", activity: "Harvesting", icon: Apple, details: "Early walnut varieties start maturing. Check for shell hardening." }
  ],
  "September": [
    { crop: "Apple", activity: "Harvesting (Early)", icon: Apple, color: "rose", details: "Harvesting of Gala and Delicious varieties starts in lower belts." },
    { crop: "Saffron", activity: "First Weeding", icon: Sprout, details: "Mandatory weeding for upcoming flower emergence." }
  ],
  "October": [
    { crop: "Saffron", activity: "Harvest Jashn", icon: Sparkles, color: "amber", details: "Peak flower picking season in Pampore and Khrew belts." },
    { crop: "Apple", activity: "Storage", icon: Snowflake, details: "Sorting and Grading for CA Storage or shipment to outside Mandis." }
  ],
  "November": [
    { crop: "Apple", activity: "Leaf Fall Spray", icon: Droplets, details: "Urea spray (5%) to speed up leaf decomposition and reduce Scab inoculum." },
    { crop: "General", activity: "Sanitation", icon: Wind, details: "Cleaning of orchards - burning or burying diseased leaves." }
  ],
  "December": [
    { crop: "General", activity: "Soil Preparation", icon: Sprout, details: "Deep trenching and application of FYM (Farm Yard Manure)." },
    { crop: "General", activity: "Vandh Protection", icon: Snowflake, color: "blue", details: "Whitewashing tree trunks to prevent sun-scald and pest entry." }
  ]
};

const FarmingCalendar: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20 no-scrollbar">
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900 mb-2">Agri-Calendar Kashmir</h2>
            <p className="text-slate-500 font-medium">Seasonal guidance for the temperate orchards of the valley.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl shadow-xl">
             <CalendarDays className="w-5 h-5 text-emerald-400" />
             <span className="text-sm font-bold uppercase tracking-widest">{selectedMonth} 2024-25</span>
          </div>
        </div>

        {/* Month Selector - Attractive Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
          {months.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`px-8 py-4 rounded-[2rem] font-bold text-sm whitespace-nowrap transition-all flex flex-col items-center gap-1 border ${
                selectedMonth === m 
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-xl shadow-emerald-200 scale-105' 
                  : 'bg-white text-slate-400 border-slate-100 hover:border-emerald-200 hover:text-emerald-700'
              }`}
            >
              <span className="text-[10px] uppercase tracking-tighter opacity-50">{m === months[new Date().getMonth()] ? 'Current' : 'Month'}</span>
              {m}
            </button>
          ))}
        </div>
      </header>

      {/* Grid of Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calendarData[selectedMonth].map((activity, idx) => {
          const Icon = activity.icon;
          return (
            <div 
              key={idx} 
              className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all group relative overflow-hidden flex flex-col h-full"
            >
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner transition-colors ${
                  activity.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  activity.color === 'rose' ? 'bg-rose-50 text-rose-600' :
                  activity.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  activity.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  'bg-slate-50 text-slate-600'
                }`}>
                  <Icon className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">{activity.crop}</span>
                  <h4 className="text-2xl font-bold text-slate-900 leading-tight">{activity.activity}</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mt-4">
                    {activity.details}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest relative z-10">
                <span className="flex items-center gap-1"><Info className="w-3.5 h-3.5" /> SKUAST Advisory</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Decorative Background Icon */}
              <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Icon className="w-48 h-48" />
              </div>
            </div>
          );
        })}
      </div>

      {/* seasonal overview banner */}
      <div className="bg-emerald-900 rounded-[3.5rem] p-10 lg:p-14 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 text-center lg:text-left">
               <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/5">
                  <Wind className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-widest">Seasonal Wisdom</span>
               </div>
               <h3 className="text-3xl lg:text-5xl font-heading font-bold leading-tight">
                 Maximize Your Yield with <br/><span className="text-emerald-400">Precision Timing.</span>
               </h3>
               <p className="text-emerald-100/70 text-lg font-medium leading-relaxed max-w-lg">
                 Agriculture in Kashmir is a race against the weather. Following the scientific calendar ensures higher quality and disease-free harvests.
               </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: "Vandh", desc: "Winter Prep", icon: Snowflake },
                 { label: "Sonth", desc: "Spring Bloom", icon: Sprout },
                 { label: "Wahrat", desc: "Summer Rain", icon: Droplets },
                 { label: "Harud", desc: "Autumn Harvest", icon: Sun }
               ].map((season, i) => (
                 <div key={i} className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 text-center group hover:bg-white/10 transition-colors">
                    <season.icon className="w-8 h-8 mx-auto mb-3 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <h5 className="font-bold text-lg">{season.label}</h5>
                    <p className="text-[10px] uppercase font-black tracking-widest text-emerald-500/60">{season.desc}</p>
                 </div>
               ))}
            </div>
         </div>
         
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default FarmingCalendar;
