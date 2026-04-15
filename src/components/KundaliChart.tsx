'use client';

import React from 'react';
import { KundaliData } from '@/types/astrology';
import { TELUGU_LABELS, translateToTelugu } from '@/lib/constants/telugu-labels';
import { TeluguText } from './shared/TeluguText';
import { SouthIndianChart } from './charts/SouthIndianChart';
import { NAKSHATRA_DATA, findNakshatraByName } from '@/lib/constants/nakshatra-data';

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
            <TeluguText>నక్షత్ర పాదం</TeluguText>
          </span>
          {(() => {
            const moon = planets.find(p => p.name === 'Moon');
            if (moon && typeof moon.nakshatra === 'object') {
              const info = findNakshatraByName(moon.nakshatra.name);
              const syllable = info?.syllables[moon.nakshatra.padam - 1] || '';
              return (
                <p className="font-bold text-lg">
                  <TeluguText>{`${translateToTelugu(moon.nakshatra.name)} ${moon.nakshatra.padam} ${syllable}`}</TeluguText>
                </p>
              );
            }
            return <p className="font-bold text-lg">-</p>;
          })()}
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

      <NakshatraReferenceTable />
    </div>
  );
}

const RASHI_GROUPS = [
  { rashi: 'మేష రాశి', nakshatras: [0, 1, 2] },
  { rashi: 'వృషభ రాశి', nakshatras: [2, 3, 4] },
  { rashi: 'మిథున రాశి', nakshatras: [4, 5, 6] },
  { rashi: 'కర్కాటక రాశి', nakshatras: [6, 7, 8] },
  { rashi: 'సింహ రాశి', nakshatras: [9, 10, 11] },
  { rashi: 'కన్యా రాశి', nakshatras: [11, 12, 13] },
  { rashi: 'తులా రాశి', nakshatras: [13, 14, 15] },
  { rashi: 'వృశ్చిక రాశి', nakshatras: [15, 16, 17] },
  { rashi: 'ధనస్సు రాశి', nakshatras: [18, 19, 20] },
  { rashi: 'మకర రాశి', nakshatras: [20, 21, 22] },
  { rashi: 'కుంభ రాశి', nakshatras: [22, 23, 24] },
  { rashi: 'మీన రాశి', nakshatras: [24, 25, 26] },
];

function NakshatraReferenceTable() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="mt-8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors"
      >
        <div>
          <h3 className="text-lg font-bold text-orange-900 font-telugu text-left">
            నక్షత్ర - నామ అక్షరాల పట్టిక
          </h3>
          <p className="text-sm text-orange-700 font-telugu text-left">
            పేరు మొదటి అక్షరం ఆధారంగా మీ నామ నక్షత్రాన్ని తెలుసుకోండి
          </p>
        </div>
        <span className="text-2xl text-orange-600">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          {RASHI_GROUPS.map((group) => (
            <div key={group.rashi} className="border border-orange-200 rounded-xl overflow-hidden">
              <div className="bg-orange-100 px-4 py-2">
                <h4 className="font-bold text-orange-900 font-telugu">{group.rashi}</h4>
              </div>
              <div className="divide-y divide-orange-100">
                {group.nakshatras.map((idx) => {
                  const n = NAKSHATRA_DATA[idx];
                  return (
                    <div key={`${group.rashi}-${idx}`} className="px-4 py-3 flex items-center gap-4 bg-white">
                      <div className="w-32 shrink-0">
                        <span className="font-semibold text-gray-900 font-telugu">{n.teluguName}</span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {n.syllables.map((s, i) => (
                          <span key={i} className="inline-block px-3 py-1 bg-orange-50 border border-orange-200 rounded-lg font-bold text-orange-900 font-telugu text-base">
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="ml-auto text-sm text-gray-500 font-telugu shrink-0">
                        {n.lord}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="border border-orange-200 rounded-xl overflow-hidden">
            <div className="bg-orange-100 px-4 py-2">
              <h4 className="font-bold text-orange-900 font-telugu">నక్షత్ర వివరాల జాబితా</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-orange-50 text-left">
                    <th className="px-3 py-2 font-telugu font-semibold text-orange-900">నక్షత్రం</th>
                    <th className="px-3 py-2 font-telugu font-semibold text-orange-900">అధిపతి</th>
                    <th className="px-3 py-2 font-telugu font-semibold text-orange-900">అధిదేవత</th>
                    <th className="px-3 py-2 font-telugu font-semibold text-orange-900">గణము</th>
                    <th className="px-3 py-2 font-telugu font-semibold text-orange-900">జంతువు</th>
                    <th className="px-3 py-2 font-telugu font-semibold text-orange-900">వృక్షము</th>
                    <th className="px-3 py-2 font-telugu font-semibold text-orange-900">రత్నం</th>
                    <th className="px-3 py-2 font-telugu font-semibold text-orange-900">నాడి</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {NAKSHATRA_DATA.map((n, i) => (
                    <tr key={i} className="hover:bg-orange-50">
                      <td className="px-3 py-2 font-semibold font-telugu text-gray-900">{n.teluguName}</td>
                      <td className="px-3 py-2 font-telugu text-gray-700">{n.lord}</td>
                      <td className="px-3 py-2 font-telugu text-gray-700">{n.deity}</td>
                      <td className="px-3 py-2 font-telugu text-gray-700">{n.gana}</td>
                      <td className="px-3 py-2 font-telugu text-gray-700">{n.animal}</td>
                      <td className="px-3 py-2 font-telugu text-gray-700">{n.tree}</td>
                      <td className="px-3 py-2 font-telugu text-gray-700">{n.gem}</td>
                      <td className="px-3 py-2 font-telugu text-gray-700">{n.nadi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
