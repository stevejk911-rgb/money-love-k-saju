
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { COPY } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  onBack: () => void;
  showBack: boolean;
  step: number;
  totalSteps: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, onBack, showBack, step, totalSteps }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white flex flex-col font-sans selection:bg-red-700 selection:text-white">
      {/* Background Image - bg.png 적극 활용 */}
      <img 
        src="bg.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0 transform scale-100 pointer-events-none opacity-60 grayscale-[0.2]"
      />
      
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.9)_110%)] pointer-events-none" />
      
      {/* Header - Removed italic from K-SAJU // SOUL CODE */}
      <header className="relative z-20 flex items-center justify-between px-6 py-8">
        <div className="text-xl font-heading font-extrabold tracking-tighter text-white uppercase">
          {COPY.header} <span className="text-red-700">.</span>
        </div>
        {showBack && (
          <button 
            onClick={onBack}
            className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-all bg-black/40 px-4 py-2 border border-zinc-800 hover:border-red-700"
          >
            <ArrowLeft className="w-3 h-3 mr-2" />
            <span>{COPY.back}</span>
          </button>
        )}
      </header>

      {/* Progress Bar */}
      <div className="relative z-20 flex justify-center items-center space-x-1 mb-8 px-12">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div 
            key={i}
            className={`h-[1px] transition-all duration-700 ease-out ${
              i <= step ? 'w-full bg-red-700 shadow-[0_0_8px_rgba(185,28,28,0.8)]' : 'w-full bg-zinc-900'
            }`}
          />
        ))}
      </div>

      <main className="relative z-10 flex-1 flex flex-col px-6 pb-20 overflow-y-auto scroll-smooth">
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto py-10">
          {children}
        </div>
      </main>
    </div>
  );
};
