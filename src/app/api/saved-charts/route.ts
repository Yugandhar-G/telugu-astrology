import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { APP_CONFIG } from '@/lib/constants/config';
import {
  getSavedCharts,
  saveChart,
  deleteChart,
} from '@/lib/supabase/db';
import { ApiResponse } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(request);
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    // If we have a token from client, use it to get user
    let user = null;
    let authError = null;
    let authenticatedSupabase = supabase;

    if (token) {
      authenticatedSupabase = createClient(
        APP_CONFIG.supabaseUrl,
        APP_CONFIG.supabaseAnonKey,
        { global: { headers: { Authorization: `Bearer ${token}` } } }
      );
      const result = await authenticatedSupabase.auth.getUser();
      user = result.data.user;
      authError = result.error;
    } else {
      // Fallback
      const result = await supabase.auth.getUser();
      user = result.data.user;
      authError = result.error;
    }

    if (authError || !user) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Unauthorized',
          // @ts-ignore
          debug: {
            hasUser: !!user,
            authError: authError?.message,
            cookies: request.cookies.getAll().map(c => c.name)
          }
        },
        { status: 401 }
      );
    }

    const charts = await getSavedCharts(user.id, authenticatedSupabase);

    return NextResponse.json<ApiResponse<typeof charts>>({
      success: true,
      data: charts,
    });
  } catch (error) {
    console.error('Get saved charts error:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch saved charts',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(request);
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    // If we have a token from client, use it to get user
    let user = null;
    let authError = null;
    let authenticatedSupabase = supabase;

    if (token) {
      authenticatedSupabase = createClient(
        APP_CONFIG.supabaseUrl,
        APP_CONFIG.supabaseAnonKey,
        { global: { headers: { Authorization: `Bearer ${token}` } } }
      );
      const result = await authenticatedSupabase.auth.getUser();
      user = result.data.user;
      authError = result.error;
    } else {
      // Fallback to cookie method (though likely to fail if client uses local storage)
      const result = await supabase.auth.getUser();
      user = result.data.user;
      authError = result.error;
    }

    if (authError || !user) {
      console.error('Auth error in save chart:', authError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Save chart request body:', { ...body, birthData: '...' }); // Log structure but truncate large data
    const { personName, birthData, chartType } = body;

    if (!personName || !birthData) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Missing required fields: personName, birthData',
        },
        { status: 400 }
      );
    }

    const chart = await saveChart(user.id, personName, birthData, chartType || 'kundali', authenticatedSupabase);

    return NextResponse.json<ApiResponse<typeof chart>>({
      success: true,
      data: chart,
    });
  } catch (error) {
    console.error('Save chart error:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save chart',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient(request);
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    // If we have a token from client, use it to get user
    let user = null;
    let authError = null;
    let authenticatedSupabase = supabase;

    if (token) {
      authenticatedSupabase = createClient(
        APP_CONFIG.supabaseUrl,
        APP_CONFIG.supabaseAnonKey,
        { global: { headers: { Authorization: `Bearer ${token}` } } }
      );
      const result = await authenticatedSupabase.auth.getUser();
      user = result.data.user;
      authError = result.error;
    } else {
      // Fallback
      const result = await supabase.auth.getUser();
      user = result.data.user;
      authError = result.error;
    }

    if (authError || !user) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const chartId = searchParams.get('id');

    if (!chartId) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Missing chart ID',
        },
        { status: 400 }
      );
    }

    await deleteChart(chartId, user.id, authenticatedSupabase);

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: 'Chart deleted successfully',
    });
  } catch (error) {
    console.error('Delete chart error:', error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete chart',
      },
      { status: 500 }
    );
  }
}
