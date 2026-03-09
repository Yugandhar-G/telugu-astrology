'use client';

import React from 'react';

interface LoadingProps {
  text?: string;
}

export function Loading({ text }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="text-xl font-bold text-primary-600">
        {text || 'Loading...'}
      </div>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <span className="text-primary-600">...</span>
  );
}
