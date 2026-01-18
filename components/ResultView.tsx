
import React, { useState, useEffect } from 'react';
import { SajuResponse } from '../types';
import { Lock, Unlock, Share2, Sparkles, AlertTriangle, CreditCard, ShieldCheck, ChevronDown } from 'lucide-react';
import PayPalCheckout from './PayPalCheckout';

interface ResultViewProps {
  data: SajuResponse;
}

export const ResultView: React.FC<ResultViewProps> = ({ data }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (isUnlocked) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isUnlocked]);

  const handlePaymentSuccess = (details: any) => {
    console.log("Payment Successful:", details);
    setIsUnlocked(true);
  };

  const renderLove = () => {
    const res = data.love_result!;
    return (
      <div className="space-y-12 animate-fade-in">
        {/* FREE: Hero Stats */}
        <div className="text-center mb-16 relative">
          <div className="inline-block px-5 py-2 bg-red-700 text-white text-[10px] font-black uppercase tracking-[0.4em] mb-8 shadow-lg shadow-red-900/20">
            {res.badge}
          </div>
          <div className="relative">
             <div className="text-9xl font-heading font-black text-white italic tracking-tighter leading-none drop-shadow-2xl">
              {res.total_score}
             </div>
             <div className="text-[10px] text-zinc-700 mt-6 uppercase font-black tracking-[0.6em] pt-6 border-t border-zinc-900 w-32 mx-auto">ODDS</div>
          </div>
          <p className="mt-12 text-zinc-200 text-xl font-heading italic font-medium leading-relaxed px-8 border-l-4 border-red-700 text-left mx-auto max-w-sm">
            "{res.summary}"
          </p>
        </div>

        {/* FREE: Attraction Analysis */}
        <div className="bg-zinc-950 border border-zinc-900 p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-700/5 blur-[60px]" />
          <div className="flex items-center gap-4 mb-8 text-red-700 text-[10px] font-black uppercase tracking-[0.4em]">
            <Sparkles className="w-4 h-4" />
            {res.partner_instinctive_attraction.title}
          </div>
          <p className="text-4xl font-heading font-black text-white mb-8 leading-[0.9] uppercase italic">
            "{res.partner_instinctive_attraction.quote}"
          </p>
          <p className="text-[13px] text-zinc-500 font-medium leading-relaxed">
            {res.partner_instinctive_attraction.why}
          </p>
        </div>

        {/* FREE: Breakdown */}
        <div className="grid grid-cols-1 gap-6">
            {res.score_breakdown.map((item, idx) => (
                <div key={idx} className="bg-zinc-950/40 p-6 border border-zinc-900">
                    <div className="flex justify-between items-center mb-5">
                      <div className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em]">{item.label}</div>
                      <span className="text-[11px] font-black text-red-700 font-heading italic tracking-widest">{item.tier}</span>
                    </div>
                    <div className="h-[1px] w-full bg-zinc-900 overflow-hidden">
                        <div className={`h-full bg-red-700 shadow-[0_0_15px_rgba(185,28,28,1)] transition-all duration-1000`} style={{width: `${item.score}%`}}></div>
                    </div>
                </div>
            ))}
        </div>

        {/* LOCKED/UNLOCKED: Future Roadmap */}
        <div className="space-y-8 pt-12 border-t border-zinc-900/50">
          <div className="text-center mb-10">
             <h3 className="text-white font-heading font-black text-2xl uppercase italic tracking-tighter">FUTURE TIMELINE</h3>
             <div className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.4em] mt-2">RESTRICTED DATA</div>
          </div>

          {res.locked_sections.map((section) => (
            <div key={section.id} className={`relative transition-all duration-1000 ${isUnlocked ? 'bg-zinc-950/50 border border-zinc-900/50' : 'bg-black border border-zinc-900/50'}`}>
              <div className="p-10">
                <div className="flex items-center justify-between mb-6">
                   <h4 className="text-white font-heading font-bold uppercase text-[11px] tracking-[0.4em]">
                    {section.title}
                   </h4>
                   {isUnlocked ? <Unlock className="w-3.5 h-3.5 text-green-600" /> : <Lock className="w-3.5 h-3.5 text-red-700 animate-pulse" />}
                </div>
                
                {isUnlocked ? (
                   <p className="text-base text-zinc-300 leading-relaxed animate-fade-in font-medium">
                     {section.content}
                   </p>
                ) : (
                  <div className="relative">
                    <p className="text-sm text-zinc-700 italic mb-4 blur-[4px] select-none">
                      {section.preview_quote}. This section contains exact dates and decision-making logic for your 2026/2027 relationship peak.
                    </p>
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMoney = () => {
    const res = data.money_result!;
    return (
      <div className="space-y-12 animate-fade-in">
        {/* FREE: Risk Map */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-heading font-black text-white mb-8 uppercase italic tracking-tighter leading-[0.8]">{res.risk_map_title}</h2>
          <div className="w-12 h-[2px] bg-red-700 mx-auto mb-8" />
          <p className="text-sm text-zinc-400 px-8 font-medium leading-relaxed tracking-tight">{res.free_insight}</p>
        </div>

        {/* FREE: Timeline */}
        <div className="space-y-8">
          {res.free_timeline.map((event, idx) => (
            <div key={idx} className="bg-zinc-950 border-l-[4px] border-l-red-700 border-y border-r border-zinc-900 p-10 relative group shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black text-red-700 uppercase tracking-[0.5em]">{event.window}</span>
              </div>
              <div className="text-white font-heading font-black text-3xl mb-10 leading-[0.9] uppercase italic">{event.theme}</div>
              <div className="grid grid-cols-1 gap-8 text-[11px] border-t border-zinc-900 pt-10">
                <div>
                   <span className="text-white font-black block mb-4 uppercase tracking-[0.3em] italic opacity-60">STRATEGIC MOVE</span>
                   <span className="text-zinc-300 leading-relaxed font-medium text-sm">{event.best_action}</span>
                </div>
                <div>
                   <span className="text-zinc-700 font-black block mb-4 uppercase tracking-[0.3em] italic">SYSTEM RISK</span>
                   <span className="text-zinc-600 leading-relaxed font-medium">{event.avoid}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LOCKED/UNLOCKED: Tactical Strategy */}
        <div className="pt-16 border-t border-zinc-900/50">
           <div className="text-center mb-12">
             <h3 className="text-white font-heading font-black text-2xl uppercase italic tracking-tighter">TACTICAL PROTOCOL</h3>
             <div className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.4em] mt-2">LOCKED STRATEGY</div>
          </div>

          {!isUnlocked ? (
             <div className="p-12 border border-zinc-900 bg-black shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-700/5 blur-[50px]" />
                <div className="flex items-center gap-4 mb-10">
                    <Lock className="w-4 h-4 text-red-700 animate-pulse" />
                    <span className="text-white font-black text-[10px] tracking-[0.5em] uppercase">Private Asset Roadmap</span>
                </div>
                <div className="space-y-8 blur-[10px] select-none opacity-20">
                     <div className="h-3 bg-zinc-800 w-full rounded-sm"></div>
                     <div className="h-3 bg-zinc-800 w-3/4 rounded-sm"></div>
                     <div className="h-3 bg-zinc-800 w-5/6 rounded-sm"></div>
                     <div className="h-3 bg-zinc-800 w-full rounded-sm"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
             </div>
          ) : (
             <div className="space-y-8 animate-fade-in">
                 <div className="bg-zinc-950 border border-red-700/30 p-10">
                    <h4 className="text-red-700 text-[10px] font-black uppercase tracking-[0.4em] mb-6">Highest ROI Habit</h4>
                    <p className="text-white text-xl font-heading italic font-bold leading-relaxed">{res.locked.highest_roi_habit}</p>
                 </div>
                 <div className="bg-zinc-950 border border-zinc-900 p-10">
                    <h4 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                        <AlertTriangle className="w-4 h-4 text-red-700" /> Danger Zones
                    </h4>
                    <ul className="space-y-5">
                        {res.locked.danger_zones.map((z, i) => (
                          <li key={i} className="text-[13px] text-zinc-400 font-medium pl-6 border-l border-zinc-800 leading-relaxed">{z}</li>
                        ))}
                    </ul>
                 </div>
                 <div className="bg-black border border-white/5 p-10 shadow-2xl relative">
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-700" />
                    <h4 className="text-white text-[10px] font-black uppercase tracking-[0.4em] mb-10">Next Move Checklist</h4>
                    <ul className="text-sm text-zinc-300 space-y-8">
                         {res.locked.next_move_checklist.map((c, i) => (
                             <li key={i} className="flex gap-5 items-start">
                                 <span className="text-red-700 font-black text-xl leading-none">/</span> 
                                 <span className="pt-0.5 font-medium leading-relaxed tracking-tight">{c}</span>
                             </li>
                         ))}
                    </ul>
                 </div>
             </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full max-w-lg ${isUnlocked ? 'pb-32' : 'pb-[500px]'} transition-all duration-1000`}>
      {/* FREE Results Header */}
      <div className="mb-20 text-center pt-16">
        <h1 className="text-6xl font-heading font-black text-white mb-8 uppercase leading-[0.8] italic tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            {data.free.headline}
        </h1>
        <div className="w-16 h-[2px] bg-red-700 mx-auto mb-8" />
        <p className="text-red-700 text-[12px] font-black tracking-[0.6em] uppercase px-6">
            {data.free.one_liner}
        </p>
      </div>

      {/* Main Content Area */}
      {data.mode === 'love' && data.love_result && renderLove()}
      {data.mode === 'money' && data.money_result && renderMoney()}

      {/* FIXED PAYWALL - Bottom Sheet */}
      {!isUnlocked && (
        <div className="fixed bottom-0 left-0 w-full p-4 z-[100] bg-gradient-to-t from-black via-black/95 to-transparent pt-32">
           <div className="max-w-md mx-auto bg-zinc-950/90 backdrop-blur-2xl border border-red-700/50 p-6 md:p-10 shadow-[0_-20px_120px_rgba(185,28,28,0.6)] relative max-h-[55vh] overflow-y-auto scrollbar-hide animate-fade-in-up">
              <div className="flex justify-between items-end mb-10">
                  <div>
                      <div className="text-[9px] text-zinc-800 font-black mb-1 line-through decoration-red-700 decoration-[1.5px] italic uppercase tracking-[0.2em]">
                        {data.paywall.price_anchor}
                      </div>
                      <div className="text-7xl font-heading font-black text-white italic leading-none drop-shadow-md">
                        {data.paywall.discount_price}
                      </div>
                  </div>
                  <div className="text-right pb-1">
                       <p className="text-[10px] text-red-700 font-black mb-1 max-w-[140px] leading-tight uppercase tracking-widest animate-pulse">
                           {data.paywall.urgency}
                       </p>
                  </div>
              </div>
              
              <ul className="space-y-5 mb-12 border-t border-zinc-900 pt-10">
                  {data.paywall.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-4 text-[11px] font-bold text-zinc-300 uppercase tracking-tight leading-snug">
                          <Lock className="w-4 h-4 text-red-700 mt-0.5 shrink-0" />
                          <span>{b}</span>
                      </li>
                  ))}
              </ul>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[10px] text-zinc-700 font-black uppercase tracking-[0.4em] mb-2 px-1">
                  <CreditCard className="w-4 h-4 text-red-700" /> SECURE GATEWAY
                </div>
                
                <div className="relative group">
                  <PayPalCheckout 
                    price="5.00" 
                    onSuccess={handlePaymentSuccess} 
                  />
                  <div className="mt-6 flex items-center justify-center gap-2 opacity-40">
                    <ShieldCheck className="w-3 h-3 text-zinc-500" />
                    <span className="text-[8px] text-zinc-600 font-black uppercase tracking-[0.2em]">SSL Encrypted Payment</span>
                  </div>
                </div>
              </div>

              <div className="bg-red-700/5 border-y border-red-700/10 py-5 px-6 mt-10">
                <p className="text-[10px] text-center text-red-700 font-black uppercase tracking-[0.4em] leading-relaxed italic">
                  UNLEASH THE SOUL CODE PROTOCOL
                </p>
              </div>

              <p className="text-[8px] text-center text-zinc-800 mt-8 font-black uppercase tracking-[0.3em] leading-tight px-8 opacity-40">
                {data.paywall.disclaimer}
              </p>
           </div>
        </div>
      )}

      {/* SHARE CARD - Only after unlock */}
      {isUnlocked && (
          <div className="mt-24 mb-32 p-14 bg-zinc-950 border border-zinc-900 text-center animate-fade-in shadow-2xl relative">
             <div className="absolute top-0 left-0 w-20 h-1 bg-red-700" />
             <h4 className="text-white font-heading font-black uppercase text-3xl mb-8 italic tracking-tighter leading-[0.9]">{data.share_card.title}</h4>
             <p className="text-xs text-zinc-600 mb-12 font-bold leading-relaxed uppercase tracking-[0.1em] px-8">{data.share_card.subtitle}</p>
             <button 
               onClick={() => {
                  const shareText = `K-SAJU // MY SOUL CODE: ${data.free.one_liner}`;
                  if (navigator.share) {
                    navigator.share({
                      title: 'K-SAJU // THE SOUL CODE',
                      text: shareText,
                      url: window.location.href,
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(`${shareText} - ${window.location.href}`);
                    alert("Soul Code Link Copied.");
                  }
               }}
               className="flex items-center justify-center gap-5 w-full py-8 bg-white text-black hover:bg-zinc-200 rounded-none text-[12px] font-black uppercase tracking-[0.5em] transition-all shadow-[0_30px_60px_rgba(255,255,255,0.1)] active:scale-95"
             >
                <Share2 className="w-4 h-4" /> Share The Truth
             </button>
          </div>
      )}
    </div>
  );
};
