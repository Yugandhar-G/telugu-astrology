
import { calculatePanchang } from '../lib/vedic-math';

const TEST_DATE_STR = '2026-01-23';
const TEST_LAT = 17.3850;
const TEST_LNG = 78.4867;

console.log(`Testing consistency for Date: ${TEST_DATE_STR}`);

const results = [];

for (let i = 0; i < 5; i++) {
    // Simulate exactly what might happen in the API
    // If the API does new Date(dateStr)
    const dateObj = new Date(TEST_DATE_STR);
    console.log(`Iteration ${i}: Date Object ISO: ${dateObj.toISOString()} | Local: ${dateObj.toString()}`);

    const panchang = calculatePanchang(dateObj, { latitude: TEST_LAT, longitude: TEST_LNG });
    results.push(JSON.stringify(panchang));
}

// Check for uniqueness
const uniqueResults = new Set(results);

if (uniqueResults.size === 1) {
    console.log("SUCCESS: Results are consistent.");
} else {
    console.error("FAILURE: Results vary!");
    console.log("Unique results found:", uniqueResults);
}
