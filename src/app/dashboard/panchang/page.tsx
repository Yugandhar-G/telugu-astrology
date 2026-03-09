'use client';

import { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { usePanchang } from '@/hooks/usePanchang';
import { PanchangCard } from '@/components/PanchangCard';
import { DatePicker } from '@/components/shared/DatePicker';
import { Loading } from '@/components/shared/Loading';
import { TELUGU_LABELS } from '@/lib/constants/telugu-labels';

// Get current date in Indian timezone (IST = UTC+5:30)
function getIndianDate(): Date {
  const now = new Date();
  // Convert to IST by adding 5.5 hours to UTC
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const istTime = new Date(utcTime + istOffset);
  // Return a date object for that calendar day at noon (to avoid day boundary issues)
  return new Date(istTime.getFullYear(), istTime.getMonth(), istTime.getDate(), 12, 0, 0);
}

export default function PanchangPage() {
  const { userLocation, timezone } = useApp();
  // Initialize with safe default to prevent hydration mismatch
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Always use current Indian date, not local machine date
    setSelectedDate(getIndianDate());
  }, []);

  // Pass null to usePanchang when not mounted - it will handle it
  const { data, loading, error } = usePanchang(
    selectedDate,
    userLocation.latitude,
    userLocation.longitude,
    timezone
  );

  // Memoize the date for DatePicker
  const pickerDate = useMemo(() => selectedDate || new Date(), [selectedDate]);

  if (!mounted) {
    return null; // Or a skeleton
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          <span className="font-telugu">{TELUGU_LABELS.panchang.title}</span>
        </h1>
        <div className="mb-4 max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <DatePicker
            selected={pickerDate}
            onChange={setSelectedDate}
          />
        </div>
        <p className="text-gray-600">
          Location: {userLocation.place} ({userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)})
        </p>
      </div>

      {loading && <Loading text={TELUGU_LABELS.common.loading} />}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {data && <PanchangCard data={data} />}
    </div>
  );
}
