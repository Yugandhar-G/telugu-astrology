import { put, list } from '@vercel/blob';

export async function uploadPDF(
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

export async function listPDFs(): Promise<
  { url: string; pathname: string; uploadedAt: Date; size: number }[]
> {
  const result = await list({ prefix: 'pdfs/' });
  return result.blobs
    .filter((b) => b.pathname.endsWith('.pdf'))
    .map((b) => ({
      url: b.url,
      pathname: b.pathname,
      uploadedAt: b.uploadedAt,
      size: b.size,
    }));
}
