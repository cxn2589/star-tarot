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
      <div className="card p-10 flex flex-col items-center text-center gap-5 min-h-[240px] cursor-pointer">
        <span className="text-4xl transition-transform duration-500 group-hover:scale-105">
          {emoji}
        </span>
        <h3 className="text-xl tracking-[0.04em]" style={{ fontFamily: "'Noto Serif SC', Georgia, serif", fontWeight: 400, color: 'oklch(0.92 0.003 320)' }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.56 0.008 310)' }}>
          {description}
        </p>
        <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500 tracking-[0.06em]" style={{ color: 'oklch(0.68 0.13 85)' }}>
          进入 →
        </span>
      </div>
    </Link>
  );
}
