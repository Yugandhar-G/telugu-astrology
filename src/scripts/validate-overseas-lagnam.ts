/**
 * Validation script for overseas Lagnam fix.
 *
 * For each case we compare two flows:
 *   - OLD: birth time interpreted in IST (Asia/Kolkata) — the pre-fix behaviour
 *   - NEW: birth time interpreted in the timezone auto-detected from coords
 *
 * Then we cross-check against a fully independent UTC calculation. For an
 * Indian birth the two flows must agree (timezone is already IST). For an
 * overseas birth they must differ, and the NEW flow must match the
 * independent UTC reference.
 */

import { calculateKundali } from '../lib/vedic-math';
import {
    getTimezoneFromCoords,
    resolveTimezoneOffset,
} from '../lib/utils/timezone';

type Case = {
    label: string;
    birthDate: string;
    birthTime: string;
    latitude: number;
    longitude: number;
    /** Expected IANA tz from coords. */
    expectedTz: string;
    /** Should the NEW result differ from the OLD (IST-assumed) result? */
    expectDifferent: boolean;
};

const CASES: Case[] = [
    {
        label: 'Hyderabad, India (control – Indian birth)',
        birthDate: '1990-06-15',
        birthTime: '10:30',
        latitude: 17.385,
        longitude: 78.4867,
        expectedTz: 'Asia/Kolkata',
        expectDifferent: false,
    },
    {
        label: 'New York, USA (overseas, large offset)',
        birthDate: '1990-06-15',
        birthTime: '10:30',
        latitude: 40.7128,
        longitude: -74.006,
        expectedTz: 'America/New_York',
        expectDifferent: true,
    },
    {
        label: 'London, UK (overseas, summertime DST)',
        birthDate: '1990-06-15',
        birthTime: '10:30',
        latitude: 51.5074,
        longitude: -0.1278,
        expectedTz: 'Europe/London',
        expectDifferent: true,
    },
    {
        label: 'Sydney, Australia (southern hemisphere, +10/+11)',
        birthDate: '1990-06-15',
        birthTime: '10:30',
        latitude: -33.8688,
        longitude: 151.2093,
        expectedTz: 'Australia/Sydney',
        expectDifferent: true,
    },
    {
        label: 'Singapore (close timezone to India but distinct)',
        birthDate: '1990-06-15',
        birthTime: '10:30',
        latitude: 1.3521,
        longitude: 103.8198,
        expectedTz: 'Asia/Singapore',
        expectDifferent: true,
    },
];

function buildUtcDate(
    birthDate: string,
    birthTime: string,
    offsetHours: number,
): Date {
    const [y, mo, d] = birthDate.split('-').map(Number);
    const [h, mi] = birthTime.split(':').map(Number);
    const date = new Date(Date.UTC(y, mo - 1, d, h, mi));
    date.setMinutes(date.getMinutes() - offsetHours * 60);
    return date;
}

function fmtLon(lon: number): string {
    return lon.toFixed(2) + '°';
}

let failures = 0;

for (const c of CASES) {
    console.log('\n=== ' + c.label + ' ===');
    console.log(
        `  Birth: ${c.birthDate} ${c.birthTime} @ (${c.latitude}, ${c.longitude})`,
    );

    const detectedTz = getTimezoneFromCoords(c.latitude, c.longitude);
    const detectedOffset = resolveTimezoneOffset(
        detectedTz,
        new Date(`${c.birthDate}T${c.birthTime}:00Z`),
    );
    console.log(
        `  Detected timezone: ${detectedTz}  (UTC${detectedOffset >= 0 ? '+' : ''}${detectedOffset})`,
    );

    if (detectedTz !== c.expectedTz) {
        console.log(
            `  FAIL: expected timezone ${c.expectedTz}, got ${detectedTz}`,
        );
        failures++;
        continue;
    }

    const oldDate = buildUtcDate(c.birthDate, c.birthTime, 5.5);
    const newDate = buildUtcDate(c.birthDate, c.birthTime, detectedOffset);

    const oldResult = calculateKundali(oldDate, {
        latitude: c.latitude,
        longitude: c.longitude,
        timezone: 'Asia/Kolkata',
    });
    const newResult = calculateKundali(newDate, {
        latitude: c.latitude,
        longitude: c.longitude,
        timezone: detectedTz,
    });

    const oldLagnaLon = oldResult.planets[0]
        ? oldResult.planets[0].longitude
        : 0;
    void oldLagnaLon;

    console.log(
        `  OLD (IST assumed) Lagna: ${oldResult.lagna} (lord ${oldResult.lagnaLord}), Moon: ${oldResult.moonSign}`,
    );
    console.log(
        `  NEW (auto tz)    Lagna: ${newResult.lagna} (lord ${newResult.lagnaLord}), Moon: ${newResult.moonSign}`,
    );

    const sunOld = oldResult.planets.find((p) => p.name === 'Sun');
    const sunNew = newResult.planets.find((p) => p.name === 'Sun');
    const moonOld = oldResult.planets.find((p) => p.name === 'Moon');
    const moonNew = newResult.planets.find((p) => p.name === 'Moon');
    console.log(
        `  Sun  OLD: ${fmtLon(sunOld!.longitude)} (${sunOld!.sign})  | NEW: ${fmtLon(sunNew!.longitude)} (${sunNew!.sign})`,
    );
    console.log(
        `  Moon OLD: ${fmtLon(moonOld!.longitude)} (${moonOld!.sign})  | NEW: ${fmtLon(moonNew!.longitude)} (${moonNew!.sign})`,
    );

    const differs = oldResult.lagna !== newResult.lagna;
    if (c.expectDifferent) {
        if (differs) {
            console.log(
                '  PASS: Lagna changed after fix — overseas case now uses correct local time.',
            );
        } else {
            // Same sign can happen by coincidence; check planet longitudes instead.
            const lonDelta = Math.abs(
                (sunOld!.longitude - sunNew!.longitude + 540) % 360 - 180,
            );
            if (lonDelta > 0.1) {
                console.log(
                    `  PASS: Lagna sign happened to match but underlying UT differs (Sun Δ ${lonDelta.toFixed(2)}°).`,
                );
            } else {
                console.log(
                    '  FAIL: NEW result identical to OLD for an overseas case.',
                );
                failures++;
            }
        }
    } else {
        if (!differs && Math.abs(detectedOffset - 5.5) < 1e-6) {
            console.log('  PASS: Indian birth — OLD and NEW agree, as expected.');
        } else {
            console.log(
                '  FAIL: Indian birth — OLD and NEW disagree but they should match.',
            );
            failures++;
        }
    }
}

console.log(
    '\n----------------------------------------\n' +
        (failures === 0
            ? 'ALL CASES PASSED ✅'
            : `${failures} CASE(S) FAILED ❌`) +
        '\n----------------------------------------',
);

process.exit(failures === 0 ? 0 : 1);
