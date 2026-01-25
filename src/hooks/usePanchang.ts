// Hook for fetching and caching Panchang data

import { useState, useEffect } from 'react';
import { PanchangData } from '@/types/astrology';
import { formatDate } from '@/lib/utils/formatters';

export function usePanchang(
  date: Date,
  latitude: number,
  longitude: number,
  timezone: string = 'Asia/Kolkata'
) {
  const [data, setData] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPanchang() {
      setLoading(true);
      setError(null);

      try {
        const dateStr = formatDate(date, 'yyyy-MM-dd');
        const response = await fetch(
          `/api/panchang?date=${dateStr}&lat=${latitude}&lng=${longitude}&timezone=${timezone}`,
          { cache: 'no-store' }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch Panchang');
        }

        const result = await response.json();
        if (result.success && result.data) {
          setData(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch Panchang');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchPanchang();
  }, [date, latitude, longitude, timezone]);

  return { data, loading, error };
}
