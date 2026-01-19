
import React from 'react';
import { Award, CheckCircle2, Star, Info, ChevronRight, Apple, ArrowRight, FlaskConical, Landmark, Store, ExternalLink } from 'lucide-react';

const gradingSteps = [
  {
    grade: "Grade A (Premium)",
    color: "emerald",
    desc: "Export quality. Perfectly round, uniform red color (>80%), no skin blemishes.",
    imageUrl: "https://images.unsplash.com/photo-1579613832125-5d3455fe7924?q=80&w=800",
    fullDescription: "These apples represent the pinnacle of quality, suitable for international markets and high-end local consumption. They boast a vibrant, unblemished skin and perfect symmetry, reflecting meticulous cultivation and handling.",
    specs: [
      "Size: 75mm - 85mm diameter", 
      "Texture: Firm and Crisp flesh", 
      "Skin: Smooth, Shiny, and Uniformly colored (>80% red blush)",
      "Shape: Perfectly round to conical, symmetrical",
      "Defects: Absolutely no visible blemishes, cuts, or bruises"
    ],
    market: "International / Tier-1 Cities",
    icon: <Star className="w-8 h-8 text-emerald-500" />
  },
  {
    grade: "Grade B (Select)",
    color: "blue",
    desc: "High quality for local retail. Minor skin color variations, very slight marks allowed.",
    imageUrl: "https://images.unsplash.com/photo-1521949392261-2d7c54179e7e?q=80&w=800",
    fullDescription: "Ideal for general domestic consumption and regional markets. These apples maintain good quality but may exhibit slight imperfections in color distribution or minor surface marks that do not affect the internal quality.",
    specs: [
      "Size: 65mm - 75mm diameter", 
      "Texture: Firm flesh", 
      "Skin: Mostly red (min. 60% blush), minor variations acceptable",
      "Shape: Good, slight irregularities permitted",
      "Defects: Small, superficial blemishes or healed marks (max 5% surface area)"
    ],
    market: "Delhi / Regional Mandis",
    icon: <Apple className="w-8 h-8 text-blue-500" />
  },
  {
    grade: "Grade C (General)",
    color: "amber",
    desc: "Processing or local juice market. Irregular shapes, small size, or minor hail damage.",
    imageUrl: "https://images.unsplash.com/photo-1614949537985-e11559869680?q=80&w=800",
    fullDescription: "Primarily suited for industrial processing into juice, cider, or dried products. These apples may have more pronounced cosmetic flaws, varying sizes, and irregular shapes, but are still fit for consumption after processing.",
    specs: [
      "Size: <65mm diameter", 
      "Texture: Soft to Medium firm", 
      "Skin: Mixed color, may have slight discoloration",
      "Shape: Irregular shapes allowed",
      "Defects: Significant cosmetic flaws, hail damage, or small bruises (max 15% surface area)"
    ],
    market: "Juice Plants / Local Sale",
    icon: <Info className="w-8 h-8 text-amber-500" />
  }
];

const agriPartners = [
  {
    name: "SKUAST-K",
    description: "Agricultural University for research & extension.",
    icon: FlaskConical,
    color: "emerald",
    link: "#"
  },
  {
    name: "J&K Horticulture Dept",
    description: "Government body for horticulture development.",
    icon: Landmark,
    color: "blue",
    link: "#"
  },
  {
    name: "Mandi Board J&K",
    description: "Regulates agricultural markets and prices.",
    icon: Store,
    color: "amber",
    link: "#"
  }
];

const GradingGuide: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 no-scrollbar">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900">Apple Grading Guide</h2>
          <p className="text-slate-500 font-medium">Follow international standards to maximize your profit per box.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 shadow-sm">
           <Award className="w-4 h-4 text-emerald-600" />
           <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Global Standards</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {gradingSteps.map((step, idx) => (
          <div key={idx} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between overflow-hidden">
            <div className="space-y-6">
              {/* Image for the grade */}
              {step.imageUrl && (
                <div className="w-full h-48 -mx-10 -mt-10 mb-6 relative overflow-hidden rounded-t-[3rem] shadow-xl border-b border-slate-50">
                  <img src={step.imageUrl} alt={`${step.grade} example`} className="w-full h-full object-cover" />
                  <div className={`absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-${step.color}-900/60 to-transparent`} />
                  <div className="absolute bottom-4 left-4 p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 text-white font-bold text-xs uppercase tracking-widest">
                    Visual Reference
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className={`text-2xl font-bold text-${step.color}-900`}>{step.grade}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  {step.desc}
                </p>
                <p className="text-slate-700 text-base leading-relaxed mt-4">
                  {step.fullDescription}
                </p>
              </div>

              <div className="space-y-3 pt-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className={`w-4 h-4 text-${step.color}-500`} /> Key Criteria
                </h4>
                <ul className="space-y-2">
                  {step.specs.map((spec, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                      <CheckCircle2 className={`w-4 h-4 text-${step.color}-500 mt-1 shrink-0`} />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={`mt-10 p-5 rounded-2xl bg-${step.color}-900 text-white flex justify-between items-center shadow-lg shadow-${step.color}-900/20`}>
              <div>
                <p className="text-[8px] font-black uppercase opacity-60">Primary Market</p>
                <p className="text-xs font-bold">{step.market}</p>
              </div>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[3.5rem] p-10 lg:p-14 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
               <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                  <Star className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Expert Tip</span>
               </div>
               <h3 className="text-3xl lg:text-5xl font-heading font-bold leading-tight">
                 Proper Grading is <br/><span className="text-emerald-400">50% of the Sale.</span>
               </h3>
               <p className="text-emerald-100/70 text-lg font-medium leading-relaxed max-w-lg">
                 Mandis like Sopore and Azadpur penalize mixed boxes. Sorting your apples correctly can increase your profit by up to ₹300 per box.
               </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] space-y-4 backdrop-blur-md">
               <h4 className="font-bold text-xl">Pre-Harvest Checklist</h4>
               <ul className="space-y-4">
                 {[
                   "Color development: Check for uniform blush.",
                   "Seed color: Brown seeds indicate maturity.",
                   "Starch test: Check for sweetness conversion.",
                   "Handling: Use padded crates to avoid bruising."
                 ].map((tip, i) => (
                   <li key={i} className="flex items-start gap-3 text-sm font-medium text-emerald-100">
                     <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 shrink-0" />
                     {tip}
                   </li>
                 ))}
               </ul>
            </div>
         </div>
         <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* New: Key Agri-Partners Section */}
      <div className="bg-emerald-50 p-10 lg:p-14 rounded-[3.5rem] border border-emerald-100 shadow-2xl mt-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="space-y-2">
            <h3 className="text-3xl font-heading font-bold text-slate-900">Key Agri-Partners</h3>
            <p className="text-slate-500 font-medium max-w-lg">Collaborating for quality and market access in J&K.</p>
          </div>
          <a href="#" className="flex items-center gap-2 text-emerald-700 font-bold uppercase text-sm tracking-widest hover:underline">
            View All Partners <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agriPartners.map((partner, idx) => {
            const Icon = partner.icon;
            return (
              <a 
                key={idx} 
                href={partner.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all group flex flex-col items-start gap-5"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${
                  partner.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  partner.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">{partner.name}</h4>
                  <p className="text-sm text-slate-500 font-medium mt-1">{partner.description}</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-700 mt-auto pt-4 border-t border-slate-50 w-full">
                  Visit Website <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GradingGuide;
