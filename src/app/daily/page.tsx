'use client';

import { useState, useEffect } from 'react';
import { storage, getDailyTarotKey, getTodayStr } from '@/lib/storage';
import CardReveal from '@/components/CardReveal';
import { DailyTarotData } from '@/types';

export default function DailyPage() {
  const [data, setData] = useState<DailyTarotData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cached = storage.get<DailyTarotData>(getDailyTarotKey());
    if (cached && cached.date === getTodayStr()) { setData(cached); setRevealed(true); }
  }, []);

  async function handleDraw() {
    setIsLoading(true); setError('');
    try {
      const res = await fetch('/api/daily', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      if (!res.ok) throw new Error('API error');
      const result = await res.json();
      const dailyData: DailyTarotData = { ...result, date: getTodayStr() };
      setData(dailyData);
      storage.set(getDailyTarotKey(), dailyData);
    } catch { setError('获取今日指引失败，请稍后重试'); }
    finally { setIsLoading(false); }
  }

  const alreadyDrawn = data && data.date === getTodayStr();

  return (
    <main className="relative z-10 min-h-[calc(100vh-57px)] px-6 py-12 flex flex-col items-center">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-3xl md:text-4xl mb-3 tracking-[0.06em]" style={{ fontFamily: "'Noto Serif SC', Georgia, serif", fontWeight: 200, color: 'oklch(0.92 0.003 320)' }}>
          今日指引
        </h1>
        <p className="mb-14 text-sm tracking-[0.06em]" style={{ color: 'oklch(0.56 0.008 310)' }}>
          每天一张牌，给予今日心灵指引
        </p>

        {!alreadyDrawn && !isLoading && (
          <div className="card p-12 text-center mb-8">
            <div className="text-5xl mb-10 animate-float">🃏</div>
            <p className="mb-10 text-[15px] leading-relaxed" style={{ color: 'oklch(0.56 0.008 310)' }}>
              今天尚未抽取指引牌<br />静心片刻，感受今日的能量
            </p>
            <button onClick={handleDraw} className="btn px-10 py-4">抽取今日指引</button>
          </div>
        )}

        {isLoading && (
          <div className="card p-12 text-center"><p className="text-sm tracking-[0.06em]" style={{ color: 'oklch(0.68 0.13 85)' }}>牌面正在显现...</p></div>
        )}

        {alreadyDrawn && data && (
          <div className="animate-fade-in">
            <div className="flex justify-center mb-10">
              <CardReveal imageSrc={data.card.image} name={data.card.name} position={data.card.position} isReversed={data.card.isReversed} onRevealed={() => setRevealed(true)} />
            </div>
            {revealed && (
              <div className="card p-8 md:p-10 text-left">
                <div className="text-xs tracking-[0.1em] mb-4" style={{ color: 'oklch(0.56 0.008 310)' }}>{data.date} · 今日指引</div>
                <div className="text-[15px] leading-[1.9] whitespace-pre-wrap" style={{ color: 'oklch(0.92 0.003 320)' }}>{data.interpretation}</div>
                <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid oklch(1 0 0 / 0.06)' }}>
                  <p className="text-xs tracking-[0.08em]" style={{ color: 'oklch(0.56 0.008 310)' }}>明天再来，获取新的指引</p>
                </div>
              </div>
            )}
          </div>
        )}

        {error && <p className="text-sm mt-4" style={{ color: 'oklch(0.72 0.10 80)' }}>{error}</p>}
      </div>
    </main>
  );
}
