'use client';

import { useState, useCallback, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { useKundali } from '@/hooks/useKundali';
import { KundaliChart } from '@/components/KundaliChart';
import { DatePicker } from '@/components/shared/DatePicker';
import { TimePicker } from '@/components/shared/TimePicker';
import { LocationPicker } from '@/components/LocationPicker';
import { Button } from '@/components/shared/Button';
import { Loading } from '@/components/shared/Loading';
import { TELUGU_LABELS } from '@/lib/constants/telugu-labels';
import { useAuth } from '@/context/AuthContext';
import { uploadPDFToDrive, saveChartLocally } from '@/lib/storage';
import { generateKundaliPDFBlob, generateKundaliPDF } from '@/lib/pdf/generator';
import { INDIAN_CITIES } from '@/lib/constants/cities';

const cityMap = new Map(INDIAN_CITIES.map(c => [c.name.toLowerCase(), c]));

export default function KundaliPage() {
  const { userLocation, timezone } = useApp();
  const { user } = useAuth();
  const { data, loading, error, generateKundali } = useKundali();

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState(userLocation.place);
  const [latitude, setLatitude] = useState(userLocation.latitude);
  const [longitude, setLongitude] = useState(userLocation.longitude);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [sankalpam, setSankalpam] = useState('');

  const selectedBirthDate = useMemo(() => {
    if (!birthDate) return new Date();
    const [y, m, d] = birthDate.split('-').map(Number);
    return new Date(y, m - 1, d, 12, 0, 0);
  }, [birthDate]);

  const handleDateChange = useCallback((date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    setBirthDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  async function handleGenerate() {
    if (!name || !birthDate || !birthTime) {
      alert('Please fill all required fields');
      return;
    }

    await generateKundali({
      name,
      birthDate,
      birthTime,
      birthPlace,
      latitude,
      longitude,
      timezone,
    });
  }

  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!data || !user) return;

    const chartEl = document.getElementById('kundali-chart');
    if (!chartEl) return;

    setSaving(true);
    try {
      const pdfBlob = await generateKundaliPDFBlob(chartEl);
      const filename = `kundali_${data.personName}.pdf`;
      await uploadPDFToDrive(filename, pdfBlob);
      saveChartLocally(data.personName, { ...data, sankalpam }, 'kundali');
      alert('PDF saved to cloud!');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Save error:', msg);
      alert(`Save failed: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        <span className="font-telugu">{TELUGU_LABELS.kundali.title}</span>
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Enter Birth Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {TELUGU_LABELS.kundali.name} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {TELUGU_LABELS.kundali.birthDate} *
            </label>
            <DatePicker
              selected={selectedBirthDate}
              onChange={handleDateChange}
              className="w-full"
            />

          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {TELUGU_LABELS.kundali.birthTime} * (HH:mm)
            </label>
            <TimePicker
              value={birthTime}
              onChange={setBirthTime}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {TELUGU_LABELS.kundali.birthPlace}
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={birthPlace}
                onChange={(e) => {
                  const place = e.target.value;
                  setBirthPlace(place);

                  const city = cityMap.get(place.toLowerCase());
                  if (city) {
                    setLatitude(city.lat);
                    setLongitude(city.lng);
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLocationPicker(!showLocationPicker)}
              >
                Pick Location
              </Button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="font-telugu">సంకల్పం</span> (Sankalpam)
            </label>
            <textarea
              value={sankalpam}
              onChange={(e) => setSankalpam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Enter Sankalpam text here..."
            />
          </div>
        </div>

        {showLocationPicker && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <LocationPicker
              onLocationSelect={(lat, lng, place) => {
                setLatitude(lat);
                setLongitude(lng);
                setBirthPlace(place);
                setShowLocationPicker(false);
              }}
              defaultLat={latitude}
              defaultLng={longitude}
              defaultPlace={birthPlace}
            />
          </div>
        )}

        <Button variant="primary" onClick={handleGenerate} isLoading={loading}>
          {TELUGU_LABELS.kundali.generate}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading && <Loading text={TELUGU_LABELS.common.loading} />}

      {data && (
        <div>
          <div className="mb-4 flex space-x-2">
            {user && (
              <Button
                variant="primary"
                onClick={handleSave}
                isLoading={saving}
                disabled={saving}
              >
                {saving ? 'Saving...' : `${TELUGU_LABELS.kundali.save} (Cloud)`}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={async () => {
                const el = document.getElementById('kundali-chart');
                if (el) await generateKundaliPDF(el, `kundali_${data.personName}.pdf`);
              }}
            >
              ↓ Download PDF
            </Button>
          </div>
          <div id="kundali-chart">
            <KundaliChart data={data} displayDate={birthDate} sankalpam={sankalpam} />
          </div>
        </div>
      )}
    </div>
  );
}
