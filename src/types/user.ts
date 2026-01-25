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

export interface SavedChart {
  id: string;
  userId: string;
  personName: string;
  birthData: any; // JSONB from Supabase
  chartType: 'kundali' | 'transit' | 'dasha';
  createdAt: string;
  updatedAt: string;
}

export interface SavedMatching {
  id: string;
  userId: string;
  person1ChartId: string | null;
  person2ChartId: string | null;
  matchingData: any; // JSONB from Supabase
  gunaScore: number;
  createdAt: string;
}
