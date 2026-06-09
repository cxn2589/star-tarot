import type { Metadata } from 'next';
import './globals.css';
import StarfieldBg from '@/components/StarfieldBg';
import NavBar from '@/components/NavBar';
import OnboardingModal from '@/components/OnboardingModal';

export const metadata: Metadata = {
  title: '星辰之引 - AI 塔罗占卜 & 星座运势',
  description: '用塔罗与星象，探寻你的答案。AI 驱动的塔罗占卜、每月星座运势、每日塔罗指引。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        <StarfieldBg />
        <NavBar />
        <OnboardingModal />
        {children}
      </body>
    </html>
  );
}
