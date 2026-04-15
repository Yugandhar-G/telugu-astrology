import { NextRequest, NextResponse } from 'next/server';
import { findPDFForChart, getFileBuffer } from '@/lib/google-drive';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pdfFileId = await findPDFForChart(id);

    if (!pdfFileId) {
      return NextResponse.json(
        { success: false, error: 'PDF not found' },
        { status: 404 }
      );
    }

    const buffer = await getFileBuffer(pdfFileId);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="kundali_${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error getting PDF:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get PDF from Drive' },
      { status: 500 }
    );
  }
}
