
import React, { useState, useEffect } from 'react';
import { SajuResponse } from '../types';
import { Lock, Unlock, Share2, Sparkles, AlertTriangle, CreditCard, Loader2, RefreshCw, ExternalLink, ShieldAlert } from 'lucide-react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

interface ResultViewProps {
  data: SajuResponse;
}

export const ResultView: React.FC<ResultViewProps> = ({ data }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  const [sdkError, setSdkError] = useState<string | null>(null);

  useEffect(() => {
    if (isUnlocked) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    const handleError = (event: ErrorEvent) => {
      if (event.message === "Script error." || event.error?.toString().includes("paypal")) {
        setSdkError("Security restriction detected.");
      }
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [isUnlocked]);

  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  const renderLove = () => {
    const res = data.love_result!;
    return (
      <div className="space-y-10 animate-fade-in">
        <div className="text-center mb-12 relative">
          <div className="inline-block px-5 py-2 bg-red-700 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-none mb-6">
            {res.badge}
          </div>
          <div className="relative">
             <div className="text-9xl font-heading font-black text-white italic tracking-tighter leading-none">
              {res.total_score}
             </div>
             <div className="text-[10px] text-zinc-600 mt-4 uppercase font-black tracking-[0.5em] pt-4 border-t border-zinc-900 w-24 mx-auto">ODDS</div>
          </div>
          <p className="mt-10 text-zinc-200 text-xl font-heading italic font-medium leading-relaxed px-6 border-l-4 border-red-700 text-left mx-auto max-w-sm">
            "{res.summary}"
          </p>
        </div>

        <div className="bg-zinc-950/90 border border-zinc-900 rounded-none p-10 backdrop-blur-3xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6 text-red-700 text-[10px] font-black uppercase tracking-[0.3em]">
            <Sparkles className="w-4 h-4" />
            {res.partner_instinctive_attraction.title}
          </div>
          <p className="text-3xl font-heading font-black text-white mb-6 leading-[0.9] uppercase italic">
            "{res.partner_instinctive_attraction.quote}"
          </p>
          <p className="text-sm text-zinc-500 font-medium leading-relaxed">
            {res.partner_instinctive_attraction.why}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {res.score_breakdown.map((item, idx) => (
                <div key={idx} className="bg-zinc-950/40 p-5 rounded-none border border-zinc-900">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">{item.label}</div>
                      <span className="text-xs font-black text-red-700 font-heading italic">{item.tier}</span>
                    </div>
                    <div className="h-[2px] w-full bg-zinc-900 rounded-none overflow-hidden">
                        <div className={`h-full bg-red-700 shadow-[0_0_10px_rgba(185,28,28,0.8)]`} style={{width: `${item.score}%`}}></div>
                    </div>
                </div>
            ))}
        </div>

        <div className="space-y-6 pt-10">
          {res.locked_sections.map((section) => (
            <div key={section.id} className={`relative overflow-hidden rounded-none border transition-all duration-1000 ${isUnlocked ? 'bg-zinc-950 border-red-700/40' : 'bg-zinc-950 border-zinc-900'}`}>
              <div className="p-8">
                <h3 className="text-white font-heading font-bold uppercase text-[11px] tracking-[0.3em] mb-4 flex items-center justify-between">
                  {section.title}
                  {!isUnlocked && <Lock className="w-3 h-3 text-red-700 animate-pulse" />}
                </h3>
                
                {isUnlocked ? (
                   <p className="text-base text-zinc-300 mt-2 leading-relaxed animate-fade-in font-medium">
                     {section.content}
                   </p>
                ) : (
                  <div className="relative">
                    <p className="text-sm text-zinc-600 italic mb-6">"{section.preview_quote}..."</p>
                    <div className="h-2 w-full bg-zinc-900 rounded-none blur-[2px] opacity-20"></div>
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
      <div className="space-y-10 animate-fade-in">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-black text-white mb-6 uppercase italic tracking-tighter leading-[0.8]">{res.risk_map_title}</h2>
          <div className="w-10 h-[2px] bg-red-700 mx-auto mb-6" />
          <p className="text-sm text-zinc-400 px-6 font-medium leading-relaxed tracking-tight">{res.free_insight}</p>
        </div>

        <div className="space-y-6">
          {res.free_timeline.map((event, idx) => (
            <div key={idx} className="bg-zinc-950/90 border-l-[3px] border-l-red-700 border-y border-r border-zinc-900 rounded-none p-8 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-red-700 uppercase tracking-[0.4em]">{event.window}</span>
              </div>
              <div className="text-white font-heading font-black text-2xl mb-8 leading-[0.9] uppercase italic">{event.theme}</div>
              <div className="grid grid-cols-1 gap-6 text-[11px] border-t border-zinc-900 pt-8">
                <div>
                   <span className="text-white font-black block mb-3 uppercase tracking-[0.2em] italic">POWER MOVE</span>
                   <span className="text-zinc-400 leading-relaxed font-medium">{event.best_action}</span>
                </div>
                <div>
                   <span className="text-zinc-600 font-black block mb-3 uppercase tracking-[0.2em] italic">VOID SYSTEM</span>
                   <span className="text-zinc-600 leading-relaxed font-medium">{event.avoid}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isUnlocked && (
             <div className="p-10 border border-zinc-900 rounded-none bg-zinc-950 shadow-2xl relative">
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-700/10 blur-[40px]" />
                <div className="flex items-center gap-4 mb-8">
                    <Lock className="w-4 h-4 text-red-700" />
                    <span className="text-white font-black text-[10px] tracking-[0.4em] uppercase">Tactical Strategy Protocol</span>
                </div>
                <div className="space-y-6 blur-[6px] select-none opacity-10">
                     <div className="h-3 bg-zinc-700 rounded-none w-3/4"></div>
                     <div className="h-3 bg-zinc-700 rounded-none w-1/2"></div>
                     <div className="h-3 bg-zinc-700 rounded-none w-5/6"></div>
                </div>
             </div>
        )}

        {isUnlocked && (
             <div className="space-y-6 animate-fade-in">
                 <div className="bg-zinc-950 border border-red-700/20 rounded-none p-8">
                    <h4 className="text-red-700 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Highest ROI Habit</h4>
                    <p className="text-white text-lg font-heading italic font-bold leading-relaxed">{res.locked.highest_roi_habit}</p>
                 </div>
                 <div className="bg-zinc-950 border border-zinc-900 rounded-none p-8">
                    <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-red-700" /> Danger Zones
                    </h4>
                    <ul className="space-y-4">
                        {res.locked.danger_zones.map((z, i) => (
                          <li key={i} className="text-sm text-zinc-300 font-medium pl-4 border-l border-zinc-800">{z}</li>
                        ))}
                    </ul>
                 </div>
                 <div className="bg-black border border-white/5 rounded-none p-8 shadow-2xl">
                    <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8">Next Move Checklist</h4>
                    <ul className="text-sm text-zinc-300 space-y-6">
                         {res.locked.next_move_checklist.map((c, i) => (
                             <li key={i} className="flex gap-4 items-start">
                                 <span className="text-red-700 font-black text-lg leading-none">/</span> 
                                 <span className="pt-0.5 font-medium leading-relaxed">{c}</span>
                             </li>
                         ))}
                    </ul>
                 </div>
             </div>
        )}
      </div>
    );
  };

  const isAnyError = isRejected || !!sdkError;

  return (
    <div className="w-full max-w-lg pb-80">
      <div className="mb-16 text-center pt-10">
        <h1 className="text-5xl font-heading font-black text-white mb-6 uppercase leading-[0.8] italic tracking-tighter drop-shadow-2xl">{data.free.headline}</h1>
        <div className="w-12 h-[3px] bg-red-700 mx-auto mb-6" />
        <p className="text-red-700 text-[11px] font-black tracking-[0.5em] uppercase px-4">{data.free.one_liner}</p>
      </div>

      {data.mode === 'love' && data.love_result && renderLove()}
      {data.mode === 'money' && data.money_result && renderMoney()}

      {!isUnlocked && (
        <div className="fixed bottom-0 left-0 w-full p-6 z-[100] bg-gradient-to-t from-black via-black/95 to-transparent pt-32">
           <div className="max-w-md mx-auto bg-zinc-950/90 backdrop-blur-3xl border border-red-700/40 rounded-none p-10 shadow-[0_-30px_120px_rgba(185,28,28,0.4)] relative overflow-visible">
              <div className="flex justify-between items-end mb-10">
                  <div>
                      <div className="text-[10px] text-zinc-700 font-black mb-2 line-through decoration-red-700 decoration-[1.5px] italic uppercase tracking-widest">{data.paywall.price_anchor}</div>
                      <div className="text-6xl font-heading font-black text-white italic leading-none">{data.paywall.discount_price}</div>
                  </div>
                  <div className="text-right">
                       <p className="text-[10px] text-red-700 font-black mb-1 max-w-[140px] leading-tight uppercase tracking-widest animate-pulse">
                           {data.paywall.urgency}
                       </p>
                  </div>
              </div>
              
              <ul className="space-y-6 mb-12">
                  {data.paywall.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-5 text-[12px] font-bold text-zinc-300 uppercase tracking-tight leading-relaxed">
                          <Unlock className="w-4 h-4 text-red-700 mt-0.5 shrink-0" />
                          <span className="pt-0.5">{b}</span>
                      </li>
                  ))}
              </ul>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em] mb-4 px-1">
                  <CreditCard className="w-3 h-3 text-red-700" /> SECURE GATEWAY // PAYPAL
                </div>
                
                <div className="w-full min-h-[180px] relative rounded-none flex flex-col items-center justify-center bg-black border border-zinc-900 p-6 overflow-visible z-[110]">
                  {isPending && !isAnyError ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <Loader2 className="w-10 h-10 animate-spin mb-6 text-red-700" />
                      <span className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.5em] animate-pulse">Initializing...</span>
                    </div>
                  ) : isAnyError ? (
                    <div className="p-8 text-center w-full animate-fade-in-up">
                      <div className="flex justify-center mb-6">
                         <ShieldAlert className="w-16 h-16 text-red-700" />
                      </div>
                      <p className="text-[12px] text-white font-black uppercase mb-4 tracking-[0.3em]">Environment Blocked</p>
                      <p className="text-[10px] text-zinc-500 mb-8 uppercase leading-relaxed font-bold tracking-tight">
                        Security policy detected. Open in a dedicated browser tab to authorize.
                      </p>
                      <div className="space-y-4">
                        <button 
                          onClick={handleOpenNewTab}
                          className="flex items-center justify-center gap-3 w-full px-8 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-none hover:bg-zinc-200 transition-all shadow-[0_15px_50px_rgba(255,255,255,0.15)]"
                        >
                          <ExternalLink className="w-4 h-4" /> AUTHORIZE TAB
                        </button>
                        <button 
                          onClick={() => window.location.reload()}
                          className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-all underline underline-offset-8 decoration-red-700"
                        >
                          RETRY CONNECTION
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full min-h-[150px] animate-fade-in relative">
                      <PayPalButtons
                          style={{ 
                            layout: "vertical", 
                            color: "gold", 
                            shape: "rect",
                            label: "pay",
                            tagline: false,
                            height: 52 
                          }}
                          createOrder={(data, actions) => {
                              return actions.order.create({
                                  intent: "CAPTURE",
                                  purchase_units: [
                                      {
                                          amount: {
                                              value: "5.00", 
                                              currency_code: "USD" 
                                          },
                                          description: "K-SAJU // PREMIUM SOUL CODE"
                                      },
                                  ],
                              });
                          }}
                          onApprove={async (data, actions) => {
                              if (actions.order) {
                                  try {
                                      await actions.order.capture();
                                      setIsUnlocked(true);
                                  } catch (e) {
                                      console.error("Capture Error", e);
                                      setSdkError("Confirmation error.");
                                  }
                              }
                          }}
                          onError={(err) => {
                              console.error("PayPal Error:", err);
                              setSdkError("Restriction detected.");
                          }}
                          forceReRender={[isUnlocked, isAnyError]}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-red-700/5 border-y border-red-700/20 py-4 px-6 mt-10">
                <p className="text-[9px] text-center text-red-700 font-black uppercase tracking-[0.3em] leading-relaxed">
                  DIRECT ACTIONABLE INSIGHT // UNIQUE ENERGY BLUEPRINT
                </p>
              </div>

              <p className="text-[8px] text-center text-zinc-800 mt-6 font-black uppercase tracking-[0.3em] leading-tight px-10">
                {data.paywall.disclaimer}
              </p>
           </div>
        </div>
      )}

      {isUnlocked && (
          <div className="mt-20 mb-20 p-12 bg-zinc-950 border border-zinc-900 rounded-none text-center animate-fade-in shadow-2xl relative">
             <div className="absolute top-0 left-0 w-12 h-1 bg-red-700" />
             <h4 className="text-white font-heading font-black uppercase text-2xl mb-6 italic tracking-tighter leading-[0.9]">{data.share_card.title}</h4>
             <p className="text-xs text-zinc-500 mb-10 font-bold leading-relaxed uppercase tracking-tight px-4">{data.share_card.subtitle}</p>
             <button 
               onClick={() => {
                  const shareText = `My K-SAJU Reading: ${data.free.one_liner}`;
                  if (navigator.share) {
                    navigator.share({
                      title: 'K-SAJU // THE SOUL CODE',
                      text: shareText,
                      url: window.location.href,
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(`${shareText} - ${window.location.href}`);
                    alert("Sharing link copied to clipboard!");
                  }
               }}
               className="flex items-center justify-center gap-4 w-full py-6 bg-white text-black hover:bg-zinc-200 rounded-none text-[11px] font-black uppercase tracking-[0.4em] transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95"
             >
                <Share2 className="w-4 h-4" /> Share The Truth
             </button>
          </div>
      )}
    </div>
  );
};
