'use client';

import { useState } from 'react';
import { getRandomCardBack } from '@/lib/tarot-data';

interface CardRevealProps {
  imageSrc: string;
  name: string;
  position: string;
  isReversed: boolean;
  label?: string;
  onRevealed?: () => void;
}

export default function CardReveal({ imageSrc, name, position, isReversed, label, onRevealed }: CardRevealProps) {
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
        <span className="text-xs tracking-widest uppercase" style={{ color: '#8a7fa0' }}>{label}</span>
      )}

      <div
        className="card-flip w-[180px] h-[300px] md:w-[200px] md:h-[340px] cursor-pointer"
        onClick={handleFlip}
      >
        <div className={`card-flip-inner ${flipped ? 'flipped' : ''}`}>
          {/* 背面 */}
          <div className="card-back">
            <img
              src={`/cards/${cardBack}`}
              alt="塔罗牌背面"
              className="w-full h-full object-cover rounded-xl"
              style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}
            />
            {!flipped && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                <span className="text-sm animate-pulse" style={{ color: 'rgba(201,168,76,0.7)' }}>点击翻开</span>
              </div>
            )}
          </div>

          {/* 正面 */}
          <div className="card-front">
            <img
              src={imageSrc}
              alt={name}
              className={`w-full h-full object-cover rounded-xl ${isReversed ? 'rotate-180' : ''}`}
              style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}
            />
          </div>
        </div>
      </div>

      {flipped && (
        <div className="text-center" style={{ animation: 'fadeIn 0.5s ease forwards' }}>
          <p className="font-semibold" style={{ color: '#c9a84c', fontFamily: "'Noto Serif SC', serif" }}>{name}</p>
          <p className="text-sm" style={{ color: isReversed ? 'rgba(252,165,165,0.8)' : 'rgba(134,239,172,0.8)' }}>
            {position}
          </p>
        </div>
      )}
    </div>
  );
}
