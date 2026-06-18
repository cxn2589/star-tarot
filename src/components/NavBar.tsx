'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/tarot', label: '塔罗占卜' },
  { href: '/monthly', label: '每月运势' },
  { href: '/daily', label: '今日指引' },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="relative z-50 border-b border-white/[0.05]" style={{ background: 'oklch(0.10 0.025 265 / 0.92)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="tracking-[0.06em] text-lg transition-opacity hover:opacity-70" style={{ color: 'oklch(0.92 0.003 320)', fontFamily: "'Noto Serif SC', Georgia, serif", fontWeight: 200 }}>
          星辰之引
        </Link>

        <div className="flex gap-1">
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm transition-all duration-300 tracking-[0.04em]"
                style={{
                  color: isActive ? 'oklch(0.68 0.13 85)' : 'oklch(0.56 0.008 310)',
                  fontFamily: "'Noto Sans SC', system-ui, sans-serif",
                  fontWeight: isActive ? 400 : 300,
                  background: isActive ? 'oklch(0.15 0.015 270)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
