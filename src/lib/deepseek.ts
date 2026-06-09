// src/lib/deepseek.ts
// Server-side only — used in API Routes

import OpenAI from 'openai';

const apiKey = process.env.DEEPSEEK_API_KEY;
const baseURL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY is not configured');
    }
    client = new OpenAI({ apiKey, baseURL });
  }
  return client;
}

export interface ChatOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

export async function streamDeepSeek(options: ChatOptions): Promise<ReadableStream<string>> {
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

export async function callDeepSeek(options: ChatOptions): Promise<string> {
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
