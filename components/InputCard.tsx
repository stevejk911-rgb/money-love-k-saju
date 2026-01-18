
import React from 'react';

interface InputCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}

export const InputCard: React.FC<InputCardProps> = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`w-full bg-zinc-950/80 backdrop-blur-2xl border border-white/5 rounded-none p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] animate-fade-in-up ${className}`}>
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-heading font-black text-white mb-4 tracking-tighter uppercase italic leading-[0.9]">
          {title}
        </h1>
        <div className="w-8 h-[2px] bg-red-700 mx-auto mb-4" />
        <p className="text-[13px] text-zinc-400 font-medium leading-relaxed tracking-tight max-w-[90%] mx-auto uppercase">
          {subtitle}
        </p>
      </div>
      <div className="space-y-8">
        {children}
      </div>
    </div>
  );
};
