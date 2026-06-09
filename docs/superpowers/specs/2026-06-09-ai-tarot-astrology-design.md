# AI 塔罗占卜 + 轻量占星 网站设计文档

> 日期：2026-06-09 | 状态：已确认

## 一、项目概述

「星辰之引」— 一个 AI 驱动的塔罗占卜与轻量占星网站。用户可以在线抽取塔罗牌并获得 AI 解读，查看每月星座运势，以及每日抽取一张塔罗指引牌。

## 二、技术选型

- **框架**：Next.js App Router (React 18+ TypeScript)
- **样式**：Tailwind CSS + CSS Modules（动效用）
- **AI 接口**：DeepSeek API（OpenAI 兼容，服务端调用）
- **数据存储**：浏览器 localStorage
- **部署**：Vercel / 自托管 Node.js 服务器

## 三、路由结构

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 品牌标题 + 三个入口卡片 |
| `/tarot` | 塔罗占卜 | 单牌/三牌，提问抽牌 AI 解读 |
| `/monthly` | 每月运势 | 12 星座月度 AI 运势 |
| `/daily` | 今日指引 | 每日单牌指引（每人每天限 1 次） |
| `/api/tarot` | API | 抽牌 + DeepSeek 解读 |
| `/api/horoscope` | API | 星座月度运势生成 |
| `/api/daily` | API | 每日塔罗抽牌 + 解读 |

## 四、功能规格

### 4.1 首页
- 品牌标题「星辰之引」+ 文案「用塔罗与星象，探寻你的答案」
- 三张毛玻璃入口卡片：塔罗占卜 / 每月运势 / 今日指引
- 星空粒子背景动画

### 4.2 塔罗占卜页
- 用户可选输入问题（非必填）
- 两种模式：单牌运势（1张）/ 三牌解读（3张，过去·现在·未来）
- 后端随机从 78 张牌面中抽取，每张独立判定正位/逆位（各 50%）
- 牌背展示 → 用户逐张点击翻开，3D CSS 翻转动画
- 调用 DeepSeek API 生成解读，流式输出
- 首次进入该页显示 3 步新手引导 overlay

### 4.3 每月运势页
- 12 星座网格展示（3×4 桌面 / 列表移动端）
- 点击星座 → AI 生成该星座当月运势
- 四维度：综合运、爱情运、事业运、健康运
- 结果缓存到 localStorage（同月同星座复用）
- 每月1号自动刷新

### 4.4 今日指引页
- 日签风格单牌展示
- 每天限抽 1 张（localStorage 记录日期+结果）
- 已抽取则展示回顾状态
- AI 生成简洁每日寄语

### 4.5 全站引导
- 首次访问：全屏弹窗 3 步品牌介绍
- localStorage 记录 `hasVisited`，已访问过不再弹出
- 支持跳过

### 4.6 塔罗牌资源
- 源目录：`E:\taluo\`（80 张图片）
- 78 张牌面 → 复制到 `public/cards/` 供前端访问
- 2 张背面（背面A.jpg / 背面B.jpg）→ 仅展示，不参与抽牌逻辑
- 抽牌时后端从 78 张牌面文件列表中随机选择

## 五、API 设计

### POST /api/tarot
```json
// Request
{ "question": "string (optional)", "mode": "single" | "three" }

// Response (SSE stream)
{ "cards": [{ "name": "圣杯3", "position": "正位", "image": "/cards/圣杯3.jpg" }] }
// + streamed interpretation text
```

### POST /api/horoscope
```json
// Request
{ "sign": "aries" | "taurus" | ... }

// Response (SSE stream)
// streamed horoscope text (4 dimensions)
```

### POST /api/daily
```json
// Request
{}

// Response
{ "card": { "name": "...", "position": "...", "image": "..." }, "interpretation": "..." }
```

## 六、数据模型

### 塔罗牌数据（tarot-data.ts）
```typescript
interface TarotCard {
  id: number;          // 0-77
  name: string;        // 中文名，如 "愚者"
  nameEn: string;      // 英文名，如 "The Fool"
  type: "major" | "minor";
  suit?: "cups" | "swords" | "pentacles" | "wands"; // 小阿卡纳
  fileName: string;    // 如 "00愚者.jpg"
}
```

### localStorage 键设计
- `hasVisited`: boolean — 是否完成首次引导
- `daily_tarot_2026-06-09`: { card, interpretation } — 每日塔罗
- `horoscope_aries_2026-06`: { interpretation } — 月度运势缓存

## 七、视觉设计

| 元素 | 方案 |
|------|------|
| 底色 | 深黑紫渐变 #0a0a12 → #1a0a2e |
| 主色调 | 暗金色 #c9a84c |
| 卡片 | 半透明深紫 + 毛玻璃 backdrop-filter + 金色微光边框 |
| 字体标题 | 思源柔黑 / 站酷文艺体 |
| 翻牌动效 | CSS 3D rotateY 翻转 0.6s ease |
| 背景 | Canvas 星空粒子漂浮 |
| 响应式 | ≥768px 双栏，<768px 单栏堆叠 |

## 八、边界与约束

- DeepSeek API Key 仅存服务端环境变量，不暴露到客户端
- 今日指引限制通过 localStorage 实现（清缓存可绕过，接受此限制）
- 每月运势每月1号自动刷新缓存
- 78 张牌面中随机抽取，2 张背面不参与抽牌逻辑
- 正位/逆位各 50% 概率，服务端 Math.random() 判定
