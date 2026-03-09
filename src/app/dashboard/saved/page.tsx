'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SavedChart } from '@/types/user';
import { KundaliChart } from '@/components/KundaliChart';
import { Button } from '@/components/shared/Button';
import { Loading } from '@/components/shared/Loading';
import { TELUGU_LABELS } from '@/lib/constants/telugu-labels';
import { PDFGenerator } from '@/components/PDFGenerator';
import { getSavedCharts, deleteChart } from '@/lib/storage';

export default function SavedChartsPage() {
  const { user } = useAuth();
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState<SavedChart | null>(null);

  useEffect(() => {
    if (user) {
      setSavedCharts(getSavedCharts());
    }
    setLoading(false);
  }, [user]);

  function handleDelete(chartId: string) {
    if (!confirm('Are you sure you want to delete this chart?')) {
      return;
    }

    try {
      deleteChart(chartId);
      setSavedCharts(getSavedCharts());
      if (selectedChart?.id === chartId) {
        setSelectedChart(null);
      }
    } catch (error) {
      console.error('Error deleting chart:', error);
      alert('Failed to delete chart');
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

      {savedCharts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No saved charts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4">Saved Charts</h2>
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
                <div className="mb-4 flex space-x-2">
                  <PDFGenerator
                    type="kundali"
                    elementId={`chart-${selectedChart.id}`}
                    filename={`kundali_${selectedChart.personName}.pdf`}
                  />
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(selectedChart.id)}
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
