import { NextRequest, NextResponse } from 'next/server';
import { getChartPDFUrl } from '@/lib/blob-storage';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pdfUrl = await getChartPDFUrl(id);

    if (!pdfUrl) {
      return NextResponse.json(
        { success: false, error: 'PDF not found' },
        { status: 404 }
      );
    }

    return NextResponse.redirect(pdfUrl);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: `PDF fetch failed: ${msg}` },
      { status: 500 }
    );
  }
}
