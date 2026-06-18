interface Props { question?: string; interpretation: string; isStreaming: boolean; }

export default function TarotResult({ question, interpretation, isStreaming }: Props) {
  if (!interpretation && !isStreaming) return null;

  return (
    <div className="card max-w-2xl w-full mx-auto mt-12 p-8 md:p-10 animate-fade-in">
      {question && (
        <div className="mb-6 pb-6" style={{ borderBottom: '1px solid oklch(1 0 0 / 0.06)' }}>
          <span className="text-xs tracking-[0.08em] uppercase" style={{ color: 'oklch(0.56 0.008 310)', fontFamily: "'Noto Sans SC', system-ui, sans-serif", fontWeight: 400 }}>你的问题</span>
          <p className="mt-3 text-lg leading-relaxed italic" style={{ color: 'oklch(0.92 0.003 320)' }}>「{question}」</p>
        </div>
      )}

      <h3 className="text-lg tracking-[0.04em] mb-6" style={{ fontFamily: "'Noto Serif SC', Georgia, serif", fontWeight: 400, color: 'oklch(0.68 0.13 85)' }}>
        解读
      </h3>

      <div className="text-[15px] leading-[1.9] whitespace-pre-wrap" style={{ color: 'oklch(0.92 0.003 320)', fontFamily: "'Noto Sans SC', system-ui, sans-serif", fontWeight: 300 }}>
        {interpretation}
        {isStreaming && <span className="stream-cursor" />}
      </div>
    </div>
  );
}
