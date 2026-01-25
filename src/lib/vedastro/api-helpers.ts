// Helper functions for VedAstro API integration
// Use these to format requests and handle responses

import { formatDate, formatTime } from '../utils/formatters';
import { KundaliRequest, PanchangRequest } from './types';

/**
 * Format date for VedAstro API
 * Expected format: YYYY-MM-DD
 */
export function formatDateForAPI(date: string | Date): string {
  if (typeof date === 'string') {
    return date;
  }
  return formatDate(date, 'yyyy-MM-dd');
}

/**
 * Format time for VedAstro API
 * Expected format: HH:mm (24-hour format)
 */
export function formatTimeForAPI(time: string): string {
  // Ensure time is in HH:mm format
  if (time.includes(':')) {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }
  return time;
}

/**
 * Validate and format Panchang request
 */
export function formatPanchangRequest(request: PanchangRequest): Record<string, any> {
  return {
    date: formatDateForAPI(request.date),
    latitude: request.latitude,
    longitude: request.longitude,
    timezone: request.timezone || 'Asia/Kolkata',
  };
}

/**
 * Validate and format Kundali request
 */
export function formatKundaliRequest(request: KundaliRequest): Record<string, any> {
  return {
    name: request.name,
    birthDate: formatDateForAPI(request.birthDate),
    birthTime: formatTimeForAPI(request.birthTime),
    latitude: request.latitude,
    longitude: request.longitude,
    timezone: request.timezone || 'Asia/Kolkata',
  };
}

/**
 * Handle API errors with user-friendly messages
 */
export function handleVedAstroError(error: unknown): string {
  if (error instanceof Error) {
    // Check for common error patterns
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      return 'Invalid API key. Please check your VedAstro API credentials.';
    }
    if (error.message.includes('429') || error.message.includes('rate limit')) {
      return 'API rate limit exceeded. Please try again later.';
    }
    if (error.message.includes('400') || error.message.includes('Bad Request')) {
      return 'Invalid request parameters. Please check your input.';
    }
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Check if API key is configured
 */
export function isApiKeyConfigured(): boolean {
  return !!process.env.VEDASTRO_API_KEY || !!process.env.NEXT_PUBLIC_VEDASTRO_API_KEY;
}
