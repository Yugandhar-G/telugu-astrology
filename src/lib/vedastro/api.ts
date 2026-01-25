// VedAstro API wrapper
// Based on VedAstro API Builder documentation

import { APP_CONFIG } from '../constants/config';
import {
  PanchangRequest,
  KundaliRequest,
  MatchmakingRequest,
} from './types';
import {
  VedAstroPanchangResponse,
  VedAstroKundaliResponse,
  VedAstroMatchmakingResponse,
} from '@/types/api';

const API_BASE_URL = APP_CONFIG.vedAstroApiUrl || 'https://api.vedastro.org';
const API_KEY = APP_CONFIG.vedAstroApiKey;

async function fetchVedAstro<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST';
    params?: Record<string, any>;
    body?: Record<string, any>;
  } = {}
): Promise<T> {
  const { method = 'GET', params = {}, body } = options;
  const url = new URL(endpoint, API_BASE_URL);

  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  // Add API key if available (as query parameter)
  if (API_KEY) {
    url.searchParams.append('api_key', API_KEY);
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add body for POST requests
  if (method === 'POST' && body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), fetchOptions);

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `VedAstro API error: ${response.statusText}`;

    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.error || errorMessage;
    } catch {
      // If not JSON, use the text as error message
      if (errorText) {
        errorMessage = errorText;
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

import { calculatePanchang, calculateKundali } from '../vedic-math';

// Helper to parse timezone string (+05:30) to decimal hours (5.5)
function parseTimezone(tz: string): number {
  if (!tz) return 5.5; // Default IST
  const match = tz.match(/([+-])(\d{1,2}):(\d{2})/);
  if (match) {
    const sign = match[1] === '-' ? -1 : 1;
    const hours = parseInt(match[2], 10);
    const minutes = parseInt(match[3], 10);
    return sign * (hours + minutes / 60);
  }
  const num = parseFloat(tz);
  return isNaN(num) ? 5.5 : num;
}

export async function fetchPanchang(
  request: PanchangRequest
): Promise<VedAstroPanchangResponse> {
  // Local calculation using astronomy-engine
  try {
    const dateParts = request.date.split('-').map(Number);
    // Use Noon (12:00) Local Time as reference for the day
    const hour = 12;
    const minute = 0;

    // Create date as if it were UTC first
    const date = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], hour, minute));

    // Adjust for timezone to get the actual UTC timestamp for 12:00 PM Local Time
    const tzOffset = parseTimezone(request.timezone || '+05:30');
    // UTC = Local - Offset
    // We modify the hours. 
    // Example: 12:00 Local IST (+5.5) -> 06:30 UTC
    date.setMinutes(date.getMinutes() - (tzOffset * 60));

    const result = calculatePanchang(date, {
      latitude: request.latitude,
      longitude: request.longitude,
      timezone: request.timezone,
    });

    return {
      tithi: result.tithi,
      nakshatra: result.nakshatra,
      yoga: result.yoga,
      karana: result.karana,
      vara: result.vara,
      masa: result.masa,
      paksha: result.paksha,
      sunrise: result.sunrise,
      sunset: result.sunset,
      rahuKalam: result.rahuKalam,
      yamagandam: result.yamagandam,
      gulikaKalam: result.gulikaKalam,
      abhijitMuhurtham: result.abhijitMuhurtham,
    };
  } catch (error) {
    console.error("Error calculating Panchang locally:", error);
    // Fallback to error response or simple catch
    throw new Error("Failed to calculate Panchang locally");
  }
}

export async function fetchKundali(
  request: KundaliRequest
): Promise<VedAstroKundaliResponse> {
  // Use local calculation
  try {
    const dateParts = request.birthDate.split('-').map(Number);
    const timeParts = request.birthTime.split(':').map(Number);

    // Construct Date object using Date.UTC to avoid local timezone interference
    const date = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1]));

    // Adjust for timezone to get UTC
    const tzOffset = parseTimezone(request.timezone || '+05:30');
    // We modify the minutes. 
    // Example: 10:00 Input. Date.UTC says 10:00 UTC. 
    // If timezone is +05:30. 10:00 Local = 04:30 UTC.
    // So we subtract the offset.
    date.setMinutes(date.getMinutes() - (tzOffset * 60));

    // Calculate
    const result = calculateKundali(date, {
      latitude: request.latitude,
      longitude: request.longitude,
      timezone: request.timezone
    });

    return result;
  } catch (error) {
    console.error("Error calculating Kundali locally:", error);
    throw new Error("Failed to calculate Kundali locally");
  }
}

export async function fetchMatchmaking(
  request: MatchmakingRequest
): Promise<VedAstroMatchmakingResponse> {
  // Use getmatchreport endpoint which exists in Docker
  return fetchVedAstro<VedAstroMatchmakingResponse>('/api/getmatchreport', {
    method: 'POST',
    body: {
      Boy: {
        Name: request.person1.name,
        Time: { StdTime: `${request.person1.birthTime} ${request.person1.birthDate.split('-').reverse().join('/')} ${request.person1.timezone || '+05:30'}`, Location: { Latitude: request.person1.latitude, Longitude: request.person1.longitude } }
      },
      Girl: {
        Name: request.person2.name,
        Time: { StdTime: `${request.person2.birthTime} ${request.person2.birthDate.split('-').reverse().join('/')} ${request.person2.timezone || '+05:30'}`, Location: { Latitude: request.person2.latitude, Longitude: request.person2.longitude } }
      }
    },
  });
}

// Additional helper function to fetch Indian chart as SVG
export async function fetchIndianChart(
  request: KundaliRequest,
  chartType: 'South' | 'North' = 'South'
): Promise<string> {
  // Returns SVG string for the chart
  const response = await fetchVedAstro<{ svg: string }>('/api/Chart/Indian', {
    method: 'POST',
    body: {
      birthDate: request.birthDate,
      birthTime: request.birthTime,
      latitude: request.latitude,
      longitude: request.longitude,
      timezone: request.timezone || 'Asia/Kolkata',
      chartType,
    },
  });

  return response.svg || '';
}
