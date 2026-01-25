'use client';

import React, { useRef } from 'react';
import { generateKundaliPDF, generateMatchmakingPDF } from '@/lib/pdf/generator';
import { Button } from './shared/Button';
import { TELUGU_LABELS } from '@/lib/constants/telugu-labels';

interface PDFGeneratorProps {
  type: 'kundali' | 'matchmaking';
  elementId: string;
  filename?: string;
}

export function PDFGenerator({ type, elementId, filename }: PDFGeneratorProps) {
  const handleDownload = async () => {
    const element = document.getElementById(elementId);
    if (!element) {
      alert('Element not found for PDF generation');
      return;
    }

    try {
      if (type === 'kundali') {
        await generateKundaliPDF(element, filename || 'kundali.pdf');
      } else {
        await generateMatchmakingPDF(element, filename || 'matchmaking.pdf');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  };

  return (
    <Button variant="primary" onClick={handleDownload}>
      {TELUGU_LABELS.kundali.downloadPDF}
    </Button>
  );
}
