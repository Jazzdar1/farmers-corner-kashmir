
import React from 'react';
import { Leaf } from 'lucide-react';

const RotatingLogo: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'lg' }) => {
  const dim = size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  const iconDim = size === 'lg' ? 'w-7 h-7' : 'w-4 h-4';

  return (
    <div className="relative group perspective-1000">
      <div className={`relative ${dim} transform-style-3d animate-news-rotate`}>
        {/* Front Face */}
        <div className={`absolute inset-0 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg backface-hidden border-2 border-emerald-400`}>
          <Leaf className={`${iconDim} text-white`} />
        </div>
        {/* Back Face */}
        <div className={`absolute inset-0 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg backface-hidden border-2 border-slate-700 transform rotateY-180`}>
          <span className="text-[10px] font-black text-emerald-500 uppercase">FCK</span>
        </div>
      </div>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotateY-180 { transform: rotateY(180deg); }
        @keyframes news-rotate {
          0% { transform: rotateY(0deg); }
          20% { transform: rotateY(0deg); }
          45% { transform: rotateY(180deg); }
          70% { transform: rotateY(180deg); }
          95% { transform: rotateY(360deg); }
          100% { transform: rotateY(360deg); }
        }
        .animate-news-rotate {
          animation: news-rotate 6s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default RotatingLogo;
