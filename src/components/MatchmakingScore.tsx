'use client';

import React from 'react';
import { MatchmakingData } from '@/types/astrology';
import { TELUGU_LABELS } from '@/lib/constants/telugu-labels';
import { TeluguText } from './shared/TeluguText';
import { formatPercentage } from '@/lib/utils/formatters';

interface MatchmakingScoreProps {
  data: MatchmakingData;
}

export function MatchmakingScore({ data }: MatchmakingScoreProps) {
  const percentage = formatPercentage(data.gunaScore, data.maxGunas);
  const scoreColor =
    data.compatibilityPercentage >= 75
      ? 'text-green-600'
      : data.compatibilityPercentage >= 50
      ? 'text-yellow-600'
      : 'text-red-600';

  const detailItems = [
    { label: 'వర్ణ', value: data.details.varna },
    { label: 'వశ్య', value: data.details.vashya },
    { label: 'తార', value: data.details.tara },
    { label: 'యోని', value: data.details.yoni },
    { label: 'గ్రహ మైత్రి', value: data.details.grahaMaitri },
    { label: 'గణ', value: data.details.gana },
    { label: 'భకూట', value: data.details.bhakoot },
    { label: 'నాడి', value: data.details.nadi },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-primary-600">
        <TeluguText>{TELUGU_LABELS.matchmaking.title}</TeluguText>
      </h2>

      <div className="mb-6">
        <div className="text-center mb-4">
          <div className={`text-4xl font-bold ${scoreColor} mb-2`}>
            {data.gunaScore}/{data.maxGunas}
          </div>
          <div className="text-xl font-semibold text-gray-700">
            {percentage} <TeluguText>{TELUGU_LABELS.matchmaking.compatibility}</TeluguText>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className={`h-4 rounded-full ${
              data.compatibilityPercentage >= 75
                ? 'bg-green-500'
                : data.compatibilityPercentage >= 50
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${data.compatibilityPercentage}%` }}
          />
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-lg font-semibold text-gray-800">
          <TeluguText>{data.recommendation}</TeluguText>
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">
          <TeluguText>మంగళిక స్థితి</TeluguText>
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600 block mb-1">వ్యక్తి 1</span>
            <span className="font-semibold">
              {data.manglikStatus.person1 ? (
                <span className="text-red-600">మంగళిక</span>
              ) : (
                <span className="text-green-600">మంగళిక కాదు</span>
              )}
            </span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600 block mb-1">వ్యక్తి 2</span>
            <span className="font-semibold">
              {data.manglikStatus.person2 ? (
                <span className="text-red-600">మంగళిక</span>
              ) : (
                <span className="text-green-600">మంగళిక కాదు</span>
              )}
            </span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-primary-50 rounded-lg">
          <span className="text-gray-700 font-semibold">
            {data.manglikStatus.compatible ? (
              <span className="text-green-600">
                <TeluguText>{TELUGU_LABELS.matchmaking.compatible}</TeluguText>
              </span>
            ) : (
              <span className="text-red-600">
                <TeluguText>{TELUGU_LABELS.matchmaking.notCompatible}</TeluguText>
              </span>
            )}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">
          <TeluguText>వివరణ</TeluguText>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {detailItems.map((item) => (
            <div key={item.label} className="p-3 bg-gray-50 rounded-lg text-center">
              <div className="text-sm text-gray-600 mb-1">
                <TeluguText>{item.label}</TeluguText>
              </div>
              <div className="text-xl font-bold text-primary-600">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
