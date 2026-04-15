'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SavedChart } from '@/types/user';
import { KundaliChart } from '@/components/KundaliChart';
import { Button } from '@/components/shared/Button';
import { Loading } from '@/components/shared/Loading';
import { TELUGU_LABELS } from '@/lib/constants/telugu-labels';
import { PDFGenerator } from '@/components/PDFGenerator';
import { getDriveCharts, deleteChartFromDrive } from '@/lib/storage';

export default function SavedChartsPage() {
  const { user } = useAuth();
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState<SavedChart | null>(null);
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
      setError('Failed to load charts from Google Drive');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(chartId: string) {
    if (!confirm('Are you sure you want to delete this chart?')) {
      return;
    }

    setDeleting(chartId);
    try {
      await deleteChartFromDrive(chartId);
      setSavedCharts((prev) => prev.filter((c) => c.id !== chartId));
      if (selectedChart?.id === chartId) {
        setSelectedChart(null);
      }
    } catch (err) {
      console.error('Error deleting chart:', err);
      alert('Failed to delete chart from Drive');
    } finally {
      setDeleting(null);
    }
  }

  async function handleDownloadPDF(chartId: string, personName: string) {
    try {
      const res = await fetch(`/api/drive/charts/${chartId}/pdf`);
      if (!res.ok) {
        alert('PDF not found on Drive. Use the PDF generator to create one.');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kundali_${personName}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download PDF from Drive');
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
          <Button variant="outline" size="sm" onClick={loadCharts} className="ml-2">
            Retry
          </Button>
        </div>
      )}

      {savedCharts.length === 0 && !error ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No saved charts found.</p>
          <p className="text-sm text-gray-400 mt-1">
            Charts saved from the Kundali page will appear here (stored in Google Drive).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Saved Charts</h2>
                <span className="text-xs text-gray-400">Google Drive</span>
              </div>
              <div className="space-y-2">
                {savedCharts.map((chart) => (
                  <div
                    key={chart.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedChart?.id === chart.id
                      ? 'bg-primary-100 border-2 border-primary-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    onClick={() => setSelectedChart(chart)}
                  >
                    <div className="font-semibold">{chart.personName}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(chart.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedChart ? (
              <div>
                <div className="mb-4 flex flex-wrap gap-2">
                  <PDFGenerator
                    type="kundali"
                    elementId={`chart-${selectedChart.id}`}
                    filename={`kundali_${selectedChart.personName}.pdf`}
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleDownloadPDF(selectedChart.id, selectedChart.personName)
                    }
                  >
                    ↓ From Drive
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(selectedChart.id)}
                    isLoading={deleting === selectedChart.id}
                    disabled={deleting === selectedChart.id}
                  >
                    {TELUGU_LABELS.common.delete}
                  </Button>
                </div>
                <div id={`chart-${selectedChart.id}`}>
                  <KundaliChart
                    data={selectedChart.birthData}
                    sankalpam={selectedChart.birthData.sankalpam}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600">Select a chart to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
