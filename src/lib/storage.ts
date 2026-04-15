import { SavedChart, SavedMatching } from '@/types/user';
import { KundaliData } from '@/types/astrology';

const CHARTS_KEY = 'astrology_saved_charts';
const MATCHINGS_KEY = 'astrology_saved_matchings';

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

// ---------------------------------------------------------------------------
// Google Drive-backed storage (async, via API routes)
// ---------------------------------------------------------------------------

export async function getDriveCharts(): Promise<SavedChart[]> {
  const res = await fetch('/api/drive/charts');
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to load charts');
  return json.data as SavedChart[];
}

export async function saveChartToDrive(
  personName: string,
  birthData: KundaliData & { sankalpam?: string },
  chartType: 'kundali' | 'transit' | 'dasha' = 'kundali',
  pdfBlob?: Blob
): Promise<{ chartId: string; dataFileId: string; pdfFileId: string | null }> {
  const chartId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const now = new Date().toISOString();

  const chartData: SavedChart = {
    id: chartId,
    personName,
    birthData,
    chartType,
    createdAt: now,
    updatedAt: now,
  };

  const formData = new FormData();
  formData.append('chartData', JSON.stringify(chartData));

  if (pdfBlob) {
    formData.append(
      'pdf',
      pdfBlob,
      `kundali_${personName}_${chartId}.pdf`
    );
  }

  const res = await fetch('/api/drive/charts', { method: 'POST', body: formData });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to save chart');
  return json.data;
}

export async function deleteChartFromDrive(chartId: string): Promise<void> {
  const res = await fetch(`/api/drive/charts/${chartId}`, { method: 'DELETE' });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to delete chart');
}

export async function uploadPDFToDrive(
  filename: string,
  pdfBlob: Blob
): Promise<string> {
  const formData = new FormData();
  formData.append('pdf', pdfBlob, filename);
  formData.append('filename', filename);

  const res = await fetch('/api/drive/upload-pdf', {
    method: 'POST',
    body: formData,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to upload PDF');
  return json.data.fileId;
}

// ---------------------------------------------------------------------------
// Legacy localStorage functions (kept as fallback)
// ---------------------------------------------------------------------------

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
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
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
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
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
