'use client';

import { useState } from 'react';
import ModeSelector from '@/components/ModeSelector';
import CardReveal from '@/components/CardReveal';
import TarotGuide from '@/components/TarotGuide';
import TarotResult from '@/components/TarotResult';
import { DrawMode, RevealedCard } from '@/types';

// Sparkle decoration
function Sparkle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" fill="#c9a050" opacity="0.5" />
    </svg>
  );
}

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
      if (!res.ok || !res.body) throw new Error('API error');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '', metaParsed = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const data = line.slice(5).trim();
          if (data === '[DONE]') { setIsStreaming(false); continue; }
          if (!metaParsed) { setCards(JSON.parse(data).cards); setShowCards(true); metaParsed = true; }
          else { setInterpretation(p => p + data); setIsStreaming(true); }
        }
      }
      setIsStreaming(false);
    } catch (err) {
      console.error(err);
      setInterpretation('抱歉，解读出了点问题，请稍后重试。');
    } finally { setIsLoading(false); }
  }

  const allRevealed = revealedCount >= cards.length;
  const positionLabels = mode === 'three' ? ['过去', '现在', '未来'] : ['当下'];

  return (
    <main className="relative z-10 min-h-[calc(100vh-57px)] px-6 py-12 overflow-hidden">
      <TarotGuide />

      {/* Decorative sparkles */}
      <Sparkle className="absolute top-20 right-[10%] w-3 h-3 animate-sparkle" />
      <Sparkle className="absolute bottom-40 left-[8%] w-2 h-2 animate-sparkle" style={{ animationDelay: '1.2s' }} />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl mb-3 tracking-[0.06em]" style={{ fontFamily: "'Noto Serif SC', Georgia, serif", fontWeight: 300, color: 'oklch(0.94 0.005 320)' }}>
            塔罗占卜
          </h1>
          <p className="text-sm tracking-[0.06em]" style={{ color: 'oklch(0.60 0.012 310)' }}>
            专注内心，提出你的问题，塔罗牌将为你指引方向
          </p>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <input type="text" value={question} onChange={e => setQuestion(e.target.value)} placeholder="请在这里输入你的问题..." className="input" maxLength={200} />
        </div>

        <div className="mb-10">
          <ModeSelector mode={mode} onChange={setMode} />
        </div>

        <div className="text-center mb-14">
          <button onClick={handleDraw} disabled={isLoading} className="btn px-14 py-4 text-base">
            {isLoading ? '抽取中...' : '开始抽牌'}
          </button>
        </div>

        {/* Card display area */}
        {showCards && cards.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-12">
            {cards.map((card, i) => (
              <CardReveal key={i} imageSrc={card.image} name={card.name} position={card.position} isReversed={card.isReversed} label={positionLabels[i]} onRevealed={() => setRevealedCount(p => p + 1)} />
            ))}
          </div>
        ) : (
          /* Placeholder card backs when not yet drawn */
          <div className="flex justify-center gap-6 md:gap-10 mb-12 opacity-40">
            {Array.from({ length: mode === 'three' ? 3 : 1 }).map((_, i) => (
              <div key={i} className="w-[170px] h-[280px] md:w-[200px] md:h-[330px] rounded-[12px] flex items-center justify-center"
                style={{ background: 'oklch(0.12 0.015 300)', border: '1px solid oklch(0.55 0.10 300 / 0.3)' }}
              >
                <span className="text-2xl">🔮</span>
              </div>
            ))}
          </div>
        )}

        {!showCards && (
          <p className="text-center text-sm tracking-[0.06em]" style={{ color: 'oklch(0.60 0.012 310 / 0.6)' }}>
            抽牌结果将会在这里显示
          </p>
        )}

        {allRevealed && cards.length > 0 && (
          <TarotResult question={question.trim() || undefined} interpretation={interpretation} isStreaming={isStreaming} />
        )}
      </div>
    </main>
  );
}
