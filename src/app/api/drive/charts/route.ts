import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET() {
  try {
    const result = await list({ prefix: 'pdfs/' });

    const pdfs = result.blobs
      .filter((b) => b.pathname.endsWith('.pdf'))
      .map((b) => {
        const name = b.pathname
          .replace('pdfs/', '')
          .replace('.pdf', '')
          .replace(/^kundali_/, '')
          .replace(/^matchmaking_/, '');

        return {
          url: b.url,
          pathname: b.pathname,
          name,
          uploadedAt: b.uploadedAt,
          size: b.size,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );

    return NextResponse.json({ success: true, data: pdfs });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error listing PDFs:', msg);
    return NextResponse.json(
      { success: false, error: `List failed: ${msg}` },
      { status: 500 }
    );
  }
}
