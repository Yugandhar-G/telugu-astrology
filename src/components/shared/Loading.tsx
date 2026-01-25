'use client';

import React from 'react';
import { TELUGU_LABELS } from '@/lib/constants/telugu-labels';

interface LoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loading({ text, size = 'md' }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="text-xl font-bold text-primary-600">
        {text || 'Loading...'}
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span className="text-primary-600">...</span>
  );
}
