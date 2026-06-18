'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

const steps = [
  '在这里写下你想问的事，或直接跳过，心中默念即可。',
  '单牌运势快速获取指引，三牌解读获得更深入的时间线分析。',
  '点击牌背将其翻开，我们将为你解读。',
];

export default function TarotGuide() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!storage.get<boolean>('tarotGuideDone')) setVisible(true);
  }, []);

  function handleNext() {
    if (step < steps.length - 1) setStep(step + 1);
    else { storage.set('tarotGuideDone', true); setVisible(false); }
  }
  function handleSkip() { storage.set('tarotGuideDone', true); setVisible(false); }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center" style={{ background: 'oklch(0 0 0 / 0.6)', backdropFilter: 'blur(2px)' }}
         onClick={handleNext}>
      <div className="card max-w-sm mx-4 p-8 text-center" style={{ animation: 'fadeIn 0.4s ease forwards', background: 'oklch(0.19 0.018 272)' }}
           onClick={e => e.stopPropagation()}>
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div key={i} className="h-[2px] rounded-full transition-all duration-300"
              style={{ width: i === step ? 24 : 8, background: i === step ? 'oklch(0.68 0.13 85)' : 'oklch(1 0 0 / 0.15)' }}
            />
          ))}
        </div>
        <p className="leading-relaxed mb-8 text-[15px]" style={{ color: 'oklch(0.92 0.003 320)' }}>{steps[step]}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={handleSkip} className="px-4 py-2 text-sm tracking-[0.04em] hover:opacity-70 transition-opacity" style={{ color: 'oklch(0.56 0.008 310)' }}>跳过</button>
          <button onClick={handleNext} className="btn px-6 py-2 text-sm">{step < steps.length - 1 ? '下一步' : '知道了'}</button>
        </div>
      </div>
    </div>
  );
}
