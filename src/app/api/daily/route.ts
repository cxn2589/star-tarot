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
    return Response.json({ error: '今日指引生成失败，请稍后重试' }, { status: 500 });
  }
}
