
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { InputCard } from './components/InputCard';
import { Button } from './components/Button';
import { ResultView } from './components/ResultView';
import { INITIAL_FORM_STATE, STEPS_LOVE, STEPS_MONEY, COPY } from './constants';
import { FormData, Mode, SajuResponse } from './types';
import { generateSajuReading } from './services/geminiService';
import { Loader2 } from 'lucide-react';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const PAYPAL_CLIENT_ID = "AVdHM8ow4Q4aMTd_m9WDCqr8IYNWxCX_r3mc855R08Z4_xzXZ_laPfk51qAJttiBVzhICIZ-GJC4Uj6i"; 

const App: React.FC = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SajuResponse | null>(null);

  const isLove = formData.mode === 'LOVE';
  const steps = isLove ? STEPS_LOVE : STEPS_MONEY;
  const totalSteps = steps.length;

  const handleModeSelect = (mode: Mode) => {
    setFormData(prev => ({ ...prev, mode }));
    setStep(1);
  };

  const updateFormData = (field: string, value: any, nested?: 'user' | 'partner') => {
    if (nested) {
      setFormData(prev => ({
        ...prev,
        [nested]: { ...prev[nested]!, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(0, prev - 1));

  const runAnalysis = async () => {
    setStep(isLove ? 5 : 4); 
    setIsAnalyzing(true);
    
    try {
      const minTimePromise = new Promise(resolve => setTimeout(resolve, 3000));
      const apiPromise = generateSajuReading(formData, false);
      const [_, response] = await Promise.all([minTimePromise, apiPromise]);
      setResult(response);
      setStep(prev => prev + 1); 
    } catch (e) {
      console.error(e);
      alert("The stars are clouded. Please try again.");
      setStep(0);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderModeSelect = () => (
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      <div className="text-center mb-16">
        {/* Removed italic from SPOILER ALERT. */}
        <h1 className="text-6xl font-heading font-black text-white mb-6 tracking-tighter uppercase leading-[0.8] drop-shadow-2xl">
          {COPY.mode.title}
        </h1>
        <div className="w-12 h-[3px] bg-red-700 mx-auto mb-6" />
        <p className="text-[14px] text-zinc-400 font-bold leading-relaxed max-w-xs mx-auto uppercase tracking-tighter opacity-80">
          {COPY.mode.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <button
          onClick={() => handleModeSelect('LOVE')}
          className="group relative flex flex-col items-center justify-center h-80 bg-zinc-950/40 backdrop-blur-xl border border-white/5 rounded-none p-6 transition-all duration-1000 hover:bg-zinc-900/60 hover:border-red-700 hover:shadow-[0_0_80px_rgba(185,28,28,0.3)] overflow-hidden"
        >
           <div className="absolute inset-0 bg-gradient-to-t from-red-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="relative z-10 text-center space-y-4">
             {COPY.mode.btn_love.split('\n').map((line, i) => (
               <span key={i} className={`block font-heading font-black uppercase tracking-[0.4em] transition-all duration-500 ${i === 2 ? 'text-2xl text-red-700 group-hover:text-red-600 group-hover:scale-110' : 'text-xs text-zinc-600 group-hover:text-white'}`}>
                 {line}
               </span>
             ))}
           </div>
        </button>

        <button
          onClick={() => handleModeSelect('MONEY')}
          className="group relative flex flex-col items-center justify-center h-80 bg-zinc-950/40 backdrop-blur-xl border border-white/5 rounded-none p-6 transition-all duration-1000 hover:bg-zinc-900/60 hover:border-white hover:shadow-[0_0_80px_rgba(255,255,255,0.1)] overflow-hidden"
        >
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-800/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="relative z-10 text-center space-y-4">
             {COPY.mode.btn_money.split('\n').map((line, i) => (
               <span key={i} className={`block font-heading font-black uppercase tracking-[0.4em] transition-all duration-500 ${i === 2 ? 'text-2xl text-white group-hover:scale-110' : 'text-xs text-zinc-600 group-hover:text-white'}`}>
                 {line}
               </span>
             ))}
           </div>
        </button>
      </div>
    </div>
  );

  const renderPersonForm = (type: 'user' | 'partner') => {
    const data = type === 'user' ? formData.user : formData.partner;
    const copy = type === 'user' ? COPY.user_details : COPY.partner_details;
    const handleChange = (f: string, v: string) => {
      if (type === 'partner' && !formData.partner) {
          setFormData(prev => ({ ...prev, partner: { name: '', birthDate: '', birthTime: 'unknown', gender: 'F', [f]: v }}));
      } else {
          updateFormData(f, v, type);
      }
    };
    const handleDateChange = (part: 'year' | 'month' | 'day', val: string) => {
        const current = data?.birthDate || '--';
        const [y, m, d] = current.includes('-') ? current.split('-') : ['', '', ''];
        let newDate = '';
        if (part === 'year') {
          const cleaned = val.replace(/\D/g, '').slice(0, 4);
          newDate = `${cleaned}-${m}-${d}`;
        }
        if (part === 'month') newDate = `${y}-${val}-${d}`;
        if (part === 'day') {
           let safeDay = val.replace(/\D/g, '').slice(0, 2);
           if (safeDay !== '') {
             const num = parseInt(safeDay, 10);
             if (num > 31) safeDay = '31';
             if (num < 1 && safeDay.length > 0) safeDay = '1';
           }
           newDate = `${y}-${m}-${safeDay}`;
        }
        handleChange('birthDate', newDate);
    };
    const [year, month, day] = (data?.birthDate || '').split('-');
    const isReady = data && data.name.trim().length > 0 && year && year.length === 4 && month && day && day.length > 0 && data.gender;
    return (
      <InputCard title={copy.title} subtitle={copy.subtitle}>
        <div className="space-y-6">
          <div className="group">
            <label className="block text-[10px] text-zinc-500 mb-2 ml-1 uppercase font-black tracking-[0.2em] group-focus-within:text-red-700 transition-colors">Name <span className="text-red-700">*</span></label>
            <input type="text" placeholder={copy.name_ph} value={data?.name || ''} onChange={(e) => handleChange('name', e.target.value)} className="w-full bg-black border border-zinc-900 rounded-none p-4 text-white placeholder-zinc-800 focus:outline-none focus:border-red-700 transition-all font-medium uppercase tracking-widest text-xs" />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 mb-2 ml-1 uppercase font-black tracking-[0.2em]">Date of Birth <span className="text-red-700">*</span></label>
            <div className="flex gap-2">
                <input type="text" inputMode="numeric" placeholder="YYYY" value={year || ''} onChange={(e) => handleDateChange('year', e.target.value)} className="w-1/3 bg-black border border-zinc-900 rounded-none p-4 text-white placeholder-zinc-800 focus:outline-none focus:border-red-700 transition-all text-center text-xs tracking-widest" />
                <select value={month || ''} onChange={(e) => handleDateChange('month', e.target.value)} className="w-1/3 bg-black border border-zinc-900 rounded-none p-4 text-white focus:outline-none focus:border-red-700 appearance-none text-center text-xs tracking-widest uppercase font-bold">
                    <option value="" disabled>Month</option>
                    {Array.from({length: 12}, (_, i) => {
                        const m = (i + 1).toString().padStart(2, '0');
                        const name = new Date(2000, i, 1).toLocaleString('en-US', { month: 'short' });
                        return <option key={m} value={m} className="bg-black text-white">{name}</option>
                    })}
                </select>
                <input type="text" inputMode="numeric" placeholder="DD" value={day || ''} onChange={(e) => handleDateChange('day', e.target.value)} className="w-1/3 bg-black border border-zinc-900 rounded-none p-4 text-white placeholder-zinc-800 focus:outline-none focus:border-red-700 transition-all text-center text-xs tracking-widest" />
            </div>
          </div>
          <div className="flex gap-4">
             <div className="flex-1">
                <label className="block text-[10px] text-zinc-500 mb-2 ml-1 uppercase font-black tracking-[0.2em]">Time</label>
                <select value={data?.birthTime || 'unknown'} onChange={(e) => handleChange('birthTime', e.target.value)} className="w-full bg-black border border-zinc-900 rounded-none p-4 text-white focus:outline-none focus:border-red-700 appearance-none text-center text-xs tracking-widest uppercase font-bold">
                    <option value="unknown" className="bg-black text-zinc-600">Unknown</option>
                    {Array.from({length: 24}, (_, i) => {
                        const t = i.toString().padStart(2, '0') + ":00";
                        return <option key={t} value={t} className="bg-black text-white">{t}</option>
                    })}
                </select>
             </div>
             <div className="w-1/3">
                <label className="block text-[10px] text-zinc-500 mb-2 ml-1 uppercase font-black tracking-[0.2em]">Gender <span className="text-red-700">*</span></label>
                <select value={data?.gender || 'M'} onChange={(e) => handleChange('gender', e.target.value)} className="w-full bg-black border border-zinc-900 rounded-none p-4 text-white focus:outline-none focus:border-red-700 appearance-none text-center text-xs tracking-widest uppercase font-bold">
                  <option value="M" className="bg-black">M</option>
                  <option value="F" className="bg-black">F</option>
                  <option value="Other" className="bg-black">O</option>
                </select>
             </div>
          </div>
        </div>
        <div className="pt-8"><Button onClick={nextStep} disabled={!isReady}>{copy.cta}</Button></div>
      </InputCard>
    );
  };

  const renderContext = () => {
    const isLove = formData.mode === 'LOVE';
    const title = isLove ? COPY.context.love_title : COPY.context.money_title;
    const subtitle = isLove ? COPY.context.love_subtitle : COPY.context.money_subtitle;
    const ph = isLove ? COPY.context.love_ph : COPY.context.money_ph;
    const val = isLove ? formData.relationshipStatus : formData.occupation;
    const field = isLove ? 'relationshipStatus' : 'occupation';
    return (
      <InputCard title={title} subtitle={subtitle}>
        <input type="text" placeholder={ph} value={val} onChange={(e) => updateFormData(field, e.target.value)} className="w-full bg-black border border-zinc-900 rounded-none p-4 text-white placeholder-zinc-800 focus:outline-none focus:border-red-700 transition-all uppercase tracking-widest text-xs font-medium" />
        <div className="pt-8"><Button onClick={nextStep}>{COPY.context.cta}</Button></div>
      </InputCard>
    );
  };

  const renderFinalKey = () => {
    const isLove = formData.mode === 'LOVE';
    const ph = isLove ? COPY.final_key.love_ph : COPY.final_key.money_ph;
    return (
      <InputCard title={COPY.final_key.title} subtitle={COPY.final_key.subtitle}>
        <textarea rows={3} placeholder={ph} value={formData.finalQuestion} onChange={(e) => updateFormData('finalQuestion', e.target.value)} className="w-full bg-black border border-zinc-900 rounded-none p-4 text-white placeholder-zinc-800 focus:outline-none focus:border-red-700 transition-all uppercase tracking-widest text-xs font-medium resize-none" />
        <div className="pt-8"><Button onClick={runAnalysis}>{COPY.final_key.cta}</Button></div>
      </InputCard>
    );
  };

  const renderAnalyzing = () => (
    <div className="flex flex-col items-center justify-center text-center animate-pulse py-20">
       <div className="relative mb-10">
          <div className="absolute inset-0 bg-red-700 blur-[40px] opacity-40 animate-pulse" />
          <Loader2 className="w-16 h-16 text-red-700 animate-spin relative z-10" />
       </div>
       <h2 className="text-3xl font-heading font-black text-white mb-4 uppercase">Accessing The Soul Code...</h2>
       <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em]">Decoding Trajectory // 2026+</p>
    </div>
  );

  const getStepContent = () => {
    if (step === 0) return renderModeSelect();
    if (formData.mode === 'LOVE') {
      if (step === 1) return renderPersonForm('user');
      if (step === 2) return renderPersonForm('partner');
      if (step === 3) return renderContext();
      if (step === 4) return renderFinalKey();
      if (step === 5) return renderAnalyzing();
      if (step === 6 && result) return <ResultView data={result} />;
    } else {
      if (step === 1) return renderPersonForm('user');
      if (step === 2) return renderContext();
      if (step === 3) return renderFinalKey();
      if (step === 4) return renderAnalyzing();
      if (step === 5 && result) return <ResultView data={result} />;
    }
    return null;
  };

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD", intent: "capture", components: "buttons", vault: false }}>
      <Layout onBack={prevStep} showBack={step > 0 && !result} step={step} totalSteps={totalSteps}>
        {getStepContent()}
      </Layout>
    </PayPalScriptProvider>
  );
};

export default App;
