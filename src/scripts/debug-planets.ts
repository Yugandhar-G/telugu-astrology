
import * as Astronomy from 'astronomy-engine';

// Simulate Client Input: 2nd May 1999, 10:45 AM
// Timezone: IST (+05:30)
const year = 1999;
const month = 5; // May
const day = 2;
const hour = 10;
const minute = 45;

// API Logic (from api.ts)
// Construct date in UTC first
const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
console.log('Base UTC Date (Input):', date.toISOString());

// Adjust for Timezone (IST = +5.5)
// We want 10:45 IST to be 05:15 UTC
const tzOffset = 5.5;
date.setMinutes(date.getMinutes() - (tzOffset * 60));

console.log('Adjusted UTC Date (for Calc):', date.toISOString());
// Expected: 1999-05-02T05:15:00.000Z

const time = Astronomy.MakeTime(date);

// Verify Calculations (Logic from vedic-math.ts)
// Sun should be approx 41-42 deg (Tropical Taurus) -> Sidereal Aries (approx 18 deg Aries)
const sunPos = Astronomy.SunPosition(time);
console.log('Sun Tropical Longitude:', sunPos.elon);

const bodies = [
    { name: "Mercury", id: Astronomy.Body.Mercury },
    { name: "Venus", id: Astronomy.Body.Venus },
    { name: "Mars", id: Astronomy.Body.Mars },
    { name: "Jupiter", id: Astronomy.Body.Jupiter },
    { name: "Saturn", id: Astronomy.Body.Saturn },
];

bodies.forEach(b => {
    try {
        const vector = Astronomy.GeoVector(b.id, time, true);
        const ecliptic = Astronomy.Ecliptic(vector);
        console.log(`${b.name} Tropical Longitude:`, ecliptic.elon);
    } catch (e) {
        console.log(`${b.name} Error:`, e);
    }
});
