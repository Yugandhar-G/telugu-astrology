import { SavedChart } from '@/types/user';
import { KundaliData } from '@/types/astrology';

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
): Promise<{ chartId: string; dataUrl: string; pdfUrl: string | null }> {
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
    formData.append('pdf', pdfBlob, `kundali_${personName}_${chartId}.pdf`);
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
  return json.data.url;
}
