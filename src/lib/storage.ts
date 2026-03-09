import { SavedChart, SavedMatching } from '@/types/user';
import { KundaliData } from '@/types/astrology';

const CHARTS_KEY = 'astrology_saved_charts';
const MATCHINGS_KEY = 'astrology_saved_matchings';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function readList<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

export function getSavedCharts(): SavedChart[] {
  return readList<SavedChart>(CHARTS_KEY);
}

export function saveChart(
  personName: string,
  birthData: KundaliData & { sankalpam?: string },
  chartType: 'kundali' | 'transit' | 'dasha' = 'kundali'
): SavedChart {
  const charts = getSavedCharts();
  const now = new Date().toISOString();
  const chart: SavedChart = {
    id: generateId(),
    personName,
    birthData,
    chartType,
    createdAt: now,
    updatedAt: now,
  };
  charts.unshift(chart);
  writeList(CHARTS_KEY, charts);
  return chart;
}

export function deleteChart(chartId: string): void {
  const charts = getSavedCharts().filter((c) => c.id !== chartId);
  writeList(CHARTS_KEY, charts);
}

export function getSavedMatchings(): SavedMatching[] {
  return readList<SavedMatching>(MATCHINGS_KEY);
}

export function saveMatching(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchingData: any,
  gunaScore: number,
  person1ChartId: string | null = null,
  person2ChartId: string | null = null
): SavedMatching {
  const matchings = getSavedMatchings();
  const matching: SavedMatching = {
    id: generateId(),
    person1ChartId,
    person2ChartId,
    matchingData,
    gunaScore,
    createdAt: new Date().toISOString(),
  };
  matchings.unshift(matching);
  writeList(MATCHINGS_KEY, matchings);
  return matching;
}
