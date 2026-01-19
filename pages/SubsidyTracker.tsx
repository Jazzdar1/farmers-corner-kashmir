
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  ChevronRight, 
  Info, 
  ExternalLink, 
  Clock, 
  AlertCircle,
  Landmark,
  Target,
  Globe
} from 'lucide-react';

const schemes = [
  {
    title: "PM-Kisan J&K Installment",
    department: "Department of Agriculture",
    type: "Direct Income Support",
    amount: "₹6,000 / Year",
    status: "Open",
    deadline: "Dec 31, 2024",
    desc: "Provides financial assistance to small and marginal farmers across all 20 districts of J&K.",
    tags: ["Central", "Ongoing"]
  },
  {
    title: "High Density Apple Plantation",
    department: "Horticulture Department",
    type: "Capital Subsidy",
    amount: "50% of Project Cost",
    status: "Active",
    deadline: "Ongoing",
    desc: "Subsidy for purchasing plants and setting up trellis systems for high-density orchards.",
    tags: ["State", "Apple"]
  },
  {
    title: "SMAM Machinery Subsidy",
    department: "Agriculture Production Dept",
    type: "Equipment Subsidy",
    amount: "40-80% Subsidy",
    status: "Register Now",
    deadline: "Oct 20, 2024",
    desc: "Get subsidized tractors, sprayers, and power tillers under the Sub-Mission on Agri Mechanization.",
    tags: ["Machinery", "Grant"]
  },
  {
    title: "Saffron Park Processing Grant",
    department: "NHM (National Horticulture Mission)",
    type: "Processing Support",
    amount: "Varies",
    status: "Upcoming",
    deadline: "Nov 2024",
    desc: "Financial support for post-harvest drying and packaging equipment at Pampore Saffron Park.",
    tags: ["Saffron", "Pampore"]
  }
];

const SubsidyTracker: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSchemes = schemes.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900 mb-1">Subsidy & Grant Tracker</h2>
          <p className="text-slate-500 font-medium">Monitoring J&K Horticulture and Central Agri-Schemes live.</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 shadow-sm">
           <AlertCircle className="w-4 h-4 text-amber-600" />
           <span className="text-xs font-black text-amber-800 uppercase tracking-widest">3 Deadlines Approaching</span>
        </div>
      </header>

      <div className="relative group max-w-xl">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-emerald-600 transition-colors" />
        <input 
          type="text" 
          placeholder="Search for schemes or departments..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-14 pr-6 py-4.5 bg-white border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none shadow-sm transition-all font-medium text-slate-800"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all group flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <Landmark className="w-8 h-8" />
                </div>
                <div className="flex gap-2">
                  {scheme.tags.map(tag => (
                    <span key={tag} className="text-[8px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-1 rounded-md border border-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">{scheme.title}</h3>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{scheme.department}</p>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mt-4">{scheme.desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4">
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Amount / %</p>
                   <p className="text-base font-bold text-slate-900">{scheme.amount}</p>
                 </div>
                 <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                   <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Status</p>
                   <p className="text-base font-bold text-emerald-800">{scheme.status}</p>
                 </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 mt-6 flex items-center justify-between">
               <div className="flex items-center gap-2 text-slate-400">
                 <Clock className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Deadline: {scheme.deadline}</span>
               </div>
               <button className="flex items-center gap-2 bg-emerald-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
                 How to Apply <ExternalLink className="w-3.5 h-3.5" />
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Official Links Banner */}
      <div className="bg-slate-900 rounded-[3.5rem] p-10 lg:p-14 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
               <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/5">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-widest">Direct Portals</span>
               </div>
               <h3 className="text-3xl font-heading font-bold leading-tight">
                 Access Official <br/><span className="text-emerald-400">Agri-Gateways.</span>
               </h3>
               <p className="text-emerald-100/70 text-lg font-medium leading-relaxed max-w-lg">
                 Connect directly with Jan-Bhagidari and Horticulture portals for real-time application tracking.
               </p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
               {[
                 { label: "Jan-Bhagidari Portal", url: "#" },
                 { label: "JK Horticulture Online", url: "#" },
                 { label: "DBT Agriculture India", url: "#" },
                 { label: "Kisan Suvidha App", url: "#" }
               ].map((portal, i) => (
                 <a key={i} href={portal.url} className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-colors">
                    <span className="font-bold text-sm tracking-tight">{portal.label}</span>
                    <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                 </a>
               ))}
            </div>
         </div>
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default SubsidyTracker;
