'use client';

import { useState } from 'react';
import { ZODIAC_SIGNS } from '@/lib/tarot-data';
import { storage, getMonthlyHoroscopeKey, getMonthStr } from '@/lib/storage';
import ZodiacSignCard from '@/components/ZodiacSignCard';
import { ZodiacSign } from '@/types';

export default function MonthlyPage() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [interpretation, setInterpretation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSelectSign(signId: ZodiacSign) {
    setSelectedSign(signId);

    const cacheKey = getMonthlyHoroscopeKey(signId);
    const cached = storage.get<{ month: string; interpretation: string }>(cacheKey);
    if (cached && cached.month === getMonthStr()) {
      setInterpretation(cached.interpretation);
      return;
    }

    setIsLoading(true);
    setInterpretation('');

    try {
      const res = await fetch('/api/horoscope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sign: signId }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setInterpretation(data.interpretation);
      storage.set(cacheKey, { month: getMonthStr(), interpretation: data.interpretation });
    } catch (err) {
      console.error('Horoscope error:', err);
      setInterpretation('运势生成失败，请稍后重试 🌙');
    } finally {
      setIsLoading(false);
    }
  }

  const selectedZodiac = ZODIAC_SIGNS.find(z => z.id === selectedSign);
  const now = new Date();

  return (
    <main className="relative z-10 min-h-[calc(100vh-57px)] px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2" style={{ color: '#c9a84c', fontFamily: "'Noto Serif SC', serif" }}>
          🌙 每月星座运势
        </h1>
        <p className="text-center mb-10 text-sm" style={{ color: '#8a7fa0' }}>
          选择你的星座，获取{now.getFullYear()}年{now.getMonth() + 1}月专属运势
        </p>

        {!selectedSign && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {ZODIAC_SIGNS.map(zodiac => (
              <ZodiacSignCard
                key={zodiac.id}
                zodiac={zodiac}
                onClick={() => handleSelectSign(zodiac.id)}
              />
            ))}
          </div>
        )}

        {selectedSign && selectedZodiac && (
          <div style={{ animation: 'fadeIn 0.5s ease forwards' }}>
            <button
              onClick={() => setSelectedSign(null)}
              className="mb-6 text-sm transition-colors hover:text-white"
              style={{ color: '#8a7fa0' }}
            >
              ← 返回星座列表
            </button>

            <div className="glass-card p-8 text-center mb-6">
              <span className="text-6xl block mb-4">{selectedZodiac.emoji}</span>
              <h2 className="text-2xl font-bold" style={{ color: '#c9a84c', fontFamily: "'Noto Serif SC', serif" }}>
                {selectedZodiac.name}
              </h2>
              <p className="text-sm mt-1" style={{ color: '#8a7fa0' }}>
                {now.getFullYear()}年{now.getMonth() + 1}月 · 月度运势
              </p>
            </div>

            {isLoading ? (
              <div className="glass-card p-8 text-center">
                <div className="animate-pulse text-lg" style={{ color: '#c9a84c' }}>
                  ✦ 正在为你推演星象...
                </div>
              </div>
            ) : interpretation ? (
              <div className="glass-card p-8 leading-relaxed whitespace-pre-wrap" style={{ color: '#e0d8f0' }}>
                {interpretation}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
