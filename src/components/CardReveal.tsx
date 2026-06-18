'use client';

import { useState } from 'react';
import { getRandomCardBack } from '@/lib/tarot-data';

interface Props {
  imageSrc: string;
  name: string;
  position: string;
  isReversed: boolean;
  label?: string;
  onRevealed?: () => void;
}

export default function CardReveal({ imageSrc, name, position, isReversed, label, onRevealed }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [cardBack] = useState(() => getRandomCardBack());

  function handleFlip() {
    if (flipped) return;
    setFlipped(true);
    onRevealed?.();
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {label && (
        <span className="text-xs tracking-[0.1em] uppercase" style={{ color: 'oklch(0.56 0.008 310)', fontFamily: "'Noto Sans SC', system-ui, sans-serif", fontWeight: 400 }}>
          {label}
        </span>
      )}

      <div className="card-flip w-[170px] h-[280px] md:w-[200px] md:h-[330px] cursor-pointer" onClick={handleFlip}>
        <div className={`card-flip-inner ${flipped ? 'flipped' : ''}`}>
          <div className="card-back">
            <img src={`/cards/${cardBack}`} alt="牌背" className="w-full h-full object-cover rounded-[10px]" />
            {!flipped && (
              <div className="absolute inset-0 flex items-center justify-center rounded-[10px]" style={{ background: 'oklch(0 0 0 / 0.2)' }}>
                <span className="text-xs tracking-[0.1em]" style={{ color: 'oklch(0.68 0.13 85 / 0.7)' }}>翻开</span>
              </div>
            )}
          </div>
          <div className="card-front">
            <img src={imageSrc} alt={name} className={`w-full h-full object-cover rounded-[10px] ${isReversed ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>

      {flipped && (
        <div className="text-center animate-fade-in">
          <p className="text-base tracking-[0.04em]" style={{ fontFamily: "'Noto Serif SC', Georgia, serif", fontWeight: 400, color: 'oklch(0.92 0.003 320)' }}>
            {name}
          </p>
          <p className="text-xs mt-1 tracking-[0.04em]" style={{ color: isReversed ? 'oklch(0.72 0.10 80)' : 'oklch(0.72 0.12 155)', fontFamily: "'Noto Sans SC', system-ui, sans-serif" }}>
            {position}
          </p>
        </div>
      )}
    </div>
  );
}
