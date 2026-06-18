---
name: 星辰之引
description: AI 驱动的塔罗占卜与轻量占星——安静的心灵探索空间
colors:
  primary: "#3d1a2e"
  primary-glow: "#6b3050"
  bg: "#121016"
  surface: "#1e1924"
  surface-raised: "#26212e"
  ink: "#ebe6f0"
  ink-secondary: "#8a8296"
  accent: "#c9a050"
  accent-glow: "#e8cc78"
  success: "#7ecb9a"
  caution: "#e8c870"
typography:
  display:
    fontFamily: "Noto Serif SC, Georgia, serif"
    fontWeight: 200
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Noto Serif SC, Georgia, serif"
    fontWeight: 400
    letterSpacing: "0.02em"
  body:
    fontFamily: "Noto Sans SC, system-ui, sans-serif"
    fontWeight: 300
    lineHeight: 1.8
    letterSpacing: "0.01em"
  label:
    fontFamily: "Noto Sans SC, system-ui, sans-serif"
    fontWeight: 400
    letterSpacing: "0.08em"
    textTransform: "none"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "64px"
  "2xl": "96px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    rounded: "{rounded.full}"
    padding: "14px 40px"
  button-primary-hover:
    backgroundColor: "{colors.accent-glow}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  card-raised:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.lg}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
---

## Overview

星辰之引是一个面向内心探索的 AI 塔罗占卜与轻量占星网站。设计目标是创造一个安静、深邃、治愈的数字仪式空间。

**情绪方向：** "quiet midnight observatory" — 静谧的午夜天文台。深色虚空为背景，温暖星光作为点缀，克制而温柔。

**目标用户：** 18-35岁女性为主的灵性探索者，审美敏感，追求仪式感和氛围感。

**设计策略：** Committed dark — 深色表面本身即品牌声明。主色为深邃天鹅绒般的暗紫红调（deep plum），仅在关键品牌时刻出现。暖琥珀金作为星光般点缀。

## Colors

### 设计理念

深色表面不是"暗黑模式"——而是品牌的空间感。想象午夜走进一个安静的天文台：四周是深邃的暗，头顶有微弱的星光，桌上只有一盏暖色的灯。

- **bg `#121016`**: 接近纯黑但带有极微弱的暖意。不是 `#000000` 的死黑，而是有温度的深色。OKLCH: `oklch(0.08 0.002 320)`.
- **surface `#1e1924`**: 从 bg 抬升的卡片表面，轻微偏暖。OKLCH: `oklch(0.135 0.006 320)`.
- **surface-raised `#26212e`**: 更高层级的表面（hover 卡片、弹窗）。OKLCH: `oklch(0.175 0.008 320)`.
- **primary `#3d1a2e`**: 深邃的天鹅绒暗紫红。不刺眼、不跳脱——它在暗处安静地存在。用于关键的品牌标记（header 品牌名、footer、重要 accent line）。OKLCH: `oklch(0.18 0.08 355)`.
- **primary-glow `#6b3050`**: primary 的发光变体，用于 hover 和微妙光晕。OKLCH: `oklch(0.32 0.14 355)`.
- **ink `#ebe6f0`**: 正文颜色。接近白色但带有极微暖调，在深色背景上柔软而不刺眼。WCAG AAA 对比度 vs bg (>7:1)。OKLCH: `oklch(0.92 0.003 320)`.
- **ink-secondary `#8a8296`**: 辅助文字。ink 向 bg 方向拉约 40%，保留 ink 的色相。WCAG AA vs surface (>4.5:1)。OKLCH: `oklch(0.54 0.006 320)`.
- **accent `#c9a050`**: 暖琥珀金——星光的颜色。用于按钮、链接、活跃状态。和 primary 在色相（85° vs 355°）和明度上形成强烈区分。OKLCH: `oklch(0.68 0.13 85)`.
- **accent-glow `#e8cc78`**: accent 的浅金变体，用于 hover 和发光效果。OKLCH: `oklch(0.82 0.14 85)`.
- **success**: 柔和绿，正位牌标识。**caution**: 柔和金，逆位牌标识。

### 色彩策略

Committed dark — 深色表面承载品牌 80% 的视觉面积。Primary plum 仅占 5-10% 用于关键品牌时刻。Accent amber 占 5-10% 用于交互元素。绝大多数字面留白（dark void）靠 ink 文字和 accent 点缀来制造视觉节奏。

### 反模式

- 不使用 cream/beige/sand 底色
- 不使用 AI-purple（紫蓝渐变）
- 不使用高饱和霓虹色
- 不在深色背景上使用灰色文字——灰度文字在深色背景上对比度不足
- 不使用过多的色相——2 个品牌色（plum + amber）已经足够

## Typography

### 字体策略

两字体系统：Serif display + Sans body。在中文场景中，serif 用于品牌标题营造仪式感，sans 用于正文确保可读性。

**Display**: Noto Serif SC, weight 200。用于页面主标题、品牌名。极轻的字重带来纤细优雅的感觉，配合 letter-spacing -0.02em 使大字不至于松散。

**Heading**: Noto Serif SC, weight 400。用于区域标题（h2-h4）。和 Display 同一字族但更重，形成清晰的层级对比。

**Body**: Noto Sans SC, weight 300（regular）。line-height 1.8 确保深色背景上文字舒适可读。正文 16px 起步。

**Label**: Noto Sans SC, weight 400, letter-spacing 0.08em。用于标签、按钮文字、小标题。

### 层级比例

至少 1.25 倍比例递进：display (~clamp(2.5rem, 5vw, 4.5rem)) → h2 (2rem) → h3 (1.5rem) → body (1rem/16px) → caption (0.875rem)。

正文行宽上限 65-75ch。h1-h3 使用 `text-wrap: balance`。

### 绝对不

- 全大写的正文段落
- 超过 3 个字族
- 正文小于 14px
- display heading 超过 6rem（clamp 上限）
- letter-spacing 小于 -0.04em（字间距过紧）

## Elevation

深色表面的层级不是通过阴影而是通过**亮度抬升**来体现：

- **bg `#121016`**: 最低层，页面底色。星空的"虚空"。
- **surface `#1e1924`**: 抬升层，卡片和面板。从 bg 抬升约 6% 明度。
- **surface-raised `#26212e`**: 更高层，hover 卡片和弹窗。再抬升约 4% 明度。
- **overlay**: 模态遮罩使用 `rgba(0,0,0,0.7)` 而非白色。

不使用 3D 阴影（box-shadow）作为主要的层级表达方式——那会破坏深夜空间的沉浸感。取而代之的是 subtle border + 亮度抬升。弹窗和 dropdown 可以使用极微弱的金色描边来表示"浮出"。

z-index 语义层级（从低到高）：content → sticky-nav → dropdown → modal-backdrop → modal → toast

## Components

### 卡片
- 底色 `surface`，不使用嵌套卡片
- 描边极细（1px），颜色 `rgba(255,255,255,0.06)` ——几乎看不见但能区分卡片和背景
- hover 时抬升至 `surface-raised` + 极其微弱的金色描边 `rgba(201,160,80,0.25)`
- rounded 14px（lg），不过分圆
- 不使用 24px+ 的大圆角卡片
- 不使用 side-stripe border（左边框彩色装饰条）

### 按钮
- Primary: accent 琥珀金填充 + 深色文字
- 圆角 full pill（9999px）
- hover: accent-glow 提亮 + 微升 1px
- 不使用 ghost-card 效果（border + 大阴影不能同时出现）
- 标签：动词 + 名词

### 输入框
- 底色 surface，placeholder 使用 ink-secondary
- focus: 金色微光描边
- 不使用 glow-ring 动画

### 塔罗牌
- 卡牌圆角 10px（md），不是大圆角
- 翻转动画: 0.7s cubic-bezier ease，尊重 prefers-reduced-motion

### 星空背景
- Canvas 绘制，金色和白色混合的星点
- 星点缓慢闪烁，不做快速移动
- reduced-motion: 星空变为静态

## Do's and Don'ts

### ✅ Do
- 大量留白——让文字有呼吸空间
- 用亮度抬升表达层级，不用阴影
- 2 个字族：serif display + sans body
- 正文 ink `#ebe6f0` 在深色 bg 上，对比度充足
- 金色 accent 克制使用——10% 以内面积
- 仪式感来自动效节奏，不是装饰花纹
- 移动端优先，卡片网格用 `auto-fit, minmax(280px, 1fr)`

### ❌ Don't
- 不要嵌套卡片
- 不要使用 gradient text（background-clip: text）
- 不要 glassmorphism 作为默认卡片样式
- 不要使用 32px+ 大圆角
- 不要在深色背景上使用暗灰色文字——看不清
- 不要使用 side-stripe border 装饰
- 不要全大写正文
- 不要用过多的装饰符号（✨🌟💫🔮 适度即可，每个区域不超过一个）
- 不要让任何文本元素的对比度低于 WCAG AA
