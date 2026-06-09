'use client';
import { DrawMode } from '@/types';

interface ModeSelectorProps {
  mode: DrawMode;
  onChange: (mode: DrawMode) => void;
}

export default function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-3 justify-center">
      <button
        onClick={() => onChange('single')}
        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
          mode === 'single'
            ? 'text-[#0a0a12] shadow-lg'
            : 'glass-card'
        }`}
        style={mode === 'single' ? { backgroundColor: '#c9a84c', boxShadow: '0 0 20px rgba(201,168,76,0.2)' } : { color: '#8a7fa0' }}
      >
        🔮 单牌运势
      </button>
      <button
        onClick={() => onChange('three')}
        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
          mode === 'three'
            ? 'text-[#0a0a12] shadow-lg'
            : 'glass-card'
        }`}
        style={mode === 'three' ? { backgroundColor: '#c9a84c', boxShadow: '0 0 20px rgba(201,168,76,0.2)' } : { color: '#8a7fa0' }}
      >
        ✨ 三牌解读
      </button>
    </div>
  );
}
