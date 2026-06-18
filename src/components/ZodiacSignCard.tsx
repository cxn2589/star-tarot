'use client';
import { ZodiacInfo } from '@/types';

export default function ZodiacSignCard({ zodiac, onClick }: { zodiac: ZodiacInfo; onClick: () => void }) {
  return (
    <button onClick={onClick} className="card p-6 text-center group cursor-pointer">
      <span className="text-3xl block mb-3 transition-transform duration-500 group-hover:scale-105">{zodiac.emoji}</span>
      <h3 className="text-sm tracking-[0.04em] mb-1" style={{ fontFamily: "'Noto Serif SC', Georgia, serif", fontWeight: 400, color: 'oklch(0.92 0.003 320)' }}>
        {zodiac.name}
      </h3>
      <p className="text-xs" style={{ color: 'oklch(0.56 0.008 310)' }}>{zodiac.dateRange}</p>
      <span className="text-[10px] tracking-[0.06em] mt-1 inline-block" style={{ color: 'oklch(0.68 0.13 85 / 0.5)' }}>{zodiac.element}象</span>
    </button>
  );
}
