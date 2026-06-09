import EntryCard from '@/components/EntryCard';

export default function HomePage() {
  return (
    <main className="relative z-10 min-h-[calc(100vh-57px)] flex flex-col items-center justify-center px-4 py-16">
      {/* 品牌区域 */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black tracking-widest mb-4 text-glow" style={{ color: '#c9a84c', fontFamily: "'Noto Serif SC', serif" }}>
          星辰之引
        </h1>
        <p className="text-lg md:text-xl font-light tracking-wider" style={{ color: '#8a7fa0' }}>
          用塔罗与星象，探寻你的答案
        </p>
        <div className="mt-6 w-24 h-px mx-auto" style={{ background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)' }} />
      </div>

      {/* 入口卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <EntryCard
          emoji="🔮"
          title="塔罗占卜"
          description="心中默念问题，抽取牌面，AI 为你解读命运的答案"
          href="/tarot"
        />
        <EntryCard
          emoji="🌙"
          title="每月运势"
          description="选择你的星座，获取本月专属运势解读"
          href="/monthly"
        />
        <EntryCard
          emoji="☀️"
          title="今日指引"
          description="每天一张牌，让塔罗给予你今日的心灵指引"
          href="/daily"
        />
      </div>

      {/* 底部 */}
      <p className="mt-16 text-xs tracking-wider" style={{ color: 'rgba(138,127,160,0.5)' }}>
        ✦ AI 生成内容仅供参考，请理性看待 ✦
      </p>
    </main>
  );
}
