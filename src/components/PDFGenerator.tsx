'use client';

import React, { useState } from 'react';
import {
  generateMatchmakingPDF,
  generateMatchmakingPDFBlob,
} from '@/lib/pdf/generator';
import { uploadPDFToDrive } from '@/lib/storage';
import { Button } from './shared/Button';

interface PDFGeneratorProps {
  type: 'kundali' | 'matchmaking';
  elementId: string;
  filename?: string;
}

export function PDFGenerator({ elementId, filename }: PDFGeneratorProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveToDrive = async () => {
    const element = document.getElementById(elementId);
    if (!element) return;

    setSaving(true);
    try {
      const blob = await generateMatchmakingPDFBlob(element);
      const pdfFilename = filename || 'matchmaking.pdf';
      await uploadPDFToDrive(pdfFilename, blob);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Error saving PDF:', msg);
      alert(`Save failed: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      await generateMatchmakingPDF(element, filename || 'matchmaking.pdf');
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
        {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save to Cloud'}
      </Button>
      <Button variant="outline" onClick={handleDownload}>
        ↓ Download PDF
      </Button>
    </div>
  );
}
