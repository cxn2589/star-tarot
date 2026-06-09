// src/types/index.ts

export interface TarotCardData {
  id: number;
  name: string;
  nameEn: string;
  type: 'major' | 'minor';
  suit?: 'cups' | 'swords' | 'pentacles' | 'wands';
  fileName: string;
  description: string;
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

export interface RevealedCard {
  name: string;
  nameEn: string;
  position: string;
  image: string;
  isReversed: boolean;
}

export interface DailyTarotData {
  date: string;
  card: {
    name: string;
    nameEn: string;
    position: string;
    image: string;
    isReversed: boolean;
  };
  interpretation: string;
}
