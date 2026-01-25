
import { calculateKundali } from '../lib/vedic-math';

// User Case: May 2nd 1999 (or May 3rd per their attempt)
// Let's test May 3rd 1999, 10:45 AM, Guntur (approx 16.3067° N, 80.4365° E)

const dateStr = "1999-05-03";
const timeStr = "10:45";
const lat = 16.3067;
const long = 80.4365;

// Construct Date manually as done in api.ts
const dateParts = dateStr.split('-').map(Number); // [1999, 5, 3]
const timeParts = timeStr.split(':').map(Number); // [10, 45]

// UTC Date Construction from api.ts
const date = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1]));

// Adjust timezone (IST +5.5)
const tzOffset = 5.5;
date.setMinutes(date.getMinutes() - (tzOffset * 60));

console.log("Calculated UTC Date:", date.toISOString());

const result = calculateKundali(date, {
    latitude: lat,
    longitude: long,
    timezone: '+05:30'
});

console.log("--- Kundali Result ---");
console.log("Lagna:", result.lagna);
console.log("Lagna Lord:", result.lagnaLord);
console.log("Moon Sign (Rasi):", result.moonSign); // Should be based on Moon position
console.log("Sun Sign:", result.sunSign);

console.log("\n--- Planets ---");
result.planets.forEach(p => {
    console.log(`${p.name}: ${p.longitude.toFixed(2)} (${p.sign}) - ${typeof p.nakshatra === 'object' ? p.nakshatra.name : p.nakshatra}`);
});

console.log("\n--- Houses ---");
result.houses.forEach(h => {
    console.log(`H${h.number}: ${h.sign} (Lord: ${h.lord})`);
});
