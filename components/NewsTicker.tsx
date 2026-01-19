
import React, { useEffect, useState } from 'react';
import { fetchNewsTicker } from '../services/news';
import { Radio, Zap, Trophy, Globe } from 'lucide-react';

interface TickerProps {
  position: 'top' | 'bottom';
}

export const TopTicker: React.FC = () => {
  const [news, setNews] = useState("Fetching latest global headlines...");

  useEffect(() => {
    const loadNews = async () => {
      const data = await fetchNewsTicker('latest');
      setNews(data);
    };
    loadNews();
    const interval = setInterval(loadNews, 400000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] lg:left-72 bg-rose-700 text-white h-10 flex items-center overflow-hidden border-b border-rose-500 shadow-lg">
      <div className="bg-white px-4 h-full flex items-center gap-2 relative z-10 shadow-xl">
        <Zap className="w-3.5 h-3.5 text-rose-700 fill-current animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-700 whitespace-nowrap">Breaking</span>
      </div>
      
      <div className="flex-1 relative h-full flex items-center overflow-hidden">
        <div className="whitespace-nowrap animate-marquee-slow flex items-center gap-12 px-8">
          <div className="flex items-center gap-4">
            <Globe className="w-3 h-3 text-rose-200" />
            <span className="text-xs font-bold tracking-tight text-rose-50 uppercase">{news}</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee-top {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-250%); }
        }
        .animate-marquee-slow {
          animation: marquee-top 240s linear infinite;
        }
      `}</style>
    </div>
  );
};

export const BottomTicker: React.FC = () => {
  const [kashmirNews, setKashmirNews] = useState("Loading breaking Kashmir news...");
  const [sportsNews, setSportsNews] = useState("Fetching latest sports updates...");

  useEffect(() => {
    const loadNews = async () => {
      const k = await fetchNewsTicker('kashmir');
      const s = await fetchNewsTicker('sports');
      setKashmirNews(k);
      setSportsNews(s);
    };
    loadNews();
    const interval = setInterval(loadNews, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] lg:left-72 bg-slate-900 text-white h-11 flex items-center overflow-hidden border-t border-emerald-500/30">
      <div className="bg-emerald-600 px-4 h-full flex items-center gap-2 relative z-10 shadow-xl">
        <Radio className="w-4 h-4 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Live Updates</span>
      </div>
      
      <div className="flex-1 relative h-full flex items-center overflow-hidden">
        <div className="whitespace-nowrap animate-marquee-crawl flex items-center gap-16 px-8">
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 font-black text-[9px] uppercase bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">Regional</span>
            <span className="text-sm font-medium tracking-tight text-slate-200">{kashmirNews}</span>
          </div>
          <div className="flex items-center gap-4">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-black text-[9px] uppercase bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">Sports News</span>
            <span className="text-sm font-medium tracking-tight text-slate-200">{sportsNews}</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee-bottom {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-300%); }
        }
        .animate-marquee-crawl {
          animation: marquee-bottom 300s linear infinite;
        }
      `}</style>
    </div>
  );
};
