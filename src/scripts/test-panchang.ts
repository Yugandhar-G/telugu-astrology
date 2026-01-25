
import { calculatePanchang } from '../lib/vedic-math';

const location = { latitude: 17.3850, longitude: 78.4867 }; // Hyderabad

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const p1 = calculatePanchang(today, location);
const p2 = calculatePanchang(tomorrow, location);

console.log("--- Panchang Verification ---");
console.log(`Today (${today.toISOString()}):`);
console.log(JSON.stringify(p1, null, 2));

console.log(`Tomorrow (${tomorrow.toISOString()}):`);
console.log(JSON.stringify(p2, null, 2));

if (p1.tithi !== p2.tithi || p1.nakshatra !== p2.nakshatra) {
    console.log("SUCCESS: Data is dynamic!");
} else {
    console.error("FAILURE: Data is static!");
}
