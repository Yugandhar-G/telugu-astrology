// Hook for generating Kundali

import { useState, useCallback, useRef } from 'react';
import { KundaliData } from '@/types/astrology';

interface KundaliRequest {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

// Cache for Kundali calculations - birth charts never change
const kundaliCache = new Map<string, KundaliData>();

function getCacheKey(request: KundaliRequest): string {
  return `kundali-${request.birthDate}-${request.birthTime}-${request.latitude.toFixed(4)}-${request.longitude.toFixed(4)}-${request.timezone || 'default'}`;
}

export function useKundali() {
  const [data, setData] = useState<KundaliData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateKundali = useCallback(async (request: KundaliRequest) => {
    // Check cache first
    const cacheKey = getCacheKey(request);
    const cached = kundaliCache.get(cacheKey);
    if (cached) {
      // Update with current name (name doesn't affect calculation)
      setData({ ...cached, personName: request.name });
      return;
    }

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/kundali', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to generate Kundali');
      }

      const result = await response.json();
      if (result.success && result.data) {
        // Cache the result
        kundaliCache.set(cacheKey, result.data);
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to generate Kundali');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Request was cancelled, ignore
      }
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, generateKundali };
}
