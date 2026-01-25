import { NextRequest, NextResponse } from 'next/server';
import { fetchKundali } from '@/lib/vedastro/api';
import { transformKundaliResponse } from '@/lib/vedastro/transformers';
import { ApiResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      birthDate,
      birthTime,
      birthPlace,
      latitude,
      longitude,
      timezone = 'Asia/Kolkata',
    } = body;

    if (!name || !birthDate || !birthTime || latitude === undefined || longitude === undefined) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Missing required fields: name, birthDate, birthTime, latitude, longitude',
        },
        { status: 400 }
      );
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Invalid coordinates',
        },
        { status: 400 }
      );
    }

    const response = await fetchKundali({
      name,
      birthDate,
      birthTime,
      latitude: lat,
      longitude: lng,
      timezone,
    });

    const transformedData = transformKundaliResponse(
      response,
      name,
      birthDate,
      birthTime,
      birthPlace || 'Unknown',
      lat,
      lng,
      timezone
    );

    return NextResponse.json<ApiResponse<typeof transformedData>>({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.error('Kundali API error:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate Kundali',
      },
      { status: 500 }
    );
  }
}
