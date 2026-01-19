
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bug, 
  TrendingUp, 
  MessageCircle, 
  Menu, 
  X, 
  Leaf,
  CloudSun,
  Home,
  Camera,
  Store,
  MessageSquare,
  Zap,
  BookOpen,
  Lock,
  CloudLightning,
  CalendarDays,
  ScanEye,
  Phone,
  Facebook,
  MessageCircle as WhatsAppIcon,
  FlaskConical,
  Calculator,
  ShieldCheck,
  Globe,
  LineChart,
  Droplets,
  Stethoscope,
  Warehouse,
  MapPin,
  Award
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import DiseaseDetection from './pages/DiseaseDetection';
import MarketPrices from './pages/MarketPrices';
import ExpertChat from './pages/ExpertChat';
import LiveLens from './pages/LiveLens';
import KnowledgeHub from './pages/KnowledgeHub';
import Admin from './pages/Admin';
import WeatherHub from './pages/WeatherHub';
import FarmingCalendar from './pages/FarmingCalendar';
import SoilHealth from './pages/SoilHealth';
import ProfitCalculator from './pages/ProfitCalculator';
import SubsidyTracker from './pages/SubsidyTracker';
import MandiAnalytics from './pages/MandiAnalytics';
import DosageCalculator from './pages/DosageCalculator';
import SmartDiagnose from './pages/SmartDiagnose';
import CAStorageHub from './pages/CAStorageHub';
import DealerLocator from './pages/DealerLocator';
import GradingGuide from './pages/GradingGuide';
import RotatingLogo from './components/RotatingLogo';
import Footer from './components/Footer';
import { TopTicker, BottomTicker } from './components/NewsTicker';

const MobileBottomNav = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/smart-diagnose', label: 'Diagnose', icon: Stethoscope },
    { path: '/market', label: 'Mandi', icon: Store },
    { path: '/expert', label: 'Ask AI', icon: MessageSquare },
    { path: '/weather', label: 'Weather', icon: CloudSun },
  ];

  return (
    <div className="lg:hidden fixed bottom-11 left-0 right-0 z-[100] px-4 pb-4 pointer-events-none">
      <div className="bg-white/90 backdrop-blur-2xl border border-emerald-100 rounded-[2.5rem] shadow-2xl shadow-emerald-900/20 flex justify-between items-center p-2 pointer-events-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-[2rem] transition-all duration-300 ${
                isActive 
                  ? 'bg-emerald-900 text-white scale-110 shadow-lg' 
                  : 'text-slate-400 hover:text-emerald-700 active:scale-95'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-emerald-300' : ''}`} />
              <span className="text-[8px] font-black uppercase mt-1 tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const FloatingActions = () => {
  const expertPhone = "7006686584";
  
  return (
    <>
      <div className="fixed bottom-32 right-6 lg:bottom-12 lg:right-12 z-[90] flex flex-col gap-4 items-end animate-in slide-in-from-right-10 duration-700 delay-500">
        <a 
          href={`https://wa.me/91${expertPhone}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 group relative border-2 border-white"
        >
          <WhatsAppIcon className="w-7 h-7" />
          <span className="absolute right-full mr-3 bg-white text-emerald-800 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-xl border border-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">WhatsApp Expert</span>
        </a>

        <a 
          href={`tel:${expertPhone}`}
          className="flex items-center gap-3 bg-rose-600 text-white px-5 py-3 rounded-[2rem] font-bold shadow-2xl shadow-rose-500/30 hover:bg-rose-500 transition-all active:scale-95 group border-2 border-white"
        >
          <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Phone className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[8px] font-black uppercase tracking-widest opacity-80">Call Towseef</span>
            <span className="text-xs">7006686584</span>
          </div>
        </a>
      </div>
    </>
  );
};

const SidebarNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/smart-diagnose', label: 'Smart Diagnose', icon: Stethoscope },
    { path: '/ca-storage', label: 'CA Storage Hub', icon: Warehouse },
    { path: '/dealers', label: 'Dealer Locator', icon: MapPin },
    { path: '/grading', label: 'Grading Guide', icon: Award },
    { path: '/calendar', label: 'Agri-Calendar', icon: CalendarDays },
    { path: '/weather', label: 'Weather Hub', icon: CloudSun },
    { path: '/soil', label: 'Soil Health Pro', icon: FlaskConical },
    { path: '/dosage', label: 'Dosage Pro', icon: Droplets },
    { path: '/mandi-stats', label: 'Mandi Stats', icon: LineChart },
    { path: '/profit-calc', label: 'Profit Estimator', icon: Calculator },
    { path: '/subsidies', label: 'Subsidy Tracker', icon: ShieldCheck },
    { path: '/live-lens', label: 'FCK Scan', icon: ScanEye },
    { path: '/disease', label: 'Plant Scan', icon: Bug },
    { path: '/market', label: 'Market Prices', icon: Store },
    { path: '/expert', label: 'Ask AI', icon: MessageCircle },
    { path: '/knowledge', label: 'Resources', icon: BookOpen },
    { path: '/admin', label: 'Admin Panel', icon: Lock },
  ];

  return (
    <>
      <div className="lg:hidden mt-10 bg-emerald-900 text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <RotatingLogo size="sm" />
          <span className="font-heading font-bold text-lg tracking-tight">Farmer's Corner</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-emerald-800 rounded-full transition-colors">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <nav className={`
        fixed inset-y-0 left-0 z-[110] w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-8 overflow-y-auto no-scrollbar pb-20 pt-16">
          <div className="flex items-center gap-4 mb-12">
            <RotatingLogo />
            <div>
              <h1 className="font-heading font-bold text-xl text-slate-900 leading-none">Farmer's Corner</h1>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Kashmir Division</p>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-emerald-900 text-white shadow-xl shadow-emerald-100' 
                      : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-300' : 'text-slate-400'}`} />
                  <span className="font-semibold tracking-tight">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-[105] lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col lg:flex-row overflow-x-hidden relative">
        <TopTicker />
        <SidebarNavigation />
        <div className="flex-1 flex flex-col lg:ml-72">
          <main className="flex-1 p-4 lg:p-12 pb-48 pt-16 lg:pt-24">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/smart-diagnose" element={<SmartDiagnose />} />
                <Route path="/ca-storage" element={<CAStorageHub />} />
                <Route path="/dealers" element={<DealerLocator />} />
                <Route path="/grading" element={<GradingGuide />} />
                <Route path="/weather" element={<WeatherHub />} />
                <Route path="/calendar" element={<FarmingCalendar />} />
                <Route path="/soil" element={<SoilHealth />} />
                <Route path="/dosage" element={<DosageCalculator />} />
                <Route path="/mandi-stats" element={<MandiAnalytics />} />
                <Route path="/profit-calc" element={<ProfitCalculator />} />
                <Route path="/subsidies" element={<SubsidyTracker />} />
                <Route path="/live-lens" element={<LiveLens />} />
                <Route path="/disease" element={<DiseaseDetection />} />
                <Route path="/market" element={<MarketPrices />} />
                <Route path="/expert" element={<ExpertChat />} />
                <Route path="/knowledge" element={<KnowledgeHub />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
        <MobileBottomNav />
        <BottomTicker />
        <FloatingActions />
      </div>
    </HashRouter>
  );
}

export default App;
