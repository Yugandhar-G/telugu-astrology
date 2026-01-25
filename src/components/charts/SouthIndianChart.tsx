import React from 'react';
import { KundaliData, PlanetPosition } from '@/types/astrology';

// Standard Zodiac Glyph Vectors (Verified)
const ZODIAC_ICONS: Record<number, string> = {
    0: "M12 21c-2.5 0-4.5-1.6-4.5-3.5 0-1.5 1-2.2 2-2.5-2.5-1-4.5-3.5-4.5-6.5 0-3.9 3.1-7 7-7s7 3.1 7 7c0 3-2 5.5-4.5 6.5 1 .3 2 1 2 2.5 0 1.9-2 3.5-4.5 3.5M7 6c0-2.2 2.2-4 5-4s5 1.8 5 4", // Aries (♈)
    1: "M12 21a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-6-8a6 6 0 0 1 12 0M6 13a6 6 0 0 1 12 0", // Taurus (♉)
    2: "M8 4v16M16 4v16M6 4h12M6 20h12", // Gemini (♊)
    3: "M6 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm12 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 12h12", // Cancer (♋)
    4: "M12 12a4 4 0 1 0-8 0c0 3 2 5 4 5s4 4 4 7m4-7a4 4 0 1 0 0-8 4 4 0 0 0 0 8", // Leo (♌)
    5: "M5 7v12M17 19l2-2 2 2M17 19v-6a4 4 0 0 0-4-4 4 4 0 0 0-4 4v6M13 19v-6a4 4 0 0 0-4-4 4 4 0 0 0-4 4v6", // Virgo (♍)
    6: "M5 19h14M5 15h14M9 11a5 5 0 0 1 6 0", // Libra (♎)
    7: "M4 7v12M17 19l2 2M17 19v-6a4 4 0 0 0-4-4 4 4 0 0 0-4 4v6M12 19v-6a4 4 0 0 0-4-4 4 4 0 0 0-4 4v6", // Scorpio (♏) - Checked: M with tail
    8: "M7 17l10-10M17 7v6m0-6h-6m-4 13l16-16", // Sagittarius (♐)
    9: "M6 9c0 4 3 5 5 5s2 4 0 6M11 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6", // Capricorn (♑)
    10: "M4 10c2.7-2 5.3-2 8 0 2.7 2 5.3 2 8 0M4 15c2.7-2 5.3-2 8 0 2.7 2 5.3 2 8 0", // Aquarius (♒)
    11: "M8 20a10 10 0 0 1 0-16M16 4a10 10 0 0 1 0 16M6 12h12", // Pisces (♓)
};

interface SouthIndianChartProps {
    data: KundaliData;
    className?: string;
}

export function SouthIndianChart({ data, className = '' }: SouthIndianChartProps) {
    const { planets, lagna, houses } = data;

    const signToGridMap: Record<number, { r: number, c: number }> = {
        0: { r: 0, c: 1 }, // Mesha
        1: { r: 0, c: 2 }, // Vrishabha
        2: { r: 0, c: 3 }, // Mithuna
        3: { r: 1, c: 3 }, // Karka
        4: { r: 2, c: 3 }, // Simha
        5: { r: 3, c: 3 }, // Kanya
        6: { r: 3, c: 2 }, // Tula
        7: { r: 3, c: 1 }, // Vrischika
        8: { r: 3, c: 0 }, // Dhanu
        9: { r: 2, c: 0 }, // Makara
        10: { r: 1, c: 0 }, // Kumbha
        11: { r: 0, c: 0 }, // Meena
    };

    const getPlanetCode = (name: string) => {
        const map: Record<string, string> = {
            Sun: 'రవి',     // Ravi
            Moon: 'చం',     // Chandra
            Mars: 'కు',     // Kuja
            Mercury: 'బు',  // Budha
            Jupiter: 'గు',  // Guru
            Venus: 'శు',    // Shukra
            Saturn: 'శ',    // Shani
            Rahu: 'రా',     // Rahu
            Ketu: 'కే',     // Ketu
            Lagna: 'లగ్న'   // Lagna
        };
        return map[name] || name.substring(0, 2);
    };

    const signNames = [
        "Mesha", "Vrishabha", "Mithuna", "Karka",
        "Simha", "Kanya", "Tula", "Vrischika",
        "Dhanu", "Makara", "Kumbha", "Meena"
    ];

    const planetsBySign: Record<number, string[]> = {};
    planets.forEach(p => {
        const signIdx = signNames.indexOf(p.sign);
        if (signIdx >= 0) {
            if (!planetsBySign[signIdx]) planetsBySign[signIdx] = [];
            planetsBySign[signIdx].push(getPlanetCode(p.name));
        }
    });

    const lagnaSignIdx = signNames.indexOf(lagna);

    const renderCell = (r: number, c: number) => {
        let signIdx = -1;
        for (const [s, coords] of Object.entries(signToGridMap)) {
            if (coords.r === r && coords.c === c) {
                signIdx = parseInt(s);
                break;
            }
        }

        if (signIdx === -1) {
            if (r === 1 && c === 1) return (
                <g>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-xl font-bold fill-primary-800 opacity-90">రాశి చక్రం</text>
                </g>
            );
            return null;
        }

        const items = planetsBySign[signIdx] || [];
        const isLagna = signIdx === lagnaSignIdx;

        // Animation delays based on sign index for a cascading effect
        const animDelay = `${signIdx * 0.1}s`;

        return (
            <g>
                {/* Modern Animated Background Symbol */}
                <g className="text-orange-900 pointer-events-none" style={{ opacity: 0.15 }}>
                    <path
                        d={ZODIAC_ICONS[signIdx]}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        transform="scale(3.5) translate(1.5, 1.5)"
                        style={{
                            // CSS Variables for animation
                            '--dash-length': '100',
                            animation: `drawPath 2.5s ease-out forwards ${animDelay}, floatIcon 6s ease-in-out infinite ${animDelay}`,
                            strokeDasharray: '100',
                            strokeDashoffset: '100',
                        } as React.CSSProperties}
                    />
                </g>

                {/* Lagna Indicator */}
                {isLagna && (
                    <text x="5" y="15" className="text-sm font-bold fill-red-600">{getPlanetCode('Lagna')}</text>
                )}

                {/* Planets */}
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-sm font-medium fill-gray-900">
                    {items.map((p, i) => (
                        <tspan key={p} x="50%" dy={i === 0 ? (isLagna ? 0 : -((items.length - 1) * 8)) : 16} className="font-bold">
                            {p}
                        </tspan>
                    ))}
                </text>
            </g>
        );
    };

    return (
        <React.Fragment>
            <style>
                {`
                    @keyframes drawPath {
                        from { stroke-dashoffset: 100; opacity: 0; }
                        to { stroke-dashoffset: 0; opacity: 1; }
                    }
                    @keyframes floatIcon {
                        0%, 100% { transform: scale(3.5) translate(1.5px, 1.5px); }
                        50% { transform: scale(3.5) translate(1.5px, 0.5px); }
                    }
                `}
            </style>
            <svg viewBox="0 0 400 400" className={`w-full max-w-md mx-auto bg-white rounded-xl shadow-lg border border-orange-100 ${className}`}>
                {/* Main Premium Border */}
                <rect x="2" y="2" width="396" height="396" fill="none" stroke="#f6ad55" strokeWidth="3" rx="8" />

                {/* Grid Lines - Outer Box */}
                <line x1="0" y1="100" x2="400" y2="100" stroke="#fbd38d" strokeWidth="2" />
                <line x1="0" y1="300" x2="400" y2="300" stroke="#fbd38d" strokeWidth="2" />
                <line x1="100" y1="0" x2="100" y2="400" stroke="#fbd38d" strokeWidth="2" />
                <line x1="300" y1="0" x2="300" y2="400" stroke="#fbd38d" strokeWidth="2" />

                {/* Inner Lines for center */}
                <line x1="100" y1="100" x2="100" y2="300" stroke="#fbd38d" strokeWidth="2" />
                <line x1="100" y1="100" x2="300" y2="100" stroke="#fbd38d" strokeWidth="2" />
                <line x1="300" y1="100" x2="300" y2="300" stroke="#fbd38d" strokeWidth="2" />
                <line x1="100" y1="300" x2="300" y2="300" stroke="#fbd38d" strokeWidth="2" />

                {/* Cells */}
                {[0, 1, 2, 3].map(r =>
                    [0, 1, 2, 3].map(c => {
                        if ((r === 1 || r === 2) && (c === 1 || c === 2)) {
                            if (r === 1 && c === 1) {
                                return (
                                    <svg x="100" y="100" width="200" height="200" key="center">
                                        <text x="50%" y="50%" textAnchor="middle" className="text-xl font-bold fill-primary-700 opacity-20">రాశి</text>
                                    </svg>
                                );
                            }
                            return null;
                        }

                        return (
                            <svg x={c * 100} y={r * 100} width="100" height="100" key={`${r}-${c}`}>
                                {renderCell(r, c)}
                            </svg>
                        );
                    })
                )}
            </svg>
        </React.Fragment>
    );
}
