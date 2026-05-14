'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/shared/Button';
import { Loading } from '@/components/shared/Loading';
import { TELUGU_LABELS } from '@/lib/constants/telugu-labels';

interface SavedPDF {
  url: string;
  pathname: string;
  name: string;
  uploadedAt: string;
  size: number;
}

export default function SavedChartsPage() {
  const { user } = useAuth();
  const [pdfs, setPdfs] = useState<SavedPDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadPDFs();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function loadPDFs() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/drive/charts');
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setPdfs(json.data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(pdf: SavedPDF) {
    if (deletingUrl) return;
    const confirmed = window.confirm(`Delete "${pdf.name}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingUrl(pdf.url);
    setError(null);
    const previous = pdfs;
    setPdfs((current) => current.filter((p) => p.url !== pdf.url));

    try {
      const res = await fetch('/api/drive/charts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: pdf.url }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Delete failed');
    } catch (err) {
      setPdfs(previous);
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Could not delete: ${msg}`);
    } finally {
      setDeletingUrl(null);
    }
  }

  if (loading) {
    return <Loading text={TELUGU_LABELS.common.loading} />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        <span className="font-telugu">{TELUGU_LABELS.nav.saved}</span>
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <Button variant="outline" size="sm" onClick={loadPDFs} className="ml-2">
            Retry
          </Button>
        </div>
      )}

      {pdfs.length === 0 && !error ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No saved charts found.</p>
          <p className="text-sm text-gray-400 mt-1">
            Charts saved from the Kundali page will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pdfs.map((pdf) => {
            const isDeleting = deletingUrl === pdf.url;
            return (
              <div
                key={pdf.url}
                className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => window.open(pdf.url, '_blank')}
                  className="text-left flex-1"
                >
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {pdf.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(pdf.uploadedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {(pdf.size / 1024).toFixed(0)} KB
                  </p>
                  <p className="text-xs text-primary-600 mt-2">
                    Tap to open PDF
                  </p>
                </button>

                <div className="mt-3 flex justify-end border-t pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(pdf)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting…' : 'Delete'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
