import { NextRequest, NextResponse } from 'next/server';
import { fetchMatchmaking } from '@/lib/vedastro/api';
import { transformMatchmakingResponse } from '@/lib/vedastro/transformers';
import { ApiResponse } from '@/types/api';
import { KundaliData } from '@/types/astrology';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { person1Chart, person2Chart } = body;

    if (!person1Chart || !person2Chart) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Missing required fields: person1Chart, person2Chart',
        },
        { status: 400 }
      );
    }

    const p1 = person1Chart as KundaliData;
    const p2 = person2Chart as KundaliData;

    const response = await fetchMatchmaking({
      person1: {
        name: p1.personName,
        birthDate: p1.birthDate,
        birthTime: p1.birthTime,
        latitude: p1.latitude,
        longitude: p1.longitude,
        timezone: p1.timezone,
      },
      person2: {
        name: p2.personName,
        birthDate: p2.birthDate,
        birthTime: p2.birthTime,
        latitude: p2.latitude,
        longitude: p2.longitude,
        timezone: p2.timezone,
      },
    });

    const transformedData = transformMatchmakingResponse(response, p1, p2);

    return NextResponse.json<ApiResponse<typeof transformedData>>({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.error('Matchmaking API error:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to calculate matchmaking',
      },
      { status: 500 }
    );
  }
}
