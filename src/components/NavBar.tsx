'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: '首页' },
  { href: '/tarot', label: '塔罗占卜' },
  { href: '/monthly', label: '每月运势' },
  { href: '/daily', label: '今日指引' },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="relative z-50 border-b" style={{ borderColor: 'rgba(201,168,76,0.2)', backgroundColor: 'rgba(10,10,18,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-wider hover:opacity-80 transition-opacity" style={{ color: '#c9a84c', fontFamily: "'Noto Serif SC', serif" }}>
          ✦ 星辰之引
        </Link>

        <div className="flex gap-1">
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                  isActive
                    ? 'text-[#c9a84c] bg-[rgba(30,15,60,0.6)] border border-[rgba(201,168,76,0.3)]'
                    : 'text-[#8a7fa0] hover:text-[#e0d8f0] hover:bg-[rgba(30,15,60,0.3)]'
                }`}
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
