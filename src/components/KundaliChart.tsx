'use client';

import React from 'react';
import { KundaliData } from '@/types/astrology';
import { TELUGU_LABELS, translateToTelugu } from '@/lib/constants/telugu-labels';
import { TeluguText } from './shared/TeluguText';
import { SouthIndianChart } from './charts/SouthIndianChart';

interface KundaliChartProps {
  data: KundaliData;
  displayDate?: string;
  sankalpam?: string;
}

export function KundaliChart({ data, displayDate, sankalpam }: KundaliChartProps) {
  const planets = data.planets || [];

  // Use displayDate (from client input) if available, otherwise data.birthDate
  const dateToShow = displayDate || data.birthDate;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-primary-600">
        <TeluguText>{TELUGU_LABELS.kundali.title}</TeluguText>
      </h2>

      <div className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-gray-600">
              <TeluguText>{TELUGU_LABELS.kundali.name}</TeluguText>
            </span>
            <p className="font-semibold">{data.personName}</p>
          </div>
          <div>
            <span className="text-gray-600">
              <TeluguText>{TELUGU_LABELS.kundali.birthDate}</TeluguText>
            </span>
            <p className="font-semibold">
              {(() => {
                if (!dateToShow) return '-';
                // Handle YYYY-MM-DD string directly to avoid timezone shift
                const parts = dateToShow.split('-');
                if (parts.length === 3) {
                  return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                return dateToShow;
              })()}
            </p>
          </div>
          <div>
            <span className="text-gray-600">
              <TeluguText>{TELUGU_LABELS.kundali.birthTime}</TeluguText>
            </span>
            <p className="font-semibold">{data.birthTime}</p>
          </div>
          <div>
            <span className="text-gray-600">
              <TeluguText>{TELUGU_LABELS.kundali.birthPlace}</TeluguText>
            </span>
            <p className="font-semibold">{data.birthPlace}</p>
          </div>
        </div>
      </div>

      {sankalpam && (
        <div className="mb-8 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
          <h3 className="font-bold text-lg mb-2 text-yellow-800">
            <span className="font-telugu">సంకల్పం</span> (Sankalpam)
          </h3>
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed font-telugu">
            {sankalpam}
          </p>
        </div>
      )}

      {/* Summary Boxes moved up */}
      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-primary-50 p-4 rounded-lg">
          <span className="text-gray-600 block mb-1">
            <TeluguText>{TELUGU_LABELS.kundali.lagna}</TeluguText>
          </span>
          <p className="font-bold text-lg">
            <TeluguText>{translateToTelugu(data.lagna)}</TeluguText>
          </p>
        </div>
        <div className="bg-primary-50 p-4 rounded-lg">
          <span className="text-gray-600 block mb-1">
            <TeluguText>{TELUGU_LABELS.kundali.moonSign}</TeluguText>
          </span>
          <p className="font-bold text-lg">
            <TeluguText>{translateToTelugu(data.moonSign)}</TeluguText>
          </p>
        </div>
        <div className="bg-primary-50 p-4 rounded-lg">
          <span className="text-gray-600 block mb-1">
            <TeluguText>నక్షత్రం</TeluguText>
          </span>
          <p className="font-bold text-lg">
            {(() => {
              const moon = planets.find(p => p.name === 'Moon');
              if (moon && typeof moon.nakshatra === 'object') {
                return <TeluguText>{translateToTelugu(moon.nakshatra.name)}</TeluguText>;
              }
              return '-';
            })()}
          </p>
          <p className="text-sm text-gray-600">
            {(() => {
              const moon = planets.find(p => p.name === 'Moon');
              if (moon && typeof moon.nakshatra === 'object') {
                return <TeluguText>{`పాదం ${moon.nakshatra.padam}`}</TeluguText>;
              }
              return '';
            })()}
          </p>
        </div>
        <div className="bg-primary-50 p-4 rounded-lg">
          <span className="text-gray-600 block mb-1">
            <TeluguText>లగ్నాధిపతి</TeluguText>
          </span>
          <p className="font-bold text-lg">
            <TeluguText>{translateToTelugu(data.lagnaLord)}</TeluguText>
          </p>
        </div>
      </div>

      {/* Chart and Grahalu side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="text-center">
          <SouthIndianChart data={data} className="mb-4 w-full" />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">
            <TeluguText>గ్రహాలు</TeluguText>
          </h3>
          <div className="space-y-2">
            {planets.map((planet) => (
              <div
                key={planet.name}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <span className="font-semibold">
                    <TeluguText>{translateToTelugu(planet.name)}</TeluguText>
                  </span>
                  <span className="text-gray-600 ml-2">
                    (<TeluguText>{translateToTelugu(planet.sign)}</TeluguText>, H{planet.house})
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <TeluguText>
                    {typeof planet.nakshatra === 'object'
                      ? `${translateToTelugu(planet.nakshatra.name)} (${planet.nakshatra.padam})`
                      : translateToTelugu(planet.nakshatra)}
                  </TeluguText>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
