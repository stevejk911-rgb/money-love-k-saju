
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { InputCard } from './components/InputCard';
import { Button } from './components/Button';
import { ResultView } from './components/ResultView';
import { INITIAL_FORM_STATE, STEPS_LOVE, STEPS_MONEY, COPY } from './constants';
import { FormData, Mode, SajuResponse } from './types';
import { generateSajuReading } from './services/geminiService';
import { Loader2 } from 'lucide-react';

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
      const minTimePromise = new Promise(resolve => setTimeout(resolve, 3500));
      const apiPromise = generateSajuReading(formData, false);
      const [_, response] = await Promise.all([minTimePromise, apiPromise]);
      setResult(response);
      setStep(prev => prev + 1); 
    } catch (e) {
      console.error(e);
      alert("System interrupted. Energy field unstable. Please retry.");
      setStep(0);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderModeSelect = () => (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-6 tracking-tighter uppercase leading-[0.8] drop-shadow-2xl">
          {COPY.mode.title}
        </h1>
        <div className="w-16 h-[3px] bg-red-700 mx-auto mb-6" />
        <p className="text-[13px] md:text-[15px] text-zinc-500 font-bold leading-relaxed max-w-xs mx-auto uppercase tracking-tighter opacity-90">
          {COPY.mode.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-8">
        {/* LOVE BOX */}
        <button
          onClick={() => handleModeSelect('LOVE')}
          className="group relative flex flex-col items-center justify-center aspect-[2/3] md:h-[500px] bg-zinc-950/80 backdrop-blur-md border border-zinc-900 transition-all duration-1000 hover:border-red-700 hover:shadow-[0_0_100px_rgba(185,28,28,0.2)] overflow-hidden"
        >
           <div className="absolute inset-0 bg-gradient-to-t from-red-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="relative z-10 text-center flex flex-col items-center justify-center space-y-8 md:space-y-12 w-full px-4">
             {COPY.mode.btn_love.split('\n').map((line, i) => (
               <span 
                 key={i} 
                 className={`block font-heading font-black uppercase transition-all duration-700 ${
                   i === 2 
                   ? 'text-4xl md:text-6xl text-red-700 group-hover:text-red-600 group-hover:scale-105 tracking-[0.1em]' 
                   : 'text-sm md:text-lg text-zinc-400 group-hover:text-white tracking-[0.4em]'
                 }`}
               >
                 {line}
               </span>
             ))}
           </div>
        </button>

        {/* WEALTH BOX */}
        <button
          onClick={() => handleModeSelect('MONEY')}
          className="group relative flex flex-col items-center justify-center aspect-[2/3] md:h-[500px] bg-zinc-950/80 backdrop-blur-md border border-zinc-900 transition-all duration-1000 hover:border-white hover:shadow-[0_0_100px_rgba(255,255,255,0.05)] overflow-hidden"
        >
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-800/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="relative z-10 text-center flex flex-col items-center justify-center space-y-8 md:space-y-12 w-full px-4">
             {COPY.mode.btn_money.split('\n').map((line, i) => (
               <span 
                 key={i} 
                 className={`block font-heading font-black uppercase transition-all duration-700 ${
                   i === 2 
                   ? 'text-3xl md:text-5xl text-white group-hover:scale-105 tracking-[0.1em]' 
                   : 'text-sm md:text-lg text-zinc-400 group-hover:text-white tracking-[0.4em]'
                 }`}
               >
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
    
    // Shared styling for input/select to ensure perfect alignment
    const fieldBaseClass = "h-14 bg-black border border-zinc-900 rounded-none text-white placeholder-zinc-800 focus:outline-none focus:border-red-700 transition-all font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center text-center w-full appearance-none";
    const labelBaseClass = "block text-[10px] text-zinc-600 mb-2 ml-0.5 uppercase font-black tracking-[0.3em]";

    return (
      <InputCard title={copy.title} subtitle={copy.subtitle}>
        <div className="space-y-6">
          {/* Identity Name Input */}
          <div className="group">
            <label className={labelBaseClass}>Identity <span className="text-red-700">*</span></label>
            <input 
              type="text" 
              placeholder={copy.name_ph} 
              value={data?.name || ''} 
              onChange={(e) => handleChange('name', e.target.value)} 
              className={`${fieldBaseClass} text-left px-5`} 
            />
          </div>

          {/* Origin Point Date Inputs */}
          <div>
            <label className={labelBaseClass}>Origin Point <span className="text-red-700">*</span></label>
            <div className="flex gap-2">
                <input 
                  type="text" 
                  inputMode="numeric" 
                  placeholder="YYYY" 
                  value={year || ''} 
                  onChange={(e) => handleDateChange('year', e.target.value)} 
                  className={fieldBaseClass} 
                />
                <select 
                  value={month || ''} 
                  onChange={(e) => handleDateChange('month', e.target.value)} 
                  className={fieldBaseClass}
                >
                    <option value="" disabled>MONTH</option>
                    {Array.from({length: 12}, (_, i) => {
                        const m = (i + 1).toString().padStart(2, '0');
                        const name = new Date(2000, i, 1).toLocaleString('en-US', { month: 'short' });
                        return <option key={m} value={m} className="bg-black text-white">{name.toUpperCase()}</option>
                    })}
                </select>
                <input 
                  type="text" 
                  inputMode="numeric" 
                  placeholder="DD" 
                  value={day || ''} 
                  onChange={(e) => handleDateChange('day', e.target.value)} 
                  className={fieldBaseClass} 
                />
            </div>
          </div>

          {/* Time Segment and Polarity */}
          <div className="flex gap-3">
             <div className="flex-[2]">
                <label className={labelBaseClass}>Time Segment</label>
                <select 
                  value={data?.birthTime || 'unknown'} 
                  onChange={(e) => handleChange('birthTime', e.target.value)} 
                  className={fieldBaseClass}
                >
                    <option value="unknown" className="bg-black text-zinc-800">UNSPECIFIED</option>
                    {Array.from({length: 24}, (_, i) => {
                        const t = i.toString().padStart(2, '0') + ":00";
                        return <option key={t} value={t} className="bg-black text-white">{t}</option>
                    })}
                </select>
             </div>
             <div className="flex-[1]">
                <label className={labelBaseClass}>Polarity <span className="text-red-700">*</span></label>
                <select 
                  value={data?.gender || 'M'} 
                  onChange={(e) => handleChange('gender', e.target.value)} 
                  className={fieldBaseClass}
                >
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
        <textarea rows={3} placeholder={ph} value={val} onChange={(e) => updateFormData(field, e.target.value)} className="w-full bg-black border border-zinc-900 rounded-none p-6 text-white placeholder-zinc-900 focus:outline-none focus:border-red-700 transition-all uppercase tracking-widest text-xs font-medium resize-none" />
        <div className="pt-10"><Button onClick={nextStep}>{COPY.context.cta}</Button></div>
      </InputCard>
    );
  };

  const renderFinalKey = () => {
    const isLove = formData.mode === 'LOVE';
    const ph = isLove ? COPY.final_key.love_ph : COPY.final_key.money_ph;
    return (
      <InputCard title={COPY.final_key.title} subtitle={COPY.final_key.subtitle}>
        <textarea rows={4} placeholder={ph} value={formData.finalQuestion} onChange={(e) => updateFormData('finalQuestion', e.target.value)} className="w-full bg-black border border-zinc-900 rounded-none p-6 text-white placeholder-zinc-900 focus:outline-none focus:border-red-700 transition-all uppercase tracking-widest text-xs font-medium resize-none" />
        <div className="pt-10"><Button onClick={runAnalysis}>{COPY.final_key.cta}</Button></div>
      </InputCard>
    );
  };

  const renderAnalyzing = () => (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6 animate-fade-in">
       <div className="relative mb-14">
          <div className="absolute inset-0 bg-red-700 blur-[60px] opacity-30 animate-pulse" />
          <Loader2 className="w-20 h-20 text-red-700 animate-spin relative z-10" />
       </div>
       <h2 className="text-4xl font-heading font-black text-white mb-6 uppercase tracking-tight">Accessing Soul Code...</h2>
       <p className="text-[11px] text-zinc-700 font-black uppercase tracking-[0.6em] animate-pulse">Calculating Probabilities // 2026-2030</p>
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
    <Layout onBack={prevStep} showBack={step > 0 && !result} step={step} totalSteps={totalSteps}>
      {getStepContent()}
    </Layout>
  );
};

export default App;
