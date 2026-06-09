'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

const steps = [
  {
    emoji: '✨',
    title: '欢迎来到星辰之引',
    description: '在这里，塔罗牌与星象交织，AI 将为你解读命运的低语。',
  },
  {
    emoji: '🔮',
    title: '塔罗占卜',
    description: '心中默念问题，抽取一张或三张牌，让塔罗为你指引方向。',
  },
  {
    emoji: '🌙',
    title: '星象相伴',
    description: '每月星座运势 + 每日塔罗指引，让宇宙的能量陪你度过每一天。',
  },
];

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const visited = storage.get<boolean>('hasVisited');
    if (!visited) {
      setVisible(true);
    }
  }, []);

  function handleSkip() {
    storage.set('hasVisited', true);
    setVisible(false);
  }

  function handleNext() {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      storage.set('hasVisited', true);
      setVisible(false);
    }
  }

  if (!visible) return null;

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="glass-card max-w-md w-full mx-4 p-10 text-center relative" style={{ animation: 'fadeIn 0.5s ease forwards' }}>
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-sm transition-colors"
          style={{ color: '#8a7fa0' }}
        >
          跳过
        </button>

        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-6' : 'w-2'
              }`}
              style={{ backgroundColor: i === step ? '#c9a84c' : 'rgba(201,168,76,0.3)' }}
            />
          ))}
        </div>

        <div className="text-6xl mb-6" style={{ animation: 'float 6s ease-in-out infinite' }}>{current.emoji}</div>
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#c9a84c', fontFamily: "'Noto Serif SC', serif" }}>
          {current.title}
        </h2>
        <p className="leading-relaxed mb-8" style={{ color: '#e0d8f0' }}>
          {current.description}
        </p>

        <button
          onClick={handleNext}
          className="px-8 py-3 font-semibold rounded-full transition-all duration-300 hover:shadow-lg"
          style={{ backgroundColor: '#c9a84c', color: '#0a0a12' }}
        >
          {step < steps.length - 1 ? '下一步' : '开始探索'}
        </button>
      </div>
    </div>
  );
}
