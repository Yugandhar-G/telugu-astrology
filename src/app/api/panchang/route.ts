import { NextRequest, NextResponse } from 'next/server';
import { fetchPanchang } from '@/lib/vedastro/api';
import { transformPanchangResponse } from '@/lib/vedastro/transformers';
import { getTimezoneFromCoords } from '@/lib/utils/timezone';
import { ApiResponse } from '@/types/api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!date || !lat || !lng) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Missing required parameters: date, lat, lng',
        },
        { status: 400 }
      );
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Invalid coordinates',
        },
        { status: 400 }
      );
    }

    const timezone = getTimezoneFromCoords(latitude, longitude);

    const response = await fetchPanchang({
      date,
      latitude,
      longitude,
      timezone,
    });

    const transformedData = transformPanchangResponse(
      response,
      date,
      latitude,
      longitude
    );

    return NextResponse.json<ApiResponse<typeof transformedData>>({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.error('Panchang API error:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch Panchang',
      },
      { status: 500 }
    );
  }
}
