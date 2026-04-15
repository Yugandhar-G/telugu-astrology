import { NextRequest, NextResponse } from 'next/server';
import {
  listChartFiles,
  getFileContent,
  uploadJSON,
  uploadPDF,
} from '@/lib/google-drive';

export async function GET() {
  try {
    const files = await listChartFiles();

    const charts = await Promise.all(
      files.map(async (file) => {
        try {
          const content = await getFileContent(file.id);
          return JSON.parse(content);
        } catch {
          return null;
        }
      })
    );

    return NextResponse.json({
      success: true,
      data: charts.filter(Boolean),
    });
  } catch (error) {
    console.error('Error listing charts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list charts from Drive' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const chartDataStr = formData.get('chartData') as string;
    const pdfFile = formData.get('pdf') as File | null;

    if (!chartDataStr) {
      return NextResponse.json(
        { success: false, error: 'Missing chart data' },
        { status: 400 }
      );
    }

    const chartData = JSON.parse(chartDataStr);
    const chartId =
      chartData.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    chartData.id = chartId;

    if (!chartData.createdAt) {
      chartData.createdAt = new Date().toISOString();
    }
    chartData.updatedAt = new Date().toISOString();

    const dataFilename = `chart_${chartId}.json`;
    const dataFileId = await uploadJSON(dataFilename, chartData);

    let pdfFileId: string | null = null;
    if (pdfFile) {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfBuffer = Buffer.from(arrayBuffer);
      const pdfFilename = `kundali_${chartData.personName || 'chart'}_${chartId}.pdf`;
      pdfFileId = await uploadPDF(pdfFilename, pdfBuffer);
    }

    return NextResponse.json({
      success: true,
      data: {
        chartId,
        dataFileId,
        pdfFileId,
      },
    });
  } catch (error) {
    console.error('Error saving chart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save chart to Drive' },
      { status: 500 }
    );
  }
}
