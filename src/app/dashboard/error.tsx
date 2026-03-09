'use client';

import { useEffect } from 'react';
import { Button } from '@/components/shared/Button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-telugu">
          ఏదో తప్పు జరిగింది
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <Button variant="primary" onClick={reset}>
          మళ్ళీ ప్రయత్నించండి
        </Button>
      </div>
    </div>
  );
}
