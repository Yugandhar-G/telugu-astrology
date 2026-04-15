'use client';

import React from 'react';
import { PanchangData } from '@/types/astrology';
import { TELUGU_LABELS } from '@/lib/constants/telugu-labels';
import { TeluguText } from './shared/TeluguText';
import { formatTeluguDate } from '@/lib/utils/formatters';

interface PanchangCardProps {
  data: PanchangData;
}

export function PanchangCard({ data }: PanchangCardProps) {
  const items = [
    { label: 'సంవత్సరం', value: data.samvatsara },
    { label: TELUGU_LABELS.panchang.masa, value: data.masa },
    { label: 'సౌర మాసం', value: data.teluguMasa },
    { label: TELUGU_LABELS.panchang.paksha, value: data.paksha },
    { label: TELUGU_LABELS.panchang.tithi, value: data.tithi },
    { label: TELUGU_LABELS.panchang.nakshatra, value: data.nakshatra },
    { label: TELUGU_LABELS.panchang.yoga, value: data.yoga },
    { label: TELUGU_LABELS.panchang.karana, value: data.karana },
  ];

  const timings = [
    { label: TELUGU_LABELS.panchang.sunrise, value: data.sunrise },
    { label: TELUGU_LABELS.panchang.sunset, value: data.sunset },
    {
      label: TELUGU_LABELS.panchang.rahuKalam,
      value: `${data.rahuKalam.start} - ${data.rahuKalam.end}`,
    },
    {
      label: TELUGU_LABELS.panchang.yamagandam,
      value: `${data.yamagandam.start} - ${data.yamagandam.end}`,
    },
    {
      label: TELUGU_LABELS.panchang.gulikaKalam,
      value: `${data.gulikaKalam.start} - ${data.gulikaKalam.end}`,
    },
    {
      label: TELUGU_LABELS.panchang.abhijitMuhurtham,
      value: `${data.abhijitMuhurtham.start} - ${data.abhijitMuhurtham.end}`,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-primary-600">
        <TeluguText>{TELUGU_LABELS.panchang.title}</TeluguText>
      </h2>
      <p className="text-gray-600 mb-6">{formatTeluguDate(data.date)}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            <TeluguText>పంచాంగ వివరాలు</TeluguText>
          </h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b">
                <span className="font-medium text-gray-700">
                  <TeluguText>{item.label}</TeluguText>
                </span>
                <span className="text-gray-900 font-semibold">
                  <TeluguText>{item.value}</TeluguText>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            <TeluguText>సమయాలు</TeluguText>
          </h3>
          <div className="space-y-3">
            {timings.map((timing) => (
              <div key={timing.label} className="flex justify-between items-center py-2 border-b">
                <span className="font-medium text-gray-700">
                  <TeluguText>{timing.label}</TeluguText>
                </span>
                <span className="text-gray-900 font-semibold">{timing.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
