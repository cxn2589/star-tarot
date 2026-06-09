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

type Suit = 'cups' | 'swords' | 'pentacles' | 'wands';
const suitNames: Record<Suit, { cn: string; en: string }> = {
  cups: { cn: '圣杯', en: 'Cups' },
  swords: { cn: '宝剑', en: 'Swords' },
  pentacles: { cn: '星币', en: 'Pentacles' },
  wands: { cn: '权杖', en: 'Wands' },
};

const suitKeywords: Record<Suit, string[]> = {
  cups: ['情感', '关系', '直觉', '爱', '连接', '内心感受', '创造力', '想象力', '灵性', '满足', '浪漫', '共情', '温柔', '滋养'],
  swords: ['理智', '冲突', '决定', '真理', '沟通', '挑战', '清晰', '力量', '勇气', '突破', '思维', '正义', '决断', '觉醒'],
  pentacles: ['物质', '财富', '健康', '稳定', '事业', '安全', '实践', '自然', '收获', '基础', '耐心', '工匠精神', '繁荣', '现实'],
  wands: ['行动', '激情', '冒险', '成长', '能量', '灵感', '事业心', '探索', '意志', '创造', '热情', '领导力', '动力', '远见'],
};

function buildMinorArcana(suit: Suit, startId: number): TarotCardData[] {
  const { cn, en } = suitNames[suit];
  const ranks = ['ACE', '2', '3', '4', '5', '6', '7', '8', '9', '10', '侍卫', '骑士', '王后', '国王'];
  const rankNamesEn = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];

  return ranks.map((rank, i) => ({
    id: startId + i,
    name: `${cn}${rank}`,
    nameEn: `${rankNamesEn[i]} of ${en}`,
    type: 'minor' as const,
    suit,
    fileName: `${cn}${rank}.jpg`,
    description: suitKeywords[suit][i],
  }));
}

const allCards: TarotCardData[] = [
  ...majorArcana,
  ...buildMinorArcana('cups', 22),
  ...buildMinorArcana('swords', 36),
  ...buildMinorArcana('pentacles', 50),
  ...buildMinorArcana('wands', 64),
];

export const CARD_BACKS = ['背面A.jpg', '背面B.jpg'];

export function getRandomCardBack(): string {
  return CARD_BACKS[Math.floor(Math.random() * CARD_BACKS.length)];
}

export function drawCards(n: number): { card: TarotCardData; isReversed: boolean }[] {
  const shuffled = [...allCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n).map(card => ({
    card,
    isReversed: Math.random() > 0.5,
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
