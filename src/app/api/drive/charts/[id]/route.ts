import { NextRequest, NextResponse } from 'next/server';
import {
  listChartBlobs,
  getChartJSON,
  deleteChartBlob,
} from '@/lib/blob-storage';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blobs = await listChartBlobs();
    const blob = blobs.find((b) => b.pathname === `charts/${id}.json`);

    if (!blob) {
      return NextResponse.json(
        { success: false, error: 'Chart not found' },
        { status: 404 }
      );
    }

    const chartData = await getChartJSON(blob.url);
    return NextResponse.json({ success: true, data: chartData });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: `Get failed: ${msg}` },
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
    await deleteChartBlob(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: `Delete failed: ${msg}` },
      { status: 500 }
    );
  }
}
