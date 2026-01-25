'use client';

import React from 'react';

interface TeluguTextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

export function TeluguText({
  children,
  className = '',
  as: Component = 'span',
}: TeluguTextProps) {
  return (
    <Component className={`font-telugu ${className}`}>
      {children}
    </Component>
  );
}
