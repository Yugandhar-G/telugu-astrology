import { put, list, del } from '@vercel/blob';

export async function uploadChartJSON(
  chartId: string,
  data: Record<string, unknown>
): Promise<string> {
  const blob = await put(`charts/${chartId}.json`, JSON.stringify(data), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  });
  return blob.url;
}

export async function uploadChartPDF(
  chartId: string,
  personName: string,
  pdfBuffer: Buffer | Blob
): Promise<string> {
  const blob = await put(`pdfs/kundali_${personName}_${chartId}.pdf`, pdfBuffer, {
    access: 'public',
    contentType: 'application/pdf',
    addRandomSuffix: false,
  });
  return blob.url;
}

export async function listChartBlobs(): Promise<
  { url: string; pathname: string; uploadedAt: Date }[]
> {
  const result = await list({ prefix: 'charts/' });
  return result.blobs
    .filter((b) => b.pathname.endsWith('.json'))
    .map((b) => ({
      url: b.url,
      pathname: b.pathname,
      uploadedAt: b.uploadedAt,
    }));
}

export async function getChartJSON(url: string): Promise<Record<string, unknown>> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch chart: ${res.status}`);
  return res.json();
}

export async function deleteChartBlob(chartId: string): Promise<void> {
  const allBlobs = await list({ prefix: 'charts/' });
  const chartBlob = allBlobs.blobs.find(
    (b) => b.pathname === `charts/${chartId}.json`
  );
  if (chartBlob) await del(chartBlob.url);

  const pdfBlobs = await list({ prefix: `pdfs/` });
  const pdfBlob = pdfBlobs.blobs.find((b) => b.pathname.includes(chartId));
  if (pdfBlob) await del(pdfBlob.url);
}

export async function getChartPDFUrl(chartId: string): Promise<string | null> {
  const result = await list({ prefix: 'pdfs/' });
  const pdfBlob = result.blobs.find((b) => b.pathname.includes(chartId));
  return pdfBlob ? pdfBlob.url : null;
}

export async function uploadMatchmakingPDF(
  filename: string,
  pdfBuffer: Buffer | Blob
): Promise<string> {
  const blob = await put(`pdfs/${filename}`, pdfBuffer, {
    access: 'public',
    contentType: 'application/pdf',
    addRandomSuffix: false,
  });
  return blob.url;
}
