import { NextRequest, NextResponse } from 'next/server';
import { getTimezoneFromCoords, resolveTimezoneOffset } from '@/lib/utils/timezone';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { success: false, error: 'Invalid or missing lat/lng' },
      { status: 400 }
    );
  }

  const timezone = getTimezoneFromCoords(lat, lng);
  const offsetHours = resolveTimezoneOffset(timezone, new Date());

  const sign = offsetHours >= 0 ? '+' : '-';
  const abs = Math.abs(offsetHours);
  const hh = String(Math.floor(abs)).padStart(2, '0');
  const mm = String(Math.round((abs - Math.floor(abs)) * 60)).padStart(2, '0');
  const offsetLabel = `UTC${sign}${hh}:${mm}`;

  return NextResponse.json({
    success: true,
    data: { timezone, offsetHours, offsetLabel },
  });
}
