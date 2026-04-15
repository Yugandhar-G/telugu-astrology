import { NextRequest, NextResponse } from 'next/server';
import { uploadPDF } from '@/lib/blob-storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File | null;
    const filename = (formData.get('filename') as string) || 'chart.pdf';

    if (!pdfFile) {
      return NextResponse.json(
        { success: false, error: 'Missing PDF file' },
        { status: 400 }
      );
    }

    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);
    const url = await uploadPDF(filename, pdfBuffer);

    return NextResponse.json({
      success: true,
      data: { url },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error uploading PDF:', msg);
    return NextResponse.json(
      { success: false, error: `Upload failed: ${msg}` },
      { status: 500 }
    );
  }
}
