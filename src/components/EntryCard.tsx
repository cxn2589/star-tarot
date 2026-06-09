import Link from 'next/link';

interface EntryCardProps {
  emoji: string;
  title: string;
  description: string;
  href: string;
}

export default function EntryCard({ emoji, title, description, href }: EntryCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="glass-card p-8 text-center cursor-pointer min-h-[220px] flex flex-col items-center justify-center gap-4">
        <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
          {emoji}
        </span>
        <h3 className="text-xl font-semibold transition-colors" style={{ color: '#c9a84c', fontFamily: "'Noto Serif SC', serif" }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: '#8a7fa0' }}>
          {description}
        </p>
        <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: 'rgba(201,168,76,0.5)' }}>
          点击进入 →
        </span>
      </div>
    </Link>
  );
}
