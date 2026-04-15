'use client';

import React, { useState } from 'react';
import {
  generateKundaliPDF,
  generateMatchmakingPDF,
  generateKundaliPDFBlob,
  generateMatchmakingPDFBlob,
} from '@/lib/pdf/generator';
import { uploadPDFToDrive } from '@/lib/storage';
import { Button } from './shared/Button';
import { TELUGU_LABELS } from '@/lib/constants/telugu-labels';

interface PDFGeneratorProps {
  type: 'kundali' | 'matchmaking';
  elementId: string;
  filename?: string;
}

export function PDFGenerator({ type, elementId, filename }: PDFGeneratorProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveToDrive = async () => {
    const element = document.getElementById(elementId);
    if (!element) {
      alert('Element not found for PDF generation');
      return;
    }

    setSaving(true);
    try {
      const blob =
        type === 'kundali'
          ? await generateKundaliPDFBlob(element)
          : await generateMatchmakingPDFBlob(element);

      const pdfFilename = filename || `${type}.pdf`;
      await uploadPDFToDrive(pdfFilename, blob);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving PDF to Drive:', error);
      alert('Failed to save PDF to Drive. Downloading locally instead.');
      handleDownload();
    } finally {
      setSaving(false);
    }
  };

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
    <div className="flex space-x-2">
      <Button
        variant="primary"
        onClick={handleSaveToDrive}
        isLoading={saving}
        disabled={saving}
      >
        {saved
          ? '✓ Saved to Drive'
          : saving
            ? 'Saving...'
            : `${TELUGU_LABELS.kundali.downloadPDF} (Drive)`}
      </Button>
      <Button variant="outline" onClick={handleDownload}>
        ↓ Local
      </Button>
    </div>
  );
}
