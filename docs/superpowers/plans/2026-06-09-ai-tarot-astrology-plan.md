# AI 塔罗占卜 + 轻量占星 网站实现计划

> **For agentic workers:** 本计划按子任务逐步执行。Steps 使用 checkbox (`- [ ]`) 跟踪进度。

**Goal:** 从零搭建「星辰之引」— AI 塔罗占卜 + 每月星座运势 + 每日塔罗指引的全栈网站

**Architecture:** Next.js App Router 全栈模式，前端 React 组件 + Tailwind CSS 暗黑风格，后端 API Routes 封装 DeepSeek 调用，localStorage 做客户端数据持久化

**Tech Stack:** Next.js 14+ App Router, TypeScript, Tailwind CSS, DeepSeek API (OpenAI 兼容)

---

## File Structure Plan

```
c:\Users\25896\Desktop\project\
├── .env.local                          # DEEPSEEK_API_KEY
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── public/
│   └── cards/                          # 78张牌面 + 2张背面 (复制自 E:\taluo)
│       ├── 00愚者.jpg ... 21世界.jpg
│       ├── 圣杯ACE.jpg ... 圣杯国王.jpg
│       ├── 宝剑ACE.jpg ... 宝剑国王.jpg
│       ├── 星币ACE.jpg ... 星币国王.jpg
│       ├── 权杖ACE.jpg ... 权杖国王.jpg
│       ├── 背面A.jpg
│       └── 背面B.jpg
└── src/
    ├── app/
    │   ├── globals.css                 # 全局样式：暗黑主题 + 自定义CSS变量
    │   ├── layout.tsx                  # RootLayout：StarfieldBg + NavBar + OnboardingModal
    │   ├── page.tsx                    # 首页：品牌标题 + 3入口卡片
    │   ├── tarot/
    │   │   └── page.tsx                # 塔罗占卜页（单牌/三牌）
    │   ├── monthly/
    │   │   └── page.tsx                # 每月星座运势
    │   ├── daily/
    │   │   └── page.tsx                # 今日塔罗指引
    │   └── api/
    │       ├── tarot/
    │       │   └── route.ts            # POST: 抽牌 + DeepSeek解读(SSE流式)
    │       ├── horoscope/
    │       │   └── route.ts            # POST: 星座月度运势(SSE流式)
    │       └── daily/
    │           └── route.ts            # POST: 每日塔罗抽牌
    ├── components/
    │   ├── StarfieldBg.tsx             # Canvas星空粒子背景
    │   ├── NavBar.tsx                  # 顶部导航栏
    │   ├── EntryCard.tsx               # 首页入口卡片
    │   ├── OnboardingModal.tsx         # 全站首次欢迎弹窗（3步）
    │   ├── TarotGuide.tsx              # 塔罗页新手步骤引导（3步）
    │   ├── CardReveal.tsx              # 单张牌翻转动画组件
    │   ├── TarotResult.tsx             # 塔罗解读结果展示
    │   ├── ZodiacSignCard.tsx          # 单个星座卡片
    │   └── ModeSelector.tsx            # 单牌/三牌模式选择器
    ├── lib/
    │   ├── deepseek.ts                 # DeepSeek API 封装（服务端）
    │   ├── tarot-data.ts               # 78张牌数据 + 抽牌逻辑
    │   └── storage.ts                  # localStorage 读写工具
    └── types/
        └── index.ts                    # 全局类型定义
```

---

### Task 1: 项目初始化 + 依赖安装

**Files:**
- Create: all project scaffold files

- [ ] **Step 1: 创建 Next.js 项目**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

- [ ] **Step 2: 安装额外依赖**

```bash
npm install openai
```

> `openai` SDK 用于调用 DeepSeek API（OpenAI 兼容格式）

- [ ] **Step 3: 配置 tailwind.config.ts**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mystic: {
          bg: '#0a0a12',
          dark: '#1a0a2e',
          gold: '#c9a84c',
          'gold-light': '#e0c878',
          card: 'rgba(30, 15, 60, 0.6)',
          border: 'rgba(201, 168, 76, 0.3)',
          text: '#e0d8f0',
          muted: '#8a7fa0',
        },
      },
      fontFamily: {
        title: ['"Noto Serif SC"', 'serif'],
        body: ['"Noto Sans SC"', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'twinkle': 'twinkle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(201, 168, 76, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(201, 168, 76, 0.6)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 4: 写入全局样式 globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Serif+SC:wght@400;600;700;900&display=swap');

:root {
  --bg-primary: #0a0a12;
  --bg-secondary: #1a0a2e;
  --gold: #c9a84c;
  --gold-light: #e0c878;
  --card-bg: rgba(30, 15, 60, 0.6);
  --card-border: rgba(201, 168, 76, 0.3);
  --text-primary: #e0d8f0;
  --text-muted: #8a7fa0;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, #0d0d1a 100%);
  color: var(--text-primary);
  font-family: 'Noto Sans SC', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Glass card effect */
.glass-card {
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.glass-card:hover {
  border-color: var(--gold);
  box-shadow: 0 0 30px rgba(201, 168, 76, 0.15);
  transform: translateY(-4px);
}

/* Text glow */
.text-glow {
  text-shadow: 0 0 20px rgba(201, 168, 76, 0.5);
}

/* Card flip animation */
.card-flip {
  perspective: 1000px;
}

.card-flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s ease;
  transform-style: preserve-3d;
}

.card-flip-inner.flipped {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
}

.card-front {
  transform: rotateY(180deg);
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg-primary);
}
::-webkit-scrollbar-thumb {
  background: var(--gold);
  border-radius: 3px;
}

/* Stream text fade-in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.stream-line {
  animation: fadeIn 0.3s ease forwards;
}
```

- [ ] **Step 5: 创建 .env.local**

```bash
# 在项目根目录创建 .env.local，内容：
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

- [ ] **Step 6: 验证项目运行**

```bash
npm run dev
```

打开 http://localhost:3000 确认 Next.js 默认页面正常显示。

---

### Task 2: 类型定义 + 塔罗牌数据

**Files:**
- Create: `src/types/index.ts`
- Create: `src/lib/tarot-data.ts`

- [ ] **Step 1: 编写类型定义**

```typescript
// src/types/index.ts

export interface TarotCardData {
  id: number;
  name: string;
  nameEn: string;
  type: 'major' | 'minor';
  suit?: 'cups' | 'swords' | 'pentacles' | 'wands';
  fileName: string;
  description: string;  // 一句话牌义
}

export type DrawMode = 'single' | 'three';

export interface DrawnCard {
  card: TarotCardData;
  isReversed: boolean;
}

export interface TarotDrawResult {
  cards: DrawnCard[];
  mode: DrawMode;
  question?: string;
}

export type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export interface ZodiacInfo {
  id: ZodiacSign;
  name: string;
  emoji: string;
  dateRange: string;
  element: string;
}

export interface DailyTarotData {
  date: string;
  card: DrawnCard;
  interpretation: string;
}
```

- [ ] **Step 2: 编写 78 张塔罗牌数据**

```typescript
// src/lib/tarot-data.ts
import { TarotCardData } from '@/types';

// 22 张大阿卡纳
const majorArcana: TarotCardData[] = [
  { id: 0, name: '愚者', nameEn: 'The Fool', type: 'major', fileName: '00愚者.jpg', description: '新的开始，冒险与天真' },
  { id: 1, name: '魔术师', nameEn: 'The Magician', type: 'major', fileName: '01魔术师.jpg', description: '创造力，技能与意志力' },
  { id: 2, name: '女祭祀', nameEn: 'The High Priestess', type: 'major', fileName: '02女祭祀.jpg', description: '直觉，神秘与潜意识' },
  { id: 3, name: '皇后', nameEn: 'The Empress', type: 'major', fileName: '03皇后.jpg', description: '丰饶，母爱与自然' },
  { id: 4, name: '皇帝', nameEn: 'The Emperor', type: 'major', fileName: '04皇帝.jpg', description: '权威，结构与稳定' },
  { id: 5, name: '教皇', nameEn: 'The Hierophant', type: 'major', fileName: '05教皇.jpg', description: '传统，信仰与教导' },
  { id: 6, name: '恋人', nameEn: 'The Lovers', type: 'major', fileName: '06恋人.jpg', description: '爱情，选择与和谐' },
  { id: 7, name: '战车', nameEn: 'The Chariot', type: 'major', fileName: '07战车.jpg', description: '胜利，意志力与前进' },
  { id: 8, name: '力量', nameEn: 'Strength', type: 'major', fileName: '08力量.jpg', description: '勇气，耐心与内在力量' },
  { id: 9, name: '隐士', nameEn: 'The Hermit', type: 'major', fileName: '09隐士.jpg', description: '内省，孤独与智慧' },
  { id: 10, name: '命运之轮', nameEn: 'Wheel of Fortune', type: 'major', fileName: '10命运之轮.jpg', description: '命运转折，循环与机遇' },
  { id: 11, name: '正义', nameEn: 'Justice', type: 'major', fileName: '11正义.jpg', description: '公正，真理与因果' },
  { id: 12, name: '倒吊人', nameEn: 'The Hanged Man', type: 'major', fileName: '12倒吊人.jpg', description: '牺牲，换位思考与停顿' },
  { id: 13, name: '死神', nameEn: 'Death', type: 'major', fileName: '13死神.jpg', description: '结束，转变与重生' },
  { id: 14, name: '节制', nameEn: 'Temperance', type: 'major', fileName: '14节制.jpg', description: '平衡，调和与中庸' },
  { id: 15, name: '恶魔', nameEn: 'The Devil', type: 'major', fileName: '15恶魔.jpg', description: '欲望，束缚与物质主义' },
  { id: 16, name: '高塔', nameEn: 'The Tower', type: 'major', fileName: '16高塔.jpg', description: '突变，崩塌与觉醒' },
  { id: 17, name: '星星', nameEn: 'The Star', type: 'major', fileName: '17星星.jpg', description: '希望，灵感与疗愈' },
  { id: 18, name: '月亮', nameEn: 'The Moon', type: 'major', fileName: '18月亮.jpg', description: '幻觉，恐惧与潜意识' },
  { id: 19, name: '太阳', nameEn: 'The Sun', type: 'major', fileName: '19太阳.jpg', description: '快乐，成功与活力' },
  { id: 20, name: '审判', nameEn: 'Judgement', type: 'major', fileName: '20审判.jpg', description: '觉醒，重生与召唤' },
  { id: 21, name: '世界', nameEn: 'The World', type: 'major', fileName: '21世界.jpg', description: '完成，圆满与旅程终点' },
];

// 定义四组小阿卡纳
type Suit = 'cups' | 'swords' | 'pentacles' | 'wands';
const suitNames: Record<Suit, { cn: string; en: string }> = {
  cups: { cn: '圣杯', en: 'Cups' },
  swords: { cn: '宝剑', en: 'Swords' },
  pentacles: { cn: '星币', en: 'Pentacles' },
  wands: { cn: '权杖', en: 'Wands' },
};

const suitKeywords: Record<Suit, string[]> = {
  cups: ['情感', '关系', '直觉', '爱', '连接', '内心感受', '创造力', '想象力', '灵性'],
  swords: ['理智', '冲突', '决定', '真理', '沟通', '挑战', '清晰', '力量', '勇气'],
  pentacles: ['物质', '财富', '健康', '稳定', '事业', '安全', '实践', '自然', '收获'],
  wands: ['行动', '激情', '冒险', '成长', '能量', '灵感', '事业心', '探索', '意志'],
};

function buildMinorArcana(suit: Suit, startId: number): TarotCardData[] {
  const { cn, en } = suitNames[suit];
  const cards: TarotCardData[] = [];
  const ranks = ['ACE', '2', '3', '4', '5', '6', '7', '8', '9', '10', '侍卫', '骑士', '王后', '国王'];
  const rankNamesEn = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];

  ranks.forEach((rank, i) => {
    cards.push({
      id: startId + i,
      name: `${cn}${rank}`,
      nameEn: `${rankNamesEn[i]} of ${en}`,
      type: 'minor',
      suit,
      fileName: `${cn}${rank}.jpg`,
      description: `${suitKeywords[suit][i % suitKeywords[suit].length]}`,
    });
  });
  return cards;
}

// 构建所有 78 张牌
const allCards: TarotCardData[] = [
  ...majorArcana,
  ...buildMinorArcana('cups', 22),
  ...buildMinorArcana('swords', 36),
  ...buildMinorArcana('pentacles', 50),
  ...buildMinorArcana('wands', 64),
];

// 牌背面文件名（不参与抽牌）
export const CARD_BACKS = ['背面A.jpg', '背面B.jpg'];

// 随机选择一张背面
export function getRandomCardBack(): string {
  return CARD_BACKS[Math.floor(Math.random() * CARD_BACKS.length)];
}

// 从78张牌面中随机抽取 n 张
export function drawCards(n: number): { card: TarotCardData; isReversed: boolean }[] {
  const shuffled = [...allCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n).map(card => ({
    card,
    isReversed: Math.random() > 0.5, // 50%概率正位/逆位
  }));
}

export function getCardByFileName(fileName: string): TarotCardData | undefined {
  return allCards.find(c => c.fileName === fileName);
}

export { allCards, majorArcana };
export const ZODIAC_SIGNS = [
  { id: 'aries' as const, name: '白羊座', emoji: '♈', dateRange: '3.21 - 4.19', element: '火' },
  { id: 'taurus' as const, name: '金牛座', emoji: '♉', dateRange: '4.20 - 5.20', element: '土' },
  { id: 'gemini' as const, name: '双子座', emoji: '♊', dateRange: '5.21 - 6.21', element: '风' },
  { id: 'cancer' as const, name: '巨蟹座', emoji: '♋', dateRange: '6.22 - 7.22', element: '水' },
  { id: 'leo' as const, name: '狮子座', emoji: '♌', dateRange: '7.23 - 8.22', element: '火' },
  { id: 'virgo' as const, name: '处女座', emoji: '♍', dateRange: '8.23 - 9.22', element: '土' },
  { id: 'libra' as const, name: '天秤座', emoji: '♎', dateRange: '9.23 - 10.23', element: '风' },
  { id: 'scorpio' as const, name: '天蝎座', emoji: '♏', dateRange: '10.24 - 11.22', element: '水' },
  { id: 'sagittarius' as const, name: '射手座', emoji: '♐', dateRange: '11.23 - 12.21', element: '火' },
  { id: 'capricorn' as const, name: '摩羯座', emoji: '♑', dateRange: '12.22 - 1.19', element: '土' },
  { id: 'aquarius' as const, name: '水瓶座', emoji: '♒', dateRange: '1.20 - 2.18', element: '风' },
  { id: 'pisces' as const, name: '双鱼座', emoji: '♓', dateRange: '2.19 - 3.20', element: '水' },
];
```

---

### Task 3: 复制塔罗牌图片 + 工具函数

**Files:**
- Copy: `E:\taluo\*` → `public/cards/`
- Create: `src/lib/storage.ts`
- Create: `src/lib/deepseek.ts`

- [ ] **Step 1: 复制塔罗牌图片到 public/cards/**

```bash
mkdir -p public/cards
cp "E:\taluo\*.jpg" public/cards/
```

> 如果 Windows bash 的 cp 不支持，改用：
> ```bash
> cp "E:/taluo/"*.jpg public/cards/
> ```

校验：`ls public/cards/*.jpg | wc -l` 应输出 `80`。

- [ ] **Step 2: 编写 localStorage 工具函数**

```typescript
// src/lib/storage.ts

const STORAGE_PREFIX = 'star_tarot_';

export const storage = {
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch {
      // localStorage 已满或不可用，静默失败
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_PREFIX + key);
  },
};

// 获取今天日期字符串 YYYY-MM-DD
export function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// 获取当前月份字符串 YYYY-MM
export function getMonthStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// 每日塔罗相关
export function getDailyTarotKey(): string {
  return `daily_${getTodayStr()}`;
}

export function getMonthlyHoroscopeKey(sign: string): string {
  return `horoscope_${sign}_${getMonthStr()}`;
}
```

- [ ] **Step 3: 编写 DeepSeek API 封装**

```typescript
// src/lib/deepseek.ts
// 服务端代码 — 仅在 API Routes / Server Components 中使用

import OpenAI from 'openai';

const apiKey = process.env.DEEPSEEK_API_KEY;
const baseURL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY is not configured');
    }
    client = new OpenAI({
      apiKey,
      baseURL,
    });
  }
  return client;
}

export interface ChatOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

/**
 * 流式调用 DeepSeek — 返回 ReadableStream<string>
 */
export async function streamDeepSeek(
  options: ChatOptions
): Promise<ReadableStream<string>> {
  const openai = getClient();

  const stream = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: options.systemPrompt },
      { role: 'user', content: options.userPrompt },
    ],
    temperature: options.temperature ?? 0.8,
    max_tokens: options.maxTokens ?? 2048,
    stream: true,
  });

  // 将 OpenAI stream 转为 ReadableStream<string>
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          controller.enqueue(content);
        }
      }
      controller.close();
    },
  });
}

/**
 * 非流式调用 DeepSeek — 返回完整字符串
 */
export async function callDeepSeek(
  options: ChatOptions
): Promise<string> {
  const openai = getClient();

  const response = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: options.systemPrompt },
      { role: 'user', content: options.userPrompt },
    ],
    temperature: options.temperature ?? 0.8,
    max_tokens: options.maxTokens ?? 2048,
    stream: false,
  });

  return response.choices[0]?.message?.content || '';
}
```

---

### Task 4: 基础组件（背景 + 导航 + 入口卡片）

**Files:**
- Create: `src/components/StarfieldBg.tsx`
- Create: `src/components/NavBar.tsx`
- Create: `src/components/EntryCard.tsx`
- Create: `src/components/OnboardingModal.tsx`

- [ ] **Step 1: 编写星空背景组件**

```tsx
// src/components/StarfieldBg.tsx
'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  speed: number;
}

export default function StarfieldBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      initStars();
    }

    function initStars() {
      const count = Math.floor((canvas!.width * canvas!.height) / 3000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        r: Math.random() * 1.5 + 0.5,
        opacity: Math.random(),
        speed: Math.random() * 0.3 + 0.1,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      stars.forEach(star => {
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(201, 168, 76, ${star.opacity})`;
        ctx!.fill();

        // Twinkling
        star.opacity += star.speed * 0.02 * (Math.random() > 0.5 ? 1 : -1);
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));
      });

      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2: 编写 NavBar 组件**

```tsx
// src/components/NavBar.tsx
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
    <nav className="relative z-50 border-b border-mystic-border/30 backdrop-blur-md bg-mystic-bg/80">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-mystic-gold font-title font-bold text-xl tracking-wider hover:text-mystic-gold-light transition-colors">
          ✦ 星辰之引
        </Link>

        <div className="flex gap-1">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                pathname === link.href
                  ? 'text-mystic-gold bg-mystic-card border border-mystic-border'
                  : 'text-mystic-muted hover:text-mystic-text hover:bg-mystic-card/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: 编写 EntryCard 组件**

```tsx
// src/components/EntryCard.tsx
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
        <h3 className="text-xl font-title font-semibold text-mystic-gold group-hover:text-mystic-gold-light transition-colors">
          {title}
        </h3>
        <p className="text-sm text-mystic-muted leading-relaxed">
          {description}
        </p>
        <span className="text-xs text-mystic-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          点击进入 →
        </span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: 编写 OnboardingModal 组件**

```tsx
// src/components/OnboardingModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

const steps = [
  {
    emoji: '✨',
    title: '欢迎来到星辰之引',
    description: '在这里，塔罗牌与星象交织，AI 将为你解读命运的低语。',
  },
  {
    emoji: '🔮',
    title: '塔罗占卜',
    description: '心中默念问题，抽取一张或三张牌，让塔罗为你指引方向。',
  },
  {
    emoji: '🌙',
    title: '星象相伴',
    description: '每月星座运势 + 每日塔罗指引，让宇宙的能量陪你度过每一天。',
  },
];

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const visited = storage.get<boolean>('hasVisited');
    if (!visited) {
      setVisible(true);
    }
  }, []);

  function handleSkip() {
    storage.set('hasVisited', true);
    setVisible(false);
  }

  function handleNext() {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      storage.set('hasVisited', true);
      setVisible(false);
    }
  }

  if (!visible) return null;

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="glass-card max-w-md w-full mx-4 p-10 text-center relative animate-fadeIn">
        {/* 跳过按钮 */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-mystic-muted hover:text-mystic-text text-sm transition-colors"
        >
          跳过
        </button>

        {/* 步骤指示器 */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === step ? 'bg-mystic-gold w-6' : 'bg-mystic-border'
              }`}
            />
          ))}
        </div>

        {/* 内容 */}
        <div className="text-6xl mb-6 animate-float">{current.emoji}</div>
        <h2 className="text-2xl font-title font-bold text-mystic-gold mb-4">
          {current.title}
        </h2>
        <p className="text-mystic-text leading-relaxed mb-8">
          {current.description}
        </p>

        {/* 按钮 */}
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-mystic-gold text-mystic-bg font-semibold rounded-full hover:bg-mystic-gold-light transition-all duration-300 hover:shadow-lg hover:shadow-mystic-gold/20"
        >
          {step < steps.length - 1 ? '下一步' : '开始探索'}
        </button>
      </div>
    </div>
  );
}
```

---

### Task 5: 首页

**Files:**
- Create: `src/app/page.tsx`

- [ ] **Step 1: 编写首页**

```tsx
// src/app/page.tsx
import EntryCard from '@/components/EntryCard';

export default function HomePage() {
  return (
    <main className="relative z-10 min-h-[calc(100vh-57px)] flex flex-col items-center justify-center px-4 py-16">
      {/* 品牌区域 */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-title font-black text-mystic-gold text-glow mb-4 tracking-widest">
          星辰之引
        </h1>
        <p className="text-lg md:text-xl text-mystic-muted font-light tracking-wider">
          用塔罗与星象，探寻你的答案
        </p>
        <div className="mt-6 w-24 h-px bg-gradient-to-r from-transparent via-mystic-gold to-transparent mx-auto" />
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
      <p className="mt-16 text-xs text-mystic-muted/50 tracking-wider">
        ✦ AI 生成内容仅供参考，请理性看待 ✦
      </p>
    </main>
  );
}
```

---

### Task 6: API Routes（3 个后端接口）

**Files:**
- Create: `src/app/api/tarot/route.ts`
- Create: `src/app/api/horoscope/route.ts`
- Create: `src/app/api/daily/route.ts`

- [ ] **Step 1: 编写 /api/tarot**

```typescript
// src/app/api/tarot/route.ts
import { NextRequest } from 'next/server';
import { drawCards } from '@/lib/tarot-data';
import { streamDeepSeek } from '@/lib/deepseek';

export async function POST(req: NextRequest) {
  try {
    const { question, mode } = await req.json();
    const count = mode === 'three' ? 3 : 1;
    const drawn = drawCards(count);

    // 构建 AI prompt
    const cardDescriptions = drawn.map((d, i) => {
      const position = mode === 'three'
        ? ['过去', '现在', '未来'][i]
        : '当下';
      return `- ${position}位：${d.card.name}（${d.isReversed ? '逆位' : '正位'}）- ${d.card.description}`;
    }).join('\n');

    const systemPrompt = `你是一位温暖、有洞察力的专业塔罗师。你的解读风格既富有灵性又充满人文关怀，不会过度迷信或制造恐慌。
用优雅的中文进行解读，适当使用比喻和意象。
${mode === 'three' ? '请解读每张牌在对应位置的含义，以及三张牌之间的关联和整体故事线。' : '请针对这张牌给出简洁而有力的当下指引。'}
结构：先概述整体，再逐牌分析，最后给出温暖的总结。`;

    const userPrompt = question
      ? `用户的问题：「${question}」\n\n抽到的牌：\n${cardDescriptions}`
      : `用户没有具体问题，默念了心中的困惑。\n\n抽到的牌：\n${cardDescriptions}`;

    // 流式返回
    const stream = await streamDeepSeek({
      systemPrompt,
      userPrompt,
      temperature: 0.9,
      maxTokens: mode === 'three' ? 2048 : 1024,
    });

    // 先发送牌面数据（非流式），再拼接解读流
    const cardsJson = JSON.stringify({
      cards: drawn.map(d => ({
        name: d.card.name,
        nameEn: d.card.nameEn,
        position: d.isReversed ? '逆位' : '正位',
        image: `/cards/${d.card.fileName}`,
        isReversed: d.isReversed,
      })),
      mode,
      question: question || '',
    });

    // 自定义流式协议：第一行是 JSON 元数据，后续是解读文本
    const encoder = new TextEncoder();
    const combined = new ReadableStream({
      async start(controller) {
        // 发送元数据行
        controller.enqueue(encoder.encode(`data:${cardsJson}\n\n`));

        // 转发 DeepSeek 流
        const reader = stream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(encoder.encode(`data:${value}\n\n`));
        }
        controller.enqueue(encoder.encode('data:[DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(combined, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Tarot API error:', error);
    return Response.json(
      { error: '抽牌解读失败，请稍后重试' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: 编写 /api/horoscope**

```typescript
// src/app/api/horoscope/route.ts
import { NextRequest } from 'next/server';
import { ZODIAC_SIGNS } from '@/lib/tarot-data';
import { callDeepSeek } from '@/lib/deepseek';

export async function POST(req: NextRequest) {
  try {
    const { sign } = await req.json();
    const zodiac = ZODIAC_SIGNS.find(z => z.id === sign);
    if (!zodiac) {
      return Response.json({ error: '无效的星座' }, { status: 400 });
    }

    const now = new Date();
    const month = now.getFullYear() + '年' + (now.getMonth() + 1) + '月';

    const systemPrompt = `你是一位专业的星座运势分析师，风格温暖正面，富有洞察力。
请为${zodiac.name}（${zodiac.emoji}）生成${month}的月度运势。
按以下四个维度组织内容，每个维度2-3句话：

1. 💫 综合运势
2. ❤️ 爱情运势
3. 💼 事业运势
4. 🌿 健康运势

最后给一句本月寄语。用优雅流畅的中文，避免套话。`;

    const userPrompt = `请为${zodiac.name}生成${month}的详细月度运势。`;

    const result = await callDeepSeek({
      systemPrompt,
      userPrompt,
      temperature: 0.9,
      maxTokens: 1500,
    });

    return Response.json({ sign: zodiac.id, month, interpretation: result });
  } catch (error) {
    console.error('Horoscope API error:', error);
    return Response.json(
      { error: '运势生成失败，请稍后重试' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: 编写 /api/daily**

```typescript
// src/app/api/daily/route.ts
import { drawCards } from '@/lib/tarot-data';
import { callDeepSeek } from '@/lib/deepseek';

export async function POST() {
  try {
    const [drawn] = drawCards(1);

    const systemPrompt = `你是一位温柔、富有哲思的每日塔罗指引师。
请为用户生成一段今日塔罗寄语（150字以内）。
风格：简洁、温暖、富有启发性。包含牌名与正逆位信息，给出一句今日行动建议。`;

    const userPrompt = `今日抽到的牌：${drawn.card.name}（${drawn.isReversed ? '逆位' : '正位'}）- ${drawn.card.description}`;

    const interpretation = await callDeepSeek({
      systemPrompt,
      userPrompt,
      temperature: 0.85,
      maxTokens: 500,
    });

    return Response.json({
      card: {
        name: drawn.card.name,
        nameEn: drawn.card.nameEn,
        position: drawn.isReversed ? '逆位' : '正位',
        image: `/cards/${drawn.card.fileName}`,
        isReversed: drawn.isReversed,
      },
      interpretation,
    });
  } catch (error) {
    console.error('Daily tarot API error:', error);
    return Response.json(
      { error: '今日指引生成失败，请稍后重试' },
      { status: 500 }
    );
  }
}
```

---

### Task 7: 塔罗页面核心组件

**Files:**
- Create: `src/components/ModeSelector.tsx`
- Create: `src/components/CardReveal.tsx`
- Create: `src/components/TarotGuide.tsx`
- Create: `src/components/TarotResult.tsx`
- Create: `src/app/tarot/page.tsx`

- [ ] **Step 1: ModeSelector**

```tsx
// src/components/ModeSelector.tsx
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
            ? 'bg-mystic-gold text-mystic-bg shadow-lg shadow-mystic-gold/20'
            : 'glass-card text-mystic-muted hover:text-mystic-text'
        }`}
      >
        🔮 单牌运势
      </button>
      <button
        onClick={() => onChange('three')}
        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
          mode === 'three'
            ? 'bg-mystic-gold text-mystic-bg shadow-lg shadow-mystic-gold/20'
            : 'glass-card text-mystic-muted hover:text-mystic-text'
        }`}
      >
        ✨ 三牌解读
      </button>
    </div>
  );
}
```

- [ ] **Step 2: CardReveal（翻牌动画）**

```tsx
// src/components/CardReveal.tsx
'use client';

import { useState } from 'react';
import { getRandomCardBack } from '@/lib/tarot-data';

interface CardRevealProps {
  imageSrc: string;
  name: string;
  position: string;
  isReversed: boolean;
  label?: string;
  onRevealed?: () => void;
}

export default function CardReveal({ imageSrc, name, position, isReversed, label, onRevealed }: CardRevealProps) {
  const [flipped, setFlipped] = useState(false);
  const cardBack = getRandomCardBack();

  function handleFlip() {
    if (flipped) return;
    setFlipped(true);
    onRevealed?.();
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {label && (
        <span className="text-xs text-mystic-muted tracking-widest uppercase">{label}</span>
      )}

      <div
        className="card-flip w-[180px] h-[300px] md:w-[200px] md:h-[340px] cursor-pointer"
        onClick={handleFlip}
      >
        <div className={`card-flip-inner ${flipped ? 'flipped' : ''}`}>
          {/* 背面 */}
          <div className="card-back">
            <img
              src={`/cards/${cardBack}`}
              alt="塔罗牌背面"
              className="w-full h-full object-cover rounded-xl shadow-2xl"
            />
            {!flipped && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-mystic-gold/60 text-sm animate-pulse">点击翻开</span>
              </div>
            )}
          </div>

          {/* 正面 */}
          <div className="card-front">
            <img
              src={imageSrc}
              alt={name}
              className={`w-full h-full object-cover rounded-xl shadow-2xl ${isReversed ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </div>

      {flipped && (
        <div className="text-center animate-fadeIn">
          <p className="text-mystic-gold font-title font-semibold">{name}</p>
          <p className={`text-sm ${isReversed ? 'text-red-300/80' : 'text-green-300/80'}`}>
            {position}
          </p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: TarotGuide（塔罗页步骤引导）**

```tsx
// src/components/TarotGuide.tsx
'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

const guideSteps = [
  {
    target: 'question-area',
    content: '在这里写下你想问的事，或者直接跳过，心中默念即可。',
  },
  {
    target: 'mode-area',
    content: '选择「单牌运势」快速获取当下指引，或「三牌解读」获取更深入的时间线分析。',
  },
  {
    target: 'draw-area',
    content: '点击牌背将其翻开，我们将为你解读。',
  },
];

export default function TarotGuide() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = storage.get<boolean>('tarotGuideDone');
    if (!done) {
      setVisible(true);
    }
  }, []);

  function handleNext() {
    if (step < guideSteps.length - 1) {
      setStep(step + 1);
    } else {
      storage.set('tarotGuideDone', true);
      setVisible(false);
    }
  }

  function handleSkip() {
    storage.set('tarotGuideDone', true);
    setVisible(false);
  }

  if (!visible) return null;

  const current = guideSteps[step];

  return (
    <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center"
         onClick={handleNext}>
      <div className="glass-card max-w-sm mx-4 p-8 text-center animate-fadeIn"
           onClick={e => e.stopPropagation()}>
        <div className="flex justify-center gap-2 mb-4">
          {guideSteps.map((_, i) => (
            <div key={i}
              className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-mystic-gold w-6' : 'bg-mystic-border'}`}
            />
          ))}
        </div>
        <p className="text-mystic-text leading-relaxed mb-6">{current.content}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={handleSkip}
            className="px-4 py-2 text-sm text-mystic-muted hover:text-mystic-text transition-colors">
            跳过
          </button>
          <button onClick={handleNext}
            className="px-6 py-2 bg-mystic-gold text-mystic-bg rounded-full text-sm font-semibold hover:bg-mystic-gold-light transition-all">
            {step < guideSteps.length - 1 ? '下一步' : '知道了'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: TarotResult（解读结果展示）**

```tsx
// src/components/TarotResult.tsx
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
        <div className="mb-4 pb-4 border-b border-mystic-border/30">
          <span className="text-xs text-mystic-muted">你的问题</span>
          <p className="text-mystic-text mt-1 italic">「{question}」</p>
        </div>
      )}

      <h3 className="text-lg font-title font-semibold text-mystic-gold mb-4">
        ✦ AI 解读
      </h3>

      <div className="text-mystic-text leading-relaxed whitespace-pre-wrap">
        {interpretation}
        {isStreaming && <span className="inline-block w-2 h-4 bg-mystic-gold ml-1 animate-pulse" />}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 塔罗占卜主页面**

```tsx
// src/app/tarot/page.tsx
'use client';

import { useState, useCallback } from 'react';
import ModeSelector from '@/components/ModeSelector';
import CardReveal from '@/components/CardReveal';
import TarotGuide from '@/components/TarotGuide';
import TarotResult from '@/components/TarotResult';
import { DrawMode, DrawnCard } from '@/types';

export default function TarotPage() {
  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState<DrawMode>('single');
  const [cards, setCards] = useState<(DrawnCard & { image: string })[]>([]);
  const [showCards, setShowCards] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  async function handleDraw() {
    setIsLoading(true);
    setShowCards(false);
    setCards([]);
    setInterpretation('');
    setRevealedCount(0);
    setIsStreaming(false);

    try {
      const res = await fetch('/api/tarot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() || null, mode }),
      });

      if (!res.ok) throw new Error('API error');
      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let metaParsed = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const data = line.slice(5).trim();
          if (data === '[DONE]') {
            setIsStreaming(false);
            continue;
          }

          if (!metaParsed) {
            // 第一行：牌面元数据
            const meta = JSON.parse(data);
            setCards(meta.cards);
            setShowCards(true);
            metaParsed = true;
          } else {
            // 后续行：解读文本
            setInterpretation(prev => prev + data);
            setIsStreaming(true);
          }
        }
      }

      setIsStreaming(false);
    } catch (err) {
      console.error('Draw error:', err);
      setInterpretation('抱歉，抽牌解读出了点问题，请稍后重试 🌙');
    } finally {
      setIsLoading(false);
    }
  }

  function handleRevealed() {
    setRevealedCount(prev => prev + 1);
  }

  const allRevealed = revealedCount >= cards.length;

  const positionLabels = mode === 'three' ? ['过去', '现在', '未来'] : ['当下'];

  return (
    <main className="relative z-10 min-h-[calc(100vh-57px)] px-4 py-10">
      <TarotGuide />

      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <h1 className="text-3xl md:text-4xl font-title font-bold text-center text-mystic-gold mb-2">
          🔮 塔罗占卜
        </h1>
        <p className="text-center text-mystic-muted mb-8 text-sm">
          心中默念你的疑问，让塔罗牌为你指引
        </p>

        {/* 问题输入 */}
        <div id="question-area" className="max-w-md mx-auto mb-6">
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="写下你想问的事（可选）..."
            className="w-full bg-mystic-card border border-mystic-border rounded-xl px-5 py-3 text-mystic-text placeholder-mystic-muted/50 focus:outline-none focus:border-mystic-gold transition-colors"
            maxLength={200}
          />
        </div>

        {/* 模式选择 */}
        <div id="mode-area" className="mb-8">
          <ModeSelector mode={mode} onChange={setMode} />
        </div>

        {/* 抽牌按钮 */}
        <div id="draw-area" className="text-center mb-10">
          <button
            onClick={handleDraw}
            disabled={isLoading}
            className="px-10 py-4 bg-mystic-gold text-mystic-bg font-bold text-lg rounded-full
                       hover:bg-mystic-gold-light transition-all duration-300
                       hover:shadow-xl hover:shadow-mystic-gold/30
                       disabled:opacity-50 disabled:cursor-not-allowed
                       animate-glow"
          >
            {isLoading ? '抽取中...' : '✨ 开始抽牌'}
          </button>
        </div>

        {/* 牌面展示 */}
        {showCards && cards.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-8">
            {cards.map((card, i) => (
              <CardReveal
                key={i}
                imageSrc={card.image}
                name={card.name}
                position={card.position}
                isReversed={card.isReversed}
                label={positionLabels[i]}
                onRevealed={handleRevealed}
              />
            ))}
          </div>
        )}

        {/* AI 解读 */}
        {allRevealed && cards.length > 0 && (
          <TarotResult
            question={question.trim() || undefined}
            interpretation={interpretation}
            isStreaming={isStreaming}
          />
        )}
      </div>
    </main>
  );
}
```

---

### Task 8: 每月运势页 + 今日指引页

**Files:**
- Create: `src/components/ZodiacSignCard.tsx`
- Create: `src/app/monthly/page.tsx`
- Create: `src/app/daily/page.tsx`

- [ ] **Step 1: ZodiacSignCard**

```tsx
// src/components/ZodiacSignCard.tsx
'use client';

import { ZodiacInfo } from '@/types';

interface ZodiacSignCardProps {
  zodiac: ZodiacInfo;
  onClick: () => void;
}

export default function ZodiacSignCard({ zodiac, onClick }: ZodiacSignCardProps) {
  return (
    <button
      onClick={onClick}
      className="glass-card p-6 text-center hover:border-mystic-gold transition-all duration-300 group"
    >
      <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">
        {zodiac.emoji}
      </span>
      <h3 className="text-mystic-gold font-title font-semibold mb-1">{zodiac.name}</h3>
      <p className="text-xs text-mystic-muted">{zodiac.dateRange}</p>
      <span className="text-xs text-mystic-gold/40 mt-1 inline-block">{zodiac.element}象星座</span>
    </button>
  );
}
```

- [ ] **Step 2: 每月运势页**

```tsx
// src/app/monthly/page.tsx
'use client';

import { useState } from 'react';
import { ZODIAC_SIGNS } from '@/lib/tarot-data';
import { storage, getMonthlyHoroscopeKey, getMonthStr } from '@/lib/storage';
import ZodiacSignCard from '@/components/ZodiacSignCard';
import { ZodiacSign } from '@/types';

export default function MonthlyPage() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [interpretation, setInterpretation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSelectSign(signId: ZodiacSign) {
    setSelectedSign(signId);

    // 检查缓存
    const cacheKey = getMonthlyHoroscopeKey(signId);
    const cached = storage.get<{ month: string; interpretation: string }>(cacheKey);
    if (cached && cached.month === getMonthStr()) {
      setInterpretation(cached.interpretation);
      return;
    }

    setIsLoading(true);
    setInterpretation('');

    try {
      const res = await fetch('/api/horoscope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sign: signId }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();

      setInterpretation(data.interpretation);

      // 缓存
      storage.set(cacheKey, { month: getMonthStr(), interpretation: data.interpretation });
    } catch (err) {
      console.error('Horoscope error:', err);
      setInterpretation('运势生成失败，请稍后重试 🌙');
    } finally {
      setIsLoading(false);
    }
  }

  const selectedZodiac = ZODIAC_SIGNS.find(z => z.id === selectedSign);

  return (
    <main className="relative z-10 min-h-[calc(100vh-57px)] px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-title font-bold text-center text-mystic-gold mb-2">
          🌙 每月星座运势
        </h1>
        <p className="text-center text-mystic-muted mb-10 text-sm">
          选择你的星座，获取{new Date().getFullYear()}年{new Date().getMonth() + 1}月专属运势
        </p>

        {/* 星座网格 */}
        {!selectedSign && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {ZODIAC_SIGNS.map(zodiac => (
              <ZodiacSignCard
                key={zodiac.id}
                zodiac={zodiac}
                onClick={() => handleSelectSign(zodiac.id)}
              />
            ))}
          </div>
        )}

        {/* 运势结果 */}
        {selectedSign && selectedZodiac && (
          <div className="animate-fadeIn">
            <button
              onClick={() => setSelectedSign(null)}
              className="text-mystic-muted hover:text-mystic-text mb-6 transition-colors"
            >
              ← 返回星座列表
            </button>

            <div className="glass-card p-8 text-center mb-6">
              <span className="text-6xl block mb-4">{selectedZodiac.emoji}</span>
              <h2 className="text-2xl font-title font-bold text-mystic-gold">
                {selectedZodiac.name}
              </h2>
              <p className="text-mystic-muted text-sm mt-1">
                {new Date().getFullYear()}年{new Date().getMonth() + 1}月 · 月度运势
              </p>
            </div>

            {isLoading ? (
              <div className="glass-card p-8 text-center">
                <div className="animate-pulse text-mystic-gold text-lg">
                  ✦ 正在为你推演星象...
                </div>
              </div>
            ) : interpretation ? (
              <div className="glass-card p-8 leading-relaxed text-mystic-text whitespace-pre-wrap">
                {interpretation}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: 今日指引页**

```tsx
// src/app/daily/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { storage, getDailyTarotKey, getTodayStr } from '@/lib/storage';
import CardReveal from '@/components/CardReveal';
import { DailyTarotData } from '@/types';

export default function DailyPage() {
  const [data, setData] = useState<DailyTarotData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState('');

  // 页面加载时检查今日缓存
  useEffect(() => {
    const cached = storage.get<DailyTarotData>(getDailyTarotKey());
    if (cached && cached.date === getTodayStr()) {
      setData(cached);
      setRevealed(true); // 已抽过，直接展示
    }
  }, []);

  async function handleDraw() {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!res.ok) throw new Error('API error');
      const result: DailyTarotData = await res.json();

      const dailyData: DailyTarotData = {
        ...result,
        date: getTodayStr(),
      };

      setData(dailyData);
      storage.set(getDailyTarotKey(), dailyData);
    } catch (err) {
      console.error('Daily error:', err);
      setError('获取今日指引失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }

  const alreadyDrawn = data && data.date === getTodayStr();

  return (
    <main className="relative z-10 min-h-[calc(100vh-57px)] px-4 py-10 flex flex-col items-center">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-3xl md:text-4xl font-title font-bold text-mystic-gold mb-2">
          ☀️ 今日指引
        </h1>
        <p className="text-mystic-muted mb-10 text-sm">
          每天一张牌，让塔罗给予你今日的心灵指引
        </p>

        {/* 未抽牌状态 */}
        {!alreadyDrawn && !isLoading && (
          <div className="glass-card p-10 text-center mb-8">
            <div className="text-6xl mb-6 animate-float">🃏</div>
            <p className="text-mystic-text mb-6 leading-relaxed">
              今天尚未抽取指引牌
              <br />
              静心片刻，感受今日的能量
            </p>
            <button
              onClick={handleDraw}
              className="px-8 py-3 bg-mystic-gold text-mystic-bg font-semibold rounded-full
                         hover:bg-mystic-gold-light transition-all duration-300
                         hover:shadow-lg hover:shadow-mystic-gold/20"
            >
              ✨ 抽取今日指引
            </button>
          </div>
        )}

        {/* 加载中 */}
        {isLoading && (
          <div className="glass-card p-10 text-center">
            <div className="animate-pulse text-mystic-gold text-lg">
              ✦ 牌面正在显现...
            </div>
          </div>
        )}

        {/* 已抽牌 — 展示结果 */}
        {alreadyDrawn && data && (
          <div className="animate-fadeIn">
            <div className="flex justify-center mb-6">
              <CardReveal
                imageSrc={data.card.image}
                name={data.card.name}
                position={data.card.position}
                isReversed={data.card.isReversed}
                onRevealed={() => setRevealed(true)}
              />
            </div>

            {revealed && (
              <div className="glass-card p-8 text-left mt-6">
                <div className="text-xs text-mystic-muted mb-2">
                  {data.date} · 今日指引
                </div>
                <div className="text-mystic-text leading-relaxed whitespace-pre-wrap">
                  {data.interpretation}
                </div>
                <div className="mt-6 pt-4 border-t border-mystic-border/30 text-center">
                  <p className="text-xs text-mystic-muted">
                    ✦ 明天再来，获取新的指引 ✦
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm mt-4">{error}</p>
        )}
      </div>
    </main>
  );
}
```

---

### Task 9: Root Layout 集成

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: 编写 RootLayout**

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import StarfieldBg from '@/components/StarfieldBg';
import NavBar from '@/components/NavBar';
import OnboardingModal from '@/components/OnboardingModal';

export const metadata: Metadata = {
  title: '星辰之引 - AI 塔罗占卜 & 星座运势',
  description: '用塔罗与星象，探寻你的答案。AI 驱动的塔罗占卜、每月星座运势、每日塔罗指引。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
```

---

### Task 10: 最终验证

- [ ] **Step 1: 确认所有文件就位**

```bash
ls src/app/page.tsx src/app/layout.tsx src/app/globals.css
ls src/app/tarot/page.tsx src/app/monthly/page.tsx src/app/daily/page.tsx
ls src/app/api/tarot/route.ts src/app/api/horoscope/route.ts src/app/api/daily/route.ts
ls src/components/*.tsx
ls src/lib/*.ts src/types/*.ts
ls public/cards/*.jpg | wc -l
```

- [ ] **Step 2: 确认 .env.local 中的 DEEPSEEK_API_KEY 已配置**

```bash
grep -q "DEEPSEEK_API_KEY=your_api_key_here" .env.local && echo "需要配置你的 DeepSeek API Key" || echo "API Key 已配置"
```

- [ ] **Step 3: 启动开发服务器验证**

```bash
npm run dev
```

检查：
- 首页 http://localhost:3000 — 标题、卡片、星空背景
- 全站引导弹窗（用无痕窗口）— 3步引导
- 塔罗 http://localhost:3000/tarot — 问题输入、模式选择、抽牌
- 每月运势 http://localhost:3000/monthly — 星座网格
- 今日指引 http://localhost:3000/daily — 抽牌/回顾

- [ ] **Step 4: 提交代码**

```bash
git add -A
git commit -m "feat: AI塔罗占卜+轻量占星网站初始版本"
```

---
