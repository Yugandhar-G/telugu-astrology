// Hook for fetching and caching Panchang data

import { useState, useEffect, useRef } from 'react';
import { PanchangData } from '@/types/astrology';
import { formatDate } from '@/lib/utils/formatters';

// Simple in-memory cache for Panchang data
const panchangCache = new Map<string, PanchangData>();

export function usePanchang(
  date: Date | null,
  latitude: number,
  longitude: number,
  timezone: string = 'Asia/Kolkata'
) {
  const [data, setData] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use ref to track if we're already fetching
  const fetchingRef = useRef(false);

  // Stabilize the date string to prevent re-renders
  const dateStr = date ? formatDate(date, 'yyyy-MM-dd') : '';
  const latStr = latitude.toFixed(4);
  const lngStr = longitude.toFixed(4);

  useEffect(() => {
    if (!dateStr) return;

    const cacheKey = `panchang-${dateStr}-${latStr}-${lngStr}-${timezone}`;

    // Check cache first
    const cached = panchangCache.get(cacheKey);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    // Prevent duplicate fetches
    if (fetchingRef.current) return;

    async function fetchPanchang() {
      fetchingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/panchang?date=${dateStr}&lat=${latitude}&lng=${longitude}&timezone=${timezone}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch Panchang');
        }

        const result = await response.json();
        if (result.success && result.data) {
          // Cache the result - Panchang data for a date/location is immutable
          panchangCache.set(cacheKey, result.data);
          setData(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch Panchang');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    }

    fetchPanchang();
  }, [dateStr, latStr, lngStr, timezone, latitude, longitude]);

  return { data, loading, error };
}
