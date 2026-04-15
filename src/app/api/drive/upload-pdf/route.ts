import { NextRequest, NextResponse } from 'next/server';
import { uploadPDF } from '@/lib/google-drive';

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
    const fileId = await uploadPDF(filename, pdfBuffer);

    return NextResponse.json({
      success: true,
      data: { fileId },
    });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload PDF to Drive' },
      { status: 500 }
    );
  }
}
