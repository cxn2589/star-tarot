'use client';
import { DrawMode } from '@/types';

export default function ModeSelector({ mode, onChange }: { mode: DrawMode; onChange: (m: DrawMode) => void }) {
  const base = { fontFamily: "'Noto Sans SC', system-ui, sans-serif", fontWeight: 400 };
  const active = { ...base, background: 'oklch(0.68 0.13 85)', color: 'oklch(0.10 0.025 265)' };
  const inactive = { ...base, background: 'oklch(0.15 0.015 270)', color: 'oklch(0.56 0.008 310)', border: '1px solid oklch(1 0 0 / 0.06)' };

  return (
    <div className="flex gap-3 justify-center">
      <button onClick={() => onChange('single')} className="px-6 py-3 rounded-full text-sm tracking-[0.04em] transition-all duration-300"
        style={mode === 'single' ? active : inactive}>
        单牌运势
      </button>
      <button onClick={() => onChange('three')} className="px-6 py-3 rounded-full text-sm tracking-[0.04em] transition-all duration-300"
        style={mode === 'three' ? active : inactive}>
        三牌解读
      </button>
    </div>
  );
}
