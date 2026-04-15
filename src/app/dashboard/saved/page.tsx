'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SavedChart } from '@/types/user';
import { Button } from '@/components/shared/Button';
import { Loading } from '@/components/shared/Loading';
import { TELUGU_LABELS } from '@/lib/constants/telugu-labels';
import { getDriveCharts, deleteChartFromDrive } from '@/lib/storage';

export default function SavedChartsPage() {
  const { user } = useAuth();
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadCharts();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function loadCharts() {
    setLoading(true);
    setError(null);
    try {
      const charts = await getDriveCharts();
      setSavedCharts(charts);
    } catch (err) {
      console.error('Error loading charts:', err);
      setError('Failed to load saved charts');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(chartId: string) {
    if (!confirm('Are you sure you want to delete this chart?')) return;

    setDeleting(chartId);
    try {
      await deleteChartFromDrive(chartId);
      setSavedCharts((prev) => prev.filter((c) => c.id !== chartId));
    } catch (err) {
      console.error('Error deleting chart:', err);
      alert('Failed to delete chart');
    } finally {
      setDeleting(null);
    }
  }

  function handleOpenPDF(chartId: string) {
    window.open(`/api/drive/charts/${chartId}/pdf`, '_blank');
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
          <Button variant="outline" size="sm" onClick={loadCharts} className="ml-2">
            Retry
          </Button>
        </div>
      )}

      {savedCharts.length === 0 && !error ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No saved charts found.</p>
          <p className="text-sm text-gray-400 mt-1">
            Charts saved from the Kundali page will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedCharts.map((chart) => (
            <div
              key={chart.id}
              className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleOpenPDF(chart.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {chart.personName}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(chart.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-xs text-primary-600 mt-2">
                    Tap to open PDF
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(chart.id);
                  }}
                  isLoading={deleting === chart.id}
                  disabled={deleting === chart.id}
                >
                  {TELUGU_LABELS.common.delete}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
