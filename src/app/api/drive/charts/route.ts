import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import { deletePDF } from '@/lib/blob-storage';

export async function GET() {
  try {
    const result = await list({ prefix: 'pdfs/' });

    const pdfs = result.blobs
      .filter((b) => b.pathname.endsWith('.pdf'))
      .map((b) => {
        const basename = b.pathname.split('/').pop() || '';
        const name = basename
          .replace('.pdf', '')
          .replace(/^kundali_/, '')
          .replace(/^matchmaking_/, '');

        return {
          url: b.url,
          pathname: b.pathname,
          name: name || basename,
          uploadedAt: b.uploadedAt.toISOString(),
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

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const target =
      body?.url ||
      body?.pathname ||
      request.nextUrl.searchParams.get('url') ||
      request.nextUrl.searchParams.get('pathname');

    if (!target || typeof target !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing url or pathname' },
        { status: 400 }
      );
    }

    await deletePDF(target);
    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error deleting PDF:', msg);
    return NextResponse.json(
      { success: false, error: `Delete failed: ${msg}` },
      { status: 500 }
    );
  }
}
