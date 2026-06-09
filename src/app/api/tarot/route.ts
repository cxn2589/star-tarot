// src/app/api/tarot/route.ts
import { NextRequest } from 'next/server';
import { drawCards } from '@/lib/tarot-data';
import { streamDeepSeek } from '@/lib/deepseek';

export async function POST(req: NextRequest) {
  try {
    const { question, mode } = await req.json();
    const count = mode === 'three' ? 3 : 1;
    const drawn = drawCards(count);

    const cardDescriptions = drawn.map((d, i) => {
      const positionLabel = mode === 'three' ? ['过去', '现在', '未来'][i] : '当下';
      return `- ${positionLabel}位：${d.card.name}（${d.isReversed ? '逆位' : '正位'}）- ${d.card.description}`;
    }).join('\n');

    const systemPrompt = `你是一位温暖、有洞察力的专业塔罗师。你的解读风格既富有灵性又充满人文关怀，不会过度迷信或制造恐慌。
用优雅的中文进行解读，适当使用比喻和意象。
${mode === 'three' ? '请解读每张牌在对应位置的含义，以及三张牌之间的关联和整体故事线。先概述整体，再逐牌分析，最后给出温暖的总结。' : '请针对这张牌给出简洁而有力的当下指引。'}`;

    const userPrompt = question
      ? `用户的问题：「${question}」\n\n抽到的牌：\n${cardDescriptions}`
      : `用户没有具体问题，默念了心中的困惑。\n\n抽到的牌：\n${cardDescriptions}`;

    const stream = await streamDeepSeek({
      systemPrompt,
      userPrompt,
      temperature: 0.9,
      maxTokens: mode === 'three' ? 2048 : 1024,
    });

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

    const encoder = new TextEncoder();
    const combined = new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder.encode(`data:${cardsJson}\n\n`));

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
    return Response.json({ error: '抽牌解读失败，请稍后重试' }, { status: 500 });
  }
}
