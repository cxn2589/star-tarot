'use client';

interface TarotResultProps {
  question?: string;
  interpretation: string;
  isStreaming: boolean;
}

export default function TarotResult({ question, interpretation, isStreaming }: TarotResultProps) {
  if (!interpretation && !isStreaming) return null;

  return (
    <div className="glass-card p-6 md:p-8 max-w-2xl w-full mx-auto mt-8">
      {question && (
        <div className="mb-4 pb-4 border-b" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
          <span className="text-xs" style={{ color: '#8a7fa0' }}>你的问题</span>
          <p className="mt-1 italic" style={{ color: '#e0d8f0' }}>「{question}」</p>
        </div>
      )}

      <h3 className="text-lg font-semibold mb-4" style={{ color: '#c9a84c', fontFamily: "'Noto Serif SC', serif" }}>
        ✦ AI 解读
      </h3>

      <div className="leading-relaxed whitespace-pre-wrap" style={{ color: '#e0d8f0' }}>
        {interpretation}
        {isStreaming && (
          <span className="inline-block w-2 h-4 ml-1 animate-pulse" style={{ backgroundColor: '#c9a84c' }} />
        )}
      </div>
    </div>
  );
}
