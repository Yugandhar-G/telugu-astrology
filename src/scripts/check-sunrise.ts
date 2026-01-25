
import * as Astronomy from 'astronomy-engine';
import { calculateKundali } from '../lib/vedic-math';

const dateStr = "1999-05-03";
const timeStr = "10:45";
const lat = 16.3067;
const long = 80.4365;

const dateParts = dateStr.split('-').map(Number);
const timeParts = timeStr.split(':').map(Number);
const date = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1]));

// IST Conversion
const tzOffset = 5.5;
date.setMinutes(date.getMinutes() - (tzOffset * 60));
console.log("UTC Time:", date.toISOString());

const observer = new Astronomy.Observer(lat, long, 0);
const dateMidnight = new Date(date);
dateMidnight.setUTCHours(0, 0, 0, 0);
// Search slightly before to find sunrise of the day (in UTC)
// Sunrise in India (~6 AM) is ~00:30 UTC.
const searchDate = new Date(date);
searchDate.setUTCHours(0, 0, 0, 0);

const sunrise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, searchDate, 1);
const sunset = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, searchDate, 1);

function formatIST(d: Date | undefined) {
    if (!d) return "N/A";
    // Add 5.5 hours
    const ist = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
    return ist.toISOString().substr(11, 8); // HH:mm:ss
}

console.log("Calculated Sunrise (IST):", formatIST(sunrise?.date));
console.log("Calculated Sunset (IST):", formatIST(sunset?.date));

// Check Tropical Ascendant
const time = Astronomy.MakeTime(date);
const gmst = Astronomy.SiderealTime(time);
const lmst = gmst + (long / 15.0);
const ramcRad = (lmst * 15) * Math.PI / 180;
const T = time.ut / 36525.0;
const meanObliquity = 23.4392911 - (46.815 * T / 3600);
const oblRad = (meanObliquity) * Math.PI / 180;
const latRad = lat * Math.PI / 180;
const numer = Math.cos(ramcRad);
const denom = (Math.sin(ramcRad) * Math.cos(oblRad) * -1) + (Math.tan(latRad) * Math.sin(oblRad));
let ascRad = Math.atan2(numer, denom);
let ascDegTropical = (ascRad * 180 / Math.PI) % 360;
if (ascDegTropical < 0) ascDegTropical += 360;

console.log("Tropical Ascendant (Deg):", ascDegTropical);
// User says Cancer (90-120). Tropical is 101. Matches!

// Check Sidereal
// Ayanamsa ~23.85
const siderealDeg = ascDegTropical - 23.85;
console.log("Sidereal Ascendant (Deg) [Lahiri]:", siderealDeg);
// 77.8 deg = Gemini.
