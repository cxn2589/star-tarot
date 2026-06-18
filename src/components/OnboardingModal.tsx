'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

const steps = [
  { emoji: '✦', title: '欢迎来到星辰之引', description: '一个安静的空间，让塔罗与星象陪你探索内心。' },
  { emoji: '🔮', title: '塔罗占卜', description: '心中默念问题，抽一张或三张牌，AI 为你解读。' },
  { emoji: '🌙', title: '星象相伴', description: '每月星座运势 · 每日塔罗指引，让宇宙的节奏陪你度过每一天。' },
];

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!storage.get<boolean>('hasVisited')) setVisible(true);
  }, []);

  function handleSkip() { storage.set('hasVisited', true); setVisible(false); }
  function handleNext() {
    if (step < steps.length - 1) setStep(step + 1);
    else { storage.set('hasVisited', true); setVisible(false); }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'oklch(0 0 0 / 0.75)', backdropFilter: 'blur(2px)' }}>
      <div className="card max-w-md w-full mx-4 p-10 text-center relative" style={{ animation: 'fadeIn 0.6s ease forwards', background: 'oklch(0.19 0.018 272)', borderColor: 'oklch(1 0 0 / 0.1)' }}>
        <button onClick={handleSkip} className="absolute top-4 right-5 text-sm tracking-[0.04em] transition-colors hover:opacity-70" style={{ color: 'oklch(0.56 0.008 310)' }}>
          跳过
        </button>

        <div className="flex justify-center gap-2 mb-10">
          {steps.map((_, i) => (
            <div key={i} className="h-[2px] rounded-full transition-all duration-400"
              style={{ width: i === step ? 24 : 8, background: i === step ? 'oklch(0.68 0.13 85)' : 'oklch(1 0 0 / 0.15)' }}
            />
          ))}
        </div>

        <div className="text-5xl mb-8 animate-float" style={{ color: 'oklch(0.68 0.13 85)' }}>
          {steps[step].emoji}
        </div>
        <h2 className="text-2xl tracking-[0.04em] mb-5" style={{ fontFamily: "'Noto Serif SC', Georgia, serif", fontWeight: 200, color: 'oklch(0.92 0.003 320)' }}>
          {steps[step].title}
        </h2>
        <p className="leading-relaxed mb-10 text-[15px]" style={{ color: 'oklch(0.56 0.008 310)' }}>
          {steps[step].description}
        </p>

        <button onClick={handleNext} className="btn px-10 py-3">
          {step < steps.length - 1 ? '下一步' : '开始探索'}
        </button>
      </div>
    </div>
  );
}
