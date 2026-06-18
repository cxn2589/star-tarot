import EntryCard from '@/components/EntryCard';

// Decorative moon SVG
function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="28" fill="url(#moonGrad)" opacity="0.6" />
      <circle cx="32" cy="28" r="22" fill="url(#moonGrad2)" opacity="0.4" />
      <defs>
        <radialGradient id="moonGrad" cx="0.3" cy="0.3">
          <stop offset="0%" stopColor="#e8cc78" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#c9a050" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3d1a2e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moonGrad2" cx="0.4" cy="0.4">
          <stop offset="0%" stopColor="#f0d8a0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c9a050" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// Small sparkle SVG
function Sparkle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" fill="#e8cc78" opacity="0.6" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="relative z-10 min-h-[calc(100vh-57px)] flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
      {/* Decorative moon - top right */}
      <div className="absolute top-12 right-[15%] w-16 h-16 md:w-24 md:h-24 moon-glow animate-float opacity-60">
        <MoonIcon className="w-full h-full" />
      </div>

      {/* Decorative sparkles */}
      <Sparkle className="absolute top-1/4 left-[12%] w-3 h-3 animate-sparkle" style={{ animationDelay: '0s' }} />
      <Sparkle className="absolute top-[35%] right-[20%] w-4 h-4 animate-sparkle" style={{ animationDelay: '1.5s' }} />
      <Sparkle className="absolute bottom-[30%] left-[18%] w-2 h-2 animate-sparkle" style={{ animationDelay: '0.8s' }} />
      <Sparkle className="absolute bottom-[40%] right-[15%] w-3 h-3 animate-sparkle" style={{ animationDelay: '2.2s' }} />
      <Sparkle className="absolute top-[60%] left-[8%] w-2 h-2 animate-sparkle" style={{ animationDelay: '1.2s' }} />

      {/* Main content */}
      <div className="text-center mb-16 relative">
        <p className="text-xs tracking-[0.3em] mb-6 uppercase" style={{ color: 'oklch(0.68 0.15 80 / 0.7)', fontFamily: "'Noto Sans SC', system-ui, sans-serif" }}>
          塔罗占卜 · 星盘解析
        </p>

        <h1 className="text-4xl md:text-6xl tracking-[0.06em] mb-5 glow-text" style={{ fontFamily: "'Noto Serif SC', Georgia, serif", fontWeight: 300, color: 'oklch(0.94 0.005 320)', lineHeight: 1.3 }}>
          探索命运的指引
        </h1>

        <p className="text-base md:text-lg tracking-[0.08em] mb-10" style={{ color: 'oklch(0.60 0.012 310)', fontFamily: "'Noto Sans SC', system-ui, sans-serif", fontWeight: 300 }}>
          倾听宇宙的低语，发现内心的答案
        </p>

        <a href="/tarot" className="btn text-base px-12 py-4">
          开始占卜
        </a>
      </div>

      {/* Entry cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl w-full px-2">
        <EntryCard
          emoji="🔮"
          title="塔罗占卜"
          description="通过塔罗牌的神秘指引，发现当下的启示"
          href="/tarot"
        />
        <EntryCard
          emoji="✦"
          title="星盘分析"
          description="解读你的星象配置，了解天赋与性格"
          href="/monthly"
        />
        <EntryCard
          emoji="☀️"
          title="每日运势"
          description="获取专属运势指引，把握每日能量"
          href="/daily"
        />
      </div>

      <p className="mt-20 text-xs tracking-[0.1em]" style={{ color: 'oklch(0.60 0.012 310 / 0.5)', fontFamily: "'Noto Sans SC', system-ui, sans-serif", fontWeight: 300 }}>
        AI 生成内容仅供参考
      </p>
    </main>
  );
}
