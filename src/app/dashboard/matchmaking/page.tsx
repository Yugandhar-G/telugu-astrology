'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MatchmakingScore } from '@/components/MatchmakingScore';
import { PDFGenerator } from '@/components/PDFGenerator';
import { Button } from '@/components/shared/Button';
import { Loading } from '@/components/shared/Loading';
import { TELUGU_LABELS } from '@/lib/constants/telugu-labels';
import { SavedChart } from '@/types/user';
import { MatchmakingData } from '@/types/astrology';
import { getSavedCharts } from '@/lib/storage';

export default function MatchmakingPage() {
  const { user } = useAuth();
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([]);
  const [person1Id, setPerson1Id] = useState<string>('');
  const [person2Id, setPerson2Id] = useState<string>('');
  const [matchmakingData, setMatchmakingData] = useState<MatchmakingData | null>(null);
  const [chartsLoading, setChartsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSavedCharts();
    }
  }, [user]);

  function loadSavedCharts() {
    setChartsLoading(true);
    try {
      setSavedCharts(getSavedCharts());
    } catch (err) {
      console.error('Error loading saved charts:', err);
    } finally {
      setChartsLoading(false);
    }
  }

  async function handleCalculate() {
    if (!person1Id || !person2Id) {
      alert('Please select both persons');
      return;
    }

    const chart1 = savedCharts.find((c) => c.id === person1Id);
    const chart2 = savedCharts.find((c) => c.id === person2Id);

    if (!chart1 || !chart2) {
      alert('Charts not found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/matchmaking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          person1Chart: chart1.birthData,
          person2Chart: chart2.birthData,
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        setMatchmakingData(result.data);
      } else {
        setError(result.error || 'Failed to calculate matchmaking');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        <span className="font-telugu">{TELUGU_LABELS.matchmaking.title}</span>
      </h1>

      {chartsLoading ? (
        <Loading text="Loading charts from Drive..." />
      ) : savedCharts.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>No saved charts found. Please create and save kundalis first.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Select Charts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {TELUGU_LABELS.matchmaking.selectPerson1}
                </label>
                <select
                  value={person1Id}
                  onChange={(e) => setPerson1Id(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select...</option>
                  {savedCharts.map((chart) => (
                    <option key={chart.id} value={chart.id}>
                      {chart.personName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {TELUGU_LABELS.matchmaking.selectPerson2}
                </label>
                <select
                  value={person2Id}
                  onChange={(e) => setPerson2Id(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select...</option>
                  {savedCharts.map((chart) => (
                    <option key={chart.id} value={chart.id}>
                      {chart.personName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button variant="primary" onClick={handleCalculate} isLoading={loading}>
              {TELUGU_LABELS.matchmaking.calculate}
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {loading && <Loading text={TELUGU_LABELS.common.loading} />}

          {matchmakingData && (
            <div>
              <div className="mb-4">
                <PDFGenerator
                  type="matchmaking"
                  elementId="matchmaking-score"
                  filename={`matchmaking_${matchmakingData.person1Chart.personName}_${matchmakingData.person2Chart.personName}.pdf`}
                />
              </div>
              <div id="matchmaking-score">
                <MatchmakingScore data={matchmakingData} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
