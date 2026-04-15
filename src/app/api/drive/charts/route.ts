import { NextRequest, NextResponse } from 'next/server';
import {
  listChartBlobs,
  getChartJSON,
  uploadChartJSON,
  uploadChartPDF,
} from '@/lib/blob-storage';

export async function GET() {
  try {
    const blobs = await listChartBlobs();

    const charts = await Promise.all(
      blobs.map(async (blob) => {
        try {
          return await getChartJSON(blob.url);
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
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error listing charts:', msg);
    return NextResponse.json(
      { success: false, error: `List failed: ${msg}` },
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

    const dataUrl = await uploadChartJSON(chartId, chartData);

    let pdfUrl: string | null = null;
    if (pdfFile) {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfBuffer = Buffer.from(arrayBuffer);
      pdfUrl = await uploadChartPDF(
        chartId,
        chartData.personName || 'chart',
        pdfBuffer
      );
    }

    return NextResponse.json({
      success: true,
      data: { chartId, dataUrl, pdfUrl },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error saving chart:', msg);
    return NextResponse.json(
      { success: false, error: `Save failed: ${msg}` },
      { status: 500 }
    );
  }
}
