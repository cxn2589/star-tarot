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
    if (cached && cached.month === getMonthStr()) { setInterpretation(cached.interpretation); return; }

    setIsLoading(true); setInterpretation('');
    try {
      const res = await fetch('/api/horoscope', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sign: signId }) });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setInterpretation(data.interpretation);
      storage.set(cacheKey, { month: getMonthStr(), interpretation: data.interpretation });
    } catch { setInterpretation('运势生成失败，请稍后重试。'); }
    finally { setIsLoading(false); }
  }

  const selectedZodiac = ZODIAC_SIGNS.find(z => z.id === selectedSign);
  const now = new Date();

  return (
    <main className="relative z-10 min-h-[calc(100vh-57px)] px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl text-center mb-3 tracking-[0.06em]" style={{ fontFamily: "'Noto Serif SC', Georgia, serif", fontWeight: 200, color: 'oklch(0.92 0.003 320)' }}>
          每月星座运势
        </h1>
        <p className="text-center mb-14 text-sm tracking-[0.06em]" style={{ color: 'oklch(0.56 0.008 310)' }}>
          {now.getFullYear()}年{now.getMonth() + 1}月 · 选择你的星座
        </p>

        {!selectedSign && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {ZODIAC_SIGNS.map(z => (<ZodiacSignCard key={z.id} zodiac={z} onClick={() => handleSelectSign(z.id)} />))}
          </div>
        )}

        {selectedSign && selectedZodiac && (
          <div className="animate-fade-in">
            <button onClick={() => setSelectedSign(null)} className="mb-8 text-sm tracking-[0.06em] hover:opacity-70 transition-opacity" style={{ color: 'oklch(0.56 0.008 310)' }}>
              ← 返回星座列表
            </button>
            <div className="card p-10 text-center mb-8">
              <span className="text-5xl block mb-5">{selectedZodiac.emoji}</span>
              <h2 className="text-2xl tracking-[0.04em] mb-2" style={{ fontFamily: "'Noto Serif SC', Georgia, serif", fontWeight: 200, color: 'oklch(0.92 0.003 320)' }}>
                {selectedZodiac.name}
              </h2>
              <p className="text-sm tracking-[0.04em]" style={{ color: 'oklch(0.56 0.008 310)' }}>
                {now.getFullYear()}年{now.getMonth() + 1}月 · 月度运势
              </p>
            </div>
            {isLoading ? (
              <div className="card p-12 text-center"><p className="text-sm tracking-[0.06em]" style={{ color: 'oklch(0.68 0.13 85)' }}>正在推演星象...</p></div>
            ) : interpretation ? (
              <div className="card p-8 md:p-10 text-[15px] leading-[1.9] whitespace-pre-wrap" style={{ color: 'oklch(0.92 0.003 320)' }}>
                {interpretation}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
