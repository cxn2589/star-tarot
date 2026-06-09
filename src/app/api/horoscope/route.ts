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
    return Response.json({ error: '运势生成失败，请稍后重试' }, { status: 500 });
  }
}
