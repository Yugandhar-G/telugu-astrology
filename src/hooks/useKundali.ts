// Hook for generating Kundali

import { useState } from 'react';
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

export function useKundali() {
  const [data, setData] = useState<KundaliData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateKundali(request: KundaliRequest) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/kundali', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to generate Kundali');
      }

      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to generate Kundali');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, generateKundali };
}
