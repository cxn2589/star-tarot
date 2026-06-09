'use client';

import { ZodiacInfo } from '@/types';

interface ZodiacSignCardProps {
  zodiac: ZodiacInfo;
  onClick: () => void;
}

export default function ZodiacSignCard({ zodiac, onClick }: ZodiacSignCardProps) {
  return (
    <button
      onClick={onClick}
      className="glass-card p-6 text-center group"
    >
      <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">
        {zodiac.emoji}
      </span>
      <h3 className="font-semibold mb-1" style={{ color: '#c9a84c', fontFamily: "'Noto Serif SC', serif" }}>{zodiac.name}</h3>
      <p className="text-xs" style={{ color: '#8a7fa0' }}>{zodiac.dateRange}</p>
      <span className="text-xs mt-1 inline-block" style={{ color: 'rgba(201,168,76,0.4)' }}>{zodiac.element}象星座</span>
    </button>
  );
}
