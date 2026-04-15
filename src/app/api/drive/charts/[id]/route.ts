import { NextRequest, NextResponse } from 'next/server';
import {
  listChartFiles,
  getFileContent,
  deleteFile,
  findPDFForChart,
} from '@/lib/google-drive';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const files = await listChartFiles();
    const file = files.find((f) => f.name === `chart_${id}.json`);

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Chart not found' },
        { status: 404 }
      );
    }

    const content = await getFileContent(file.id);
    const chartData = JSON.parse(content);

    return NextResponse.json({ success: true, data: chartData });
  } catch (error) {
    console.error('Error getting chart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get chart from Drive' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const files = await listChartFiles();
    const file = files.find((f) => f.name === `chart_${id}.json`);
    if (file) {
      await deleteFile(file.id);
    }

    const pdfFileId = await findPDFForChart(id);
    if (pdfFileId) {
      await deleteFile(pdfFileId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete chart from Drive' },
      { status: 500 }
    );
  }
}
