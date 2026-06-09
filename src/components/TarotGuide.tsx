'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

const guideSteps = [
  { content: '在这里写下你想问的事，或者直接跳过，心中默念即可。' },
  { content: '选择「单牌运势」快速获取当下指引，或「三牌解读」获取更深入的时间线分析。' },
  { content: '点击牌背将其翻开，我们将为你解读。' },
];

export default function TarotGuide() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = storage.get<boolean>('tarotGuideDone');
    if (!done) setVisible(true);
  }, []);

  function handleNext() {
    if (step < guideSteps.length - 1) {
      setStep(step + 1);
    } else {
      storage.set('tarotGuideDone', true);
      setVisible(false);
    }
  }

  function handleSkip() {
    storage.set('tarotGuideDone', true);
    setVisible(false);
  }

  if (!visible) return null;

  const current = guideSteps[step];

  return (
    <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center"
         onClick={handleNext}>
      <div className="glass-card max-w-sm mx-4 p-8 text-center" style={{ animation: 'fadeIn 0.3s ease forwards' }}
           onClick={e => e.stopPropagation()}>
        <div className="flex justify-center gap-2 mb-4">
          {guideSteps.map((_, i) => (
            <div key={i}
              className={`h-2 rounded-full transition-all ${i === step ? 'w-6' : 'w-2'}`}
              style={{ backgroundColor: i === step ? '#c9a84c' : 'rgba(201,168,76,0.3)' }}
            />
          ))}
        </div>
        <p className="leading-relaxed mb-6" style={{ color: '#e0d8f0' }}>{current.content}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={handleSkip}
            className="px-4 py-2 text-sm transition-colors" style={{ color: '#8a7fa0' }}>
            跳过
          </button>
          <button onClick={handleNext}
            className="px-6 py-2 rounded-full text-sm font-semibold transition-all" style={{ backgroundColor: '#c9a84c', color: '#0a0a12' }}>
            {step < guideSteps.length - 1 ? '下一步' : '知道了'}
          </button>
        </div>
      </div>
    </div>
  );
}
