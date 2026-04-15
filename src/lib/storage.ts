import { SavedChart } from '@/types/user';
import { KundaliData } from '@/types/astrology';

const CHARTS_KEY = 'astrology_saved_charts';

export function getSavedCharts(): SavedChart[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CHARTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveChartLocally(
  personName: string,
  birthData: KundaliData & { sankalpam?: string },
  chartType: 'kundali' | 'transit' | 'dasha' = 'kundali'
): void {
  const charts = getSavedCharts();
  const now = new Date().toISOString();
  charts.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    personName,
    birthData,
    chartType,
    createdAt: now,
    updatedAt: now,
  });
  localStorage.setItem(CHARTS_KEY, JSON.stringify(charts));
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
  return json.data.url;
}
