'use client';

import { useState } from 'react';
import ModeSelector from '@/components/ModeSelector';
import CardReveal from '@/components/CardReveal';
import TarotGuide from '@/components/TarotGuide';
import TarotResult from '@/components/TarotResult';
import { DrawMode, RevealedCard } from '@/types';

export default function TarotPage() {
  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState<DrawMode>('single');
  const [cards, setCards] = useState<RevealedCard[]>([]);
  const [showCards, setShowCards] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  async function handleDraw() {
    setIsLoading(true);
    setShowCards(false);
    setCards([]);
    setInterpretation('');
    setRevealedCount(0);
    setIsStreaming(false);

    try {
      const res = await fetch('/api/tarot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() || null, mode }),
      });

      if (!res.ok) throw new Error('API error');
      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let metaParsed = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const data = line.slice(5).trim();
          if (data === '[DONE]') {
            setIsStreaming(false);
            continue;
          }

          if (!metaParsed) {
            const meta = JSON.parse(data);
            setCards(meta.cards);
            setShowCards(true);
            metaParsed = true;
          } else {
            setInterpretation(prev => prev + data);
            setIsStreaming(true);
          }
        }
      }

      setIsStreaming(false);
    } catch (err) {
      console.error('Draw error:', err);
      setInterpretation('抱歉，抽牌解读出了点问题，请稍后重试 🌙');
    } finally {
      setIsLoading(false);
    }
  }

  function handleRevealed() {
    setRevealedCount(prev => prev + 1);
  }

  const allRevealed = revealedCount >= cards.length;
  const positionLabels = mode === 'three' ? ['过去', '现在', '未来'] : ['当下'];

  return (
    <main className="relative z-10 min-h-[calc(100vh-57px)] px-4 py-10">
      <TarotGuide />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2" style={{ color: '#c9a84c', fontFamily: "'Noto Serif SC', serif" }}>
          🔮 塔罗占卜
        </h1>
        <p className="text-center mb-8 text-sm" style={{ color: '#8a7fa0' }}>
          心中默念你的疑问，让塔罗牌为你指引
        </p>

        {/* 问题输入 */}
        <div id="question-area" className="max-w-md mx-auto mb-6">
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="写下你想问的事（可选）..."
            className="w-full rounded-xl px-5 py-3 placeholder:text-white/25 focus:outline-none transition-colors"
            style={{ backgroundColor: 'rgba(30,15,60,0.6)', border: '1px solid rgba(201,168,76,0.3)', color: '#e0d8f0' }}
            maxLength={200}
          />
        </div>

        {/* 模式选择 */}
        <div id="mode-area" className="mb-8">
          <ModeSelector mode={mode} onChange={setMode} />
        </div>

        {/* 抽牌按钮 */}
        <div id="draw-area" className="text-center mb-10">
          <button
            onClick={handleDraw}
            disabled={isLoading}
            className="px-10 py-4 font-bold text-lg rounded-full transition-all duration-300
                       hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#c9a84c', color: '#0a0a12', boxShadow: '0 0 15px rgba(201,168,76,0.3)' }}
          >
            {isLoading ? '抽取中...' : '✨ 开始抽牌'}
          </button>
        </div>

        {/* 牌面展示 */}
        {showCards && cards.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-8">
            {cards.map((card, i) => (
              <CardReveal
                key={i}
                imageSrc={card.image}
                name={card.name}
                position={card.position}
                isReversed={card.isReversed}
                label={positionLabels[i]}
                onRevealed={handleRevealed}
              />
            ))}
          </div>
        )}

        {/* AI 解读 */}
        {allRevealed && cards.length > 0 && (
          <TarotResult
            question={question.trim() || undefined}
            interpretation={interpretation}
            isStreaming={isStreaming}
          />
        )}
      </div>
    </main>
  );
}
