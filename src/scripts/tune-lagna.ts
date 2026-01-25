
import { calculateKundali } from '../lib/vedic-math';

// Goal: Find Ayanamsa that pushes Lagna to > 90.0 degrees (Cancer)
// Current Result: Gemini (Mithuna) < 90.0

const dateStr = "1999-05-03";
const timeStr = "10:45";
const lat = 16.3067;
const long = 80.4365;

const dateParts = dateStr.split('-').map(Number);
const timeParts = timeStr.split(':').map(Number);

// UTC Date: 1999-05-03 05:15:00 UTC
const date = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1]));
date.setMinutes(date.getMinutes() - (5.5 * 60));

console.log("Time (UTC):", date.toISOString());

// We need to modify vedic-math.ts dynamically or simulate the math here to find the value.
// But we can't easily modify the imported module constants.
// So we'll output the current degree and calculate the required offset.

// Run calculation
const result = calculateKundali(date, {
    latitude: lat,
    longitude: long,
    timezone: '+05:30'
});

// Since calculateKundali returns 'sign', we need to check the raw 'longitude' if possible?
// vedic-math returns result.planets with longitude. 
// But Lagna is in result.lagna (string).
// Wait, I updated it to return degrees in my thoughts? No.
// I can edit vedic-math to export the raw degrees or log them.
// OR I can use the same math here.

import * as Astronomy from 'astronomy-engine';

const time = Astronomy.MakeTime(date);

// Replicate Lagna Calc from vedic-math.ts
// Standard Lahiri Epoch
// const AYANAMSA_EPOCH = 2000.0;
// Current Value in file: (23.85 + (51.2 / 60)) - 1.44; 
const currentAyanamsaVal = (23.85 + (51.2 / 60)) - 1.44;

function getAyanamsa(d: Date, adjustment: number): number {
    const AYANAMSA_EPOCH = 2000.0;
    const AYANAMSA_AT_EPOCH = (23.85 + (51.2 / 60)) + adjustment; // Base is Lahiri
    const PRECESSION_RATE = 50.29 / 3600;

    // Day of year calc
    const start = new Date(d.getUTCFullYear(), 0, 0);
    const diff = d.getTime() - start.getTime();
    const dayOfYear = diff / (1000 * 60 * 60 * 24);

    const currentYear = d.getUTCFullYear() + (dayOfYear / 365.25);
    const yearsPassed = currentYear - AYANAMSA_EPOCH;
    return AYANAMSA_AT_EPOCH + (yearsPassed * PRECESSION_RATE);
}

// Calculate Sidereal Lagna
const gmst = Astronomy.SiderealTime(time);
const lmst = gmst + (long / 15.0);
const ramcRad = (lmst * 15) * Math.PI / 180;
// Obliquity
const T = time.ut / 36525.0;
const meanObliquity = 23.4392911 - (46.815 * T / 3600);
const oblRad = (meanObliquity) * Math.PI / 180;
const latRad = lat * Math.PI / 180;

const numer = Math.cos(ramcRad);
const denom = (Math.sin(ramcRad) * Math.cos(oblRad) * -1) + (Math.tan(latRad) * Math.sin(oblRad));

let ascRad = Math.atan2(numer, denom);
let ascDegTropical = (ascRad * 180 / Math.PI) % 360;
if (ascDegTropical < 0) ascDegTropical += 360;

console.log("Tropical Ascendant:", ascDegTropical);

// We want Sidereal Ascendant to be Cancer (90 to 120 degrees).
// Sidereal = Tropical - Ayanamsa.
// Target: Sidereal >= 90.0
// 90.0 = Tropical - Ayanamsa
// Ayanamsa = Tropical - 90.0

const requiredAyanamsa = ascDegTropical - 90.0;
console.log("Required Ayanamsa (Max) for Cancer:", requiredAyanamsa);
console.log("Current Ayanamsa Used:", getAyanamsa(date, -1.44));

// Difference
const diff = getAyanamsa(date, -1.44) - requiredAyanamsa;
console.log("Difference (Excess):", diff);
console.log("Adjustment needed:", -1.44 - diff);

