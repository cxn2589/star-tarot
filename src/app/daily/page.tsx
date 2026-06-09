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
    if (cached && cached.date === getTodayStr()) {
      setData(cached);
      setRevealed(true);
    }
  }, []);

  async function handleDraw() {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!res.ok) throw new Error('API error');
      const result = await res.json();

      const dailyData: DailyTarotData = { ...result, date: getTodayStr() };
      setData(dailyData);
      storage.set(getDailyTarotKey(), dailyData);
    } catch (err) {
      console.error('Daily error:', err);
      setError('获取今日指引失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }

  const alreadyDrawn = data && data.date === getTodayStr();

  return (
    <main className="relative z-10 min-h-[calc(100vh-57px)] px-4 py-10 flex flex-col items-center">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#c9a84c', fontFamily: "'Noto Serif SC', serif" }}>
          ☀️ 今日指引
        </h1>
        <p className="mb-10 text-sm" style={{ color: '#8a7fa0' }}>
          每天一张牌，让塔罗给予你今日的心灵指引
        </p>

        {!alreadyDrawn && !isLoading && (
          <div className="glass-card p-10 text-center mb-8">
            <div className="text-6xl mb-6" style={{ animation: 'float 6s ease-in-out infinite' }}>🃏</div>
            <p className="mb-6 leading-relaxed" style={{ color: '#e0d8f0' }}>
              今天尚未抽取指引牌<br />静心片刻，感受今日的能量
            </p>
            <button
              onClick={handleDraw}
              className="px-8 py-3 font-semibold rounded-full transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: '#c9a84c', color: '#0a0a12' }}
            >
              ✨ 抽取今日指引
            </button>
          </div>
        )}

        {isLoading && (
          <div className="glass-card p-10 text-center">
            <div className="animate-pulse text-lg" style={{ color: '#c9a84c' }}>✦ 牌面正在显现...</div>
          </div>
        )}

        {alreadyDrawn && data && (
          <div style={{ animation: 'fadeIn 0.5s ease forwards' }}>
            <div className="flex justify-center mb-6">
              <CardReveal
                imageSrc={data.card.image}
                name={data.card.name}
                position={data.card.position}
                isReversed={data.card.isReversed}
                onRevealed={() => setRevealed(true)}
              />
            </div>

            {revealed && (
              <div className="glass-card p-8 text-left mt-6">
                <div className="text-xs mb-2" style={{ color: '#8a7fa0' }}>
                  {data.date} · 今日指引
                </div>
                <div className="leading-relaxed whitespace-pre-wrap" style={{ color: '#e0d8f0' }}>
                  {data.interpretation}
                </div>
                <div className="mt-6 pt-4 border-t text-center" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
                  <p className="text-xs" style={{ color: '#8a7fa0' }}>✦ 明天再来，获取新的指引 ✦</p>
                </div>
              </div>
            )}
          </div>
        )}

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>
    </main>
  );
}
