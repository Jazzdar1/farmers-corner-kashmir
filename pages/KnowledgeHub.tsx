
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Book, 
  Sprout, 
  ShieldAlert, 
  ChevronRight, 
  Globe, 
  Calculator, 
  Leaf, 
  Landmark, 
  Info, 
  CalendarDays, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Microscope,
  AlertCircle,
  FlaskConical,
  Stethoscope,
  BookOpen,
  Image as LucideImage
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

const categories = [
  { id: 'all', label: 'All Resources', icon: Globe, color: 'emerald' },
  { id: 'varieties', label: 'Crops', icon: Sprout, color: 'emerald' },
  { id: 'pests', label: 'Diseases', icon: ShieldAlert, color: 'rose' },
  { id: 'schemes', label: 'Finance', icon: Landmark, color: 'blue' },
  { id: 'guides', label: 'Guides', icon: Book, color: 'amber' },
  { id: 'tools', label: 'Smart Tools', icon: Calculator, color: 'slate' }
];

const varieties = [
  { category: 'varieties', title: 'Kashmiri Delicious Apple', desc: 'The valley standard. Known for intense aroma and red stripes.', tags: ['Premium', 'Export'], status: 'Active' },
  { category: 'varieties', title: 'Pampore Mongra Saffron', desc: 'Superior Grade A1. Highest crocin content worldwide.', tags: ['G-I Tag', 'Rare'], status: 'Harvesting' },
  { category: 'varieties', title: 'Paper Shell Walnut (Kagzi)', desc: 'Thin shell, high oil content favorite from South Kashmir.', tags: ['Nut', 'Export'], status: 'Stable' },
  { category: 'varieties', title: 'American Mother Apple', desc: 'Hardy variety, durable during mountain transit.', tags: ['Durable', 'Regional'], status: 'Active' },
  { category: 'varieties', title: 'Mishri Heart Cherry', desc: 'Sweet heart-shaped cherries. Harvested in early summer.', tags: ['Delicate', 'Summer'], status: 'Seasonal' },
  { category: 'varieties', title: 'Kashmiri Gurbandi Almonds', desc: 'Rich in oils, grown in Pulwama and Budgam.', tags: ['Nut', 'Oily'], status: 'Stable' },
  { category: 'varieties', title: 'Ambri Apple (Legacy)', desc: 'Heritage variety, uniquely aromatic and long-storing.', tags: ['Heritage', 'Local'], status: 'Limited' },
  { category: 'varieties', title: 'Conference Pear', desc: 'High yielding, adapted to high altitude. Good for jams.', tags: ['Hardy', 'Process'], status: 'Stable' },
];

const pests = [
  { 
    category: 'pests', 
    title: 'Apple Scab', 
    desc: 'Major threat in humid weather. Affects leaves and fruit quality.', 
    tags: ['Fungal', 'Critical'], 
    status: 'Alert',
    symptoms: 'Olive-green to brown spots on leaves and fruit. Velvety lesions that turn dark brown or black.',
    causes: 'Venturia inaequalis fungus. High humidity and rainy spring weather promote spore release.',
    prevention: 'Proper pruning for aeration. Sanitation by removing or burying fallen leaves in autumn.',
    treatment: 'Dormant Oil spray. Foliar fungicides like Captan (200g/100L), Mancozeb (300g/100L), or Difenoconazole (30ml/100L) as per SKUAST-K calendar.',
    symptomImages: [
      { url: 'https://images.unsplash.com/photo-1596701062351-be5f6a45546b?q=80&w=800', caption: 'Dark velvety lesions on fruit' },
      { url: 'https://images.unsplash.com/photo-1594968973184-9140fa307f79?q=80&w=800', caption: 'Fungal spots on leaf surface' }
    ],
    expertContact: 'Towseef Ahmad'
  },
  { 
    category: 'pests', 
    title: 'San Jose Scale', 
    desc: 'Sucking insect causing red spots and tree weakness.', 
    tags: ['Pest', 'Insects'], 
    status: 'Persistent',
    symptoms: 'Small, circular, gray scales on bark. Bright red spots on fruit skin. Yellowing and premature leaf fall.',
    causes: 'Quadraspidiotus perniciosus insect. Overcrowded orchards and lack of dormant oil treatments.',
    prevention: 'Thorough cleaning of tree trunks. Monitoring during summer crawler phase using sticky traps.',
    treatment: 'Horticulture Mineral Oil (HMO) at 2% during dormant stage. Chlorpyrifos (200ml/100L) or Dimethoate (100ml/100L) in summer.',
    symptomImages: [
      { url: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?q=80&w=800', caption: 'Red halos around scale on fruit' },
      { url: 'https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?q=80&w=800', caption: 'Scaly infestation on tree bark' }
    ]
  },
  { 
    category: 'pests', 
    title: 'Saffron Corm Rot', 
    desc: 'Fungal infection of saffron bulbs due to water logging.', 
    tags: ['Saffron', 'Soil'], 
    status: 'Severe',
    symptoms: 'Yellowing of leaves. Soft, brown patches on corms (bulbs). Poor flower emergence.',
    causes: 'Fusarium species fungus. Poor soil drainage and using infected seed corms.',
    prevention: 'Raised bed cultivation. Seed treatment (soaking) before planting. 5-year crop rotation.',
    treatment: 'Drenching with Carbendazim (0.1% or 100g/100L) or Mancozeb. Improving field drainage is critical.'
  },
  { 
    category: 'pests', 
    title: 'Woolly Apple Aphid', 
    desc: 'Cottony masses on branches. Damages roots and twigs.', 
    tags: ['Pest', 'Insects'], 
    status: 'Common',
    symptoms: 'White, waxy, cotton-like masses on twigs. Galls or swellings on roots and branches.',
    causes: 'Eriosoma lanigerum insect. Favorable temperate climate conditions and lack of biological predators.',
    prevention: 'Using resistant rootstocks (MM-111, MM-106). Encouraging natural predators like Aphelinus mali.',
    treatment: 'Soil drenching with Imidacloprid (100ml/100L). Foliar spray of Dimethoate or Malathion.'
  },
  { 
    category: 'pests', 
    title: 'Alternaria Leaf Blotch', 
    desc: 'Fungal leaf spotting primarily in Delicious varieties.', 
    tags: ['Fungal', 'Leaf'], 
    status: 'Frequent',
    symptoms: 'Small, circular, brown spots on leaves. Premature defoliation in severe cases.',
    causes: 'Alternaria mali fungus. High humidity and moderate temperatures during late summer.',
    prevention: 'Maintaining tree vigor. Proper sanitation and pruning.',
    treatment: 'Mancozeb (300g/100L) or Ziram sprays during the secondary growth stage.'
  }
];

// Added missing content for Knowledge Hub to fix compilation errors
const schemes = [
  { category: 'schemes', title: 'PM-Kisan J&K Installment', desc: 'Direct income support for small and marginal farmers.', tags: ['Financial', 'Income'], status: 'Active' },
  { category: 'schemes', title: 'High Density Plantation Subsidy', desc: '50% subsidy for project costs on high-density orchards.', tags: ['State', 'Subsidy'], status: 'Open' }
];

const guides = [
  { category: 'guides', title: 'Official Spray Calendar', desc: 'SKUAST-K 2024-25 horticultural spray schedule.', tags: ['Manual', 'Calendar'], status: 'Current' },
  { category: 'guides', title: 'Cold Storage (CA) Manual', desc: 'Guide to pre-cooling and long-term storage of apples.', tags: ['Storage', 'Guide'], status: 'Active' }
];

const tools = [
  { category: 'tools', title: 'Profit Estimator', desc: 'Calculator for estimating seasonal revenue based on Mandi rates.', tags: ['Calc', 'Finance'], status: 'Live' },
  { category: 'tools', title: 'Dosage Pro', desc: 'Precise chemical-to-water ratio calculator for orchard sprays.', tags: ['Mix', 'Safety'], status: 'Active' }
];

const knowledgeData = [
  ...varieties,
  ...pests,
  ...schemes,
  ...guides,
  ...tools
];

const KnowledgeHub: React.FC = () => {
  const [activeCat, setActiveCat] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const location = useLocation();

  const filtered = useMemo(() => {
    return knowledgeData.filter(item => 
      (activeCat === 'all' || item.category === activeCat) &&
      (item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [activeCat, searchTerm]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      const decodedSearch = decodeURIComponent(search);
      setSearchTerm(decodedSearch);
      
      // Auto-select if there's an exact or high-quality match
      const exactMatch = knowledgeData.find(item => 
        item.title.toLowerCase().includes(decodedSearch.toLowerCase()) ||
        decodedSearch.toLowerCase().includes(item.title.toLowerCase())
      );
      if (exactMatch) {
        setSelectedItem(exactMatch);
      }
    }
  }, [location]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20 no-scrollbar relative">
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900 mb-2">Knowledge Hub</h2>
            <p className="text-slate-500 font-medium">Explore localized agricultural resources and SKUAST-K manuals.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 shadow-sm">
             <Globe className="w-4 h-4 text-emerald-600" />
             <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Valley Repository</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-emerald-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search crops, diseases, or tools..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4.5 bg-white border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none shadow-sm transition-all font-medium text-slate-800"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-6 py-3.5 rounded-full font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 border shadow-sm ${
                activeCat === cat.id 
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-emerald-200 shadow-lg scale-105' 
                  : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200 hover:text-emerald-700'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {/* Detail Overlay Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedItem(null)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="bg-emerald-900 p-8 text-white flex justify-between items-start shrink-0">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em]">{selectedItem.category}</span>
                <h3 className="text-3xl font-bold font-heading">{selectedItem.title}</h3>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 lg:p-12 overflow-y-auto no-scrollbar flex-1 space-y-10">
              {/* Introduction */}
              <div className="space-y-4">
                <p className="text-xl font-medium text-slate-800 leading-relaxed italic border-l-4 border-emerald-500 pl-6">
                  "{selectedItem.desc}"
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedItem.tags.map((tag: string) => (
                    <span key={tag} className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Disease Specific Detailed Sections */}
              {selectedItem.category === 'pests' && (
                <div className="space-y-10">
                  {/* Visual Symptom Guide */}
                  {selectedItem.symptomImages && (
                    <section className="space-y-4">
                      <h4 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        <LucideImage className="w-6 h-6 text-emerald-600" /> Visual Symptom Guide
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedItem.symptomImages.map((img: any, idx: number) => (
                          <div key={idx} className="group relative bg-slate-100 rounded-[2rem] overflow-hidden border border-slate-200">
                            <img 
                              src={img.url} 
                              alt={img.caption} 
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm p-3">
                              <p className="text-white text-[10px] font-bold uppercase tracking-wider">{img.caption}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  <section className="space-y-4">
                    <h4 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                      <Stethoscope className="w-6 h-6 text-rose-500" /> Clinical Symptoms
                    </h4>
                    <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 text-slate-700 leading-relaxed">
                      {selectedItem.symptoms}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-amber-500" /> Root Causes
                    </h4>
                    <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 text-slate-700 leading-relaxed">
                      {selectedItem.causes}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                      <ShieldCheck className="w-6 h-6 text-emerald-600" /> Preventive Measures
                    </h4>
                    <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 text-slate-700 leading-relaxed">
                      {selectedItem.prevention}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h4 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                      <Microscope className="w-6 h-6 text-blue-600" /> SKUAST-K Treatment Protocol
                    </h4>
                    <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <span className="font-black text-[10px] text-blue-800 uppercase tracking-widest">Recommended Chemical Schedule</span>
                      </div>
                      <p className="text-blue-900 font-bold leading-relaxed">
                        {selectedItem.treatment}
                      </p>
                    </div>
                  </section>
                </div>
              )}

              {/* General Content for other categories */}
              {selectedItem.category !== 'pests' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 text-slate-700 leading-relaxed">
                    Detailed guidelines for this resource are currently being updated from the SKUAST-K 2024-25 repository. Please check back shortly for the full manual.
                  </div>
                  <div className="flex items-center gap-4 p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                    <Info className="w-6 h-6 text-emerald-600" />
                    <p className="text-sm font-medium text-emerald-800">
                      You can contact {selectedItem.expertContact || 'Towseef Ahmad'} via the dashboard for specific queries about {selectedItem.title}.
                    </p>
                  </div>
                </div>
              )}

              <button 
                onClick={() => setSelectedItem(null)}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                Close Hub <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((item, idx) => {
            const Icon = categories.find(c => c.id === item.category)?.icon || Globe;
            return (
              <div 
                key={idx} 
                onClick={() => setSelectedItem(item)}
                className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-5">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest bg-emerald-50 px-3 py-1 rounded-lg">
                      {item.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">{item.title}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{item.desc}</p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex gap-1.5 overflow-hidden">
                    {item.tags.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="text-[8px] font-black uppercase tracking-tighter text-slate-400 border border-slate-100 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Explore <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
               <Search className="w-10 h-10" />
             </div>
             <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em]">No resources matched your search</p>
          </div>
        )}
      </div>

      {/* Seasonal Feature Banner */}
      <div className="bg-slate-900 rounded-[3.5rem] p-10 lg:p-16 text-white relative overflow-hidden shadow-2xl mt-12">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Seasonal Library</span>
            </div>
            <h3 className="text-3xl lg:text-5xl font-heading font-bold leading-tight">
              Access SKUAST-K <br/><span className="text-emerald-400">2024-25 Repository.</span>
            </h3>
            <p className="text-emerald-100/70 text-lg font-medium leading-relaxed max-w-lg">
              Download official spray calendars and nutrient manuals directly from our hub.
            </p>
            <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-emerald-50 transition-all shadow-xl">
              <BookOpen className="w-5 h-5 text-emerald-600" /> Get Full Manuals
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 opacity-40 lg:opacity-100">
             <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
               <CalendarDays className="w-8 h-8 mx-auto mb-3 text-emerald-400" />
               <p className="text-[10px] font-black uppercase tracking-widest">Spray Schedule</p>
             </div>
             <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
               <Calculator className="w-8 h-8 mx-auto mb-3 text-blue-400" />
               <p className="text-[10px] font-black uppercase tracking-widest">Dose Tables</p>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default KnowledgeHub;
