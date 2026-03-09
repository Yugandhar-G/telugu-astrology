// User-related type definitions

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  gender: string | null;
  birthDate: string | null;
  birthTime: string | null;
  birthPlace: string | null;
  birthLatitude: number | null;
  birthLongitude: number | null;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

import { KundaliData } from './astrology';

export interface SavedChart {
  id: string;
  personName: string;
  birthData: KundaliData & { sankalpam?: string };
  chartType: 'kundali' | 'transit' | 'dasha';
  createdAt: string;
  updatedAt: string;
}

export interface SavedMatching {
  id: string;
  person1ChartId: string | null;
  person2ChartId: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchingData: any;
  gunaScore: number;
  createdAt: string;
}
