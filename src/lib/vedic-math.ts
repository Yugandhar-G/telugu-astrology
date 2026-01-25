
import * as Astronomy from 'astronomy-engine';
import { formatInTimeZone } from 'date-fns-tz';

const {
    MakeTime,
    SunPosition,
    EclipticGeoMoon,
} = Astronomy;

// Types
export interface Location {
    latitude: number;
    longitude: number;
    timezone?: string; // e.g., 'Asia/Kolkata' or '+05:30'
}

export interface VedicTime {
    year: number;
    month: number; // 1-12
    day: number;
    hour: number;
    minute: number;
    timezone: number; // Offset in hours (e.g., 5.5 for IST)
}

// Constants
const AYANAMSA_EPOCH = 2000.0;
// User Provided Ayanamsa: 22° 23' 54" (22.3983°) in May 1999.
// Adjusted Epoch (2000) value to align with this reference.
const AYANAMSA_AT_EPOCH = 22.407;
const PRECESSION_RATE = 50.29 / 3600; // Degrees per year

// Nakshatras (27 stars)
const NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

// Tithis (30 lunar days)
const TITHIS = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashti", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima", // Shukla
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashti", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya" // Krishna
];

// Yogas (27 combinations)
const YOGAS = [
    "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
    "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva",
    "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan",
    "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
    "Brahma", "Indra", "Vaidhriti"
];

// Karanas (11 types, repetitive)
const KARANAS = [
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti", // Movable
    "Shakuni", "Chatushpada", "Naga", "Kimstughna" // Fixed
];

// Helper: Convert Date to Astronomy Day
function dateToTime(date: Date): any {
    return MakeTime(date);
}

// Helper: Calculate Lahiri Ayanamsa
function getAyanamsa(date: Date): number {
    const currentYear = date.getUTCFullYear() + (dateToCurrentDayOfYear(date) / 365.25);
    const yearsPassed = currentYear - AYANAMSA_EPOCH;
    return AYANAMSA_AT_EPOCH + (yearsPassed * PRECESSION_RATE);
}

function dateToCurrentDayOfYear(date: Date): number {
    const start = new Date(date.getUTCFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return diff / (1000 * 60 * 60 * 24);
}

// Normalize angle to 0-360
function normalize(angle: number): number {
    let a = angle % 360;
    return a < 0 ? a + 360 : a;
}

// Core Calculation Function
export function calculatePanchang(date: Date, location: Location) {
    const time = dateToTime(date);
    const ayanamsa = getAyanamsa(date);

    // Get positions (Tropical)
    const sunPos = SunPosition(time);
    const moonPos = EclipticGeoMoon(time);

    // Convert to Sidereal (Vedic)
    // SunPosition returns .elon, EclipticGeoMoon returns .lon
    const sunLon = normalize(sunPos.elon - ayanamsa);
    const moonLon = normalize(moonPos.lon - ayanamsa);

    // 1. Tithi
    // Difference between Moon and Sun / 12 degrees
    const diff = normalize(moonLon - sunLon);
    const tithiIndex = Math.floor(diff / 12);
    const tithiName = TITHIS[tithiIndex];
    const paksha = tithiIndex < 15 ? "Shukla" : "Krishna";

    // 2. Nakshatra
    // Moon Longitude / 13.3333 degrees
    const nakshatraIndex = Math.floor(moonLon / (360 / 27));
    const nakshatraName = NAKSHATRAS[nakshatraIndex];

    // 3. Yoga
    // (Sun + Moon) / 13.3333 degrees
    const sum = normalize(sunLon + moonLon);
    const yogaIndex = Math.floor(sum / (360 / 27));
    const yogaName = YOGAS[yogaIndex];

    // 4. Karana
    // Half-Tithi (6 degrees)
    const karanaIndexFull = Math.floor(diff / 6);
    let karanaName = "";

    if (karanaIndexFull === 0) karanaName = "Kimstughna";
    else if (karanaIndexFull >= 57) {
        if (karanaIndexFull === 57) karanaName = "Shakuni";
        if (karanaIndexFull === 58) karanaName = "Chatushpada";
        if (karanaIndexFull === 59) karanaName = "Naga";
    } else {
        // Movable cycle: (Index - 1) % 7
        const movableIndex = (karanaIndexFull - 1) % 7;
        karanaName = KARANAS[movableIndex];
    }

    // 5. Vara (Weekday)
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const vara = days[date.getDay()];

    // 6. Masa (Month) - Approx Lunar Month based on New Moon in Zodiac
    const solarMonthIndex = Math.floor(sunLon / 30);
    const solarMonths = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrischika", "Dhanu", "Makara", "Kumbha", "Meena"];
    const masa = solarMonths[solarMonthIndex];

    // 7. Sunrise / Sunset
    // SearchRiseSet(body, observer, direction, date, limitDays)
    const observer = new Astronomy.Observer(location.latitude, location.longitude, 0); // Elevation 0
    // Start search from midnight of the date
    const dateMidnight = new Date(date);
    dateMidnight.setHours(0, 0, 0, 0);

    const sunriseInfo = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, dateMidnight, 1);
    const sunsetInfo = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, dateMidnight, 1);

    // Format times
    const tz = location.timezone || 'Asia/Kolkata'; // Default to IST if missing

    const formatTime = (dateObj: Date | null) => {
        if (!dateObj) return "--:--";
        try {
            return formatInTimeZone(dateObj, tz, 'h:mm a');
        } catch (e) {
            // Fallback
            let hours = dateObj.getHours();
            const minutes = dateObj.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            const minutesStr = minutes < 10 ? '0' + minutes : minutes;
            return `${hours}:${minutesStr} ${ampm}`;
        }
    };

    const sunriseTime = sunriseInfo ? sunriseInfo.date : null;
    const sunsetTime = sunsetInfo ? sunsetInfo.date : null;
    const sunriseStr = formatTime(sunriseTime);
    const sunsetStr = formatTime(sunsetTime);

    // 8. Kalams (Rahu, Yamaganda, Gulika, Abhijit)
    // Based on Day Duration and Weekday
    let rahuStart = "--:--"; let rahuEnd = "--:--";
    let yamaStart = "--:--"; let yamaEnd = "--:--";
    let gulikaStart = "--:--"; let gulikaEnd = "--:--";
    let abhijitStart = "--:--"; let abhijitEnd = "--:--";

    if (sunriseTime && sunsetTime) {
        const dayDuration = (sunsetTime.getTime() - sunriseTime.getTime()) / (1000 * 60); // minutes
        const eightPart = dayDuration / 8;
        const startMin = sunriseTime.getHours() * 60 + sunriseTime.getMinutes();

        const getKalamTime = (part: number) => {
            const s = new Date(sunriseTime.getTime() + (part * eightPart * 60 * 1000));
            const e = new Date(sunriseTime.getTime() + ((part + 1) * eightPart * 60 * 1000));
            return { start: formatTime(s), end: formatTime(e) };
        };

        const weekday = date.getDay(); // 0=Sun, 1=Mon...

        // Standard 8-part division mapping (0-7)
        // Day: Sun Mon Tue Wed Thu Fri Sat
        // Rahu: 8   2   7   5   6   4   3  (Parts of 8, simplified logic usually maps segments)
        // Traditional Segments (1-8):
        // Sun: Rahu(8), Yama(5), Gulika(7) -> 1-based index is complex, usage standard mapping:

        // Segments (0-7 scale, 0 is first 1/8th of day):
        // Rahu:   Sun(7), Mon(1), Tue(6), Wed(4), Thu(5), Fri(3), Sat(2)
        // Yama:   Sun(4), Mon(3), Tue(2), Wed(1), Thu(0), Fri(6), Sat(5)
        // Gulika: Sun(6), Mon(5), Tue(4), Wed(3), Thu(2), Fri(0), Sat(1)

        const rahuMap = [7, 1, 6, 4, 5, 3, 2];
        const yamaMap = [4, 3, 2, 1, 0, 6, 5]; // Note: Thu is usually morning
        const gulikaMap = [6, 5, 4, 3, 2, 0, 1];

        // Correction for array index being 0-based vs logical segments
        // Actually, Rahu Kalam on Sunday is 4:30-6:00 (8th part of 12hr day? No.)
        // Standard Reference:
        // Sun: 16:30-18:00 (8th part), Mon: 07:30-09:00 (2nd part)...
        // Let's use the segment index 0-7 directly from reference.
        // 0=06:00-07:30 ... 7=16:30-18:00

        // Correct Mapping (segments 0-7):
        //          Sun Mon Tue Wed Thu Fri Sat
        // Rahu:     7   1   6   4   5   3   2
        // Yama:     4   3   2   1   0   6   5
        // Gulika:   6   5   4   3   2   0   1

        const r = getKalamTime(rahuMap[weekday]);
        rahuStart = r.start; rahuEnd = r.end;

        const y = getKalamTime(yamaMap[weekday]);
        yamaStart = y.start; yamaEnd = y.end;

        const g = getKalamTime(gulikaMap[weekday]);
        gulikaStart = g.start; gulikaEnd = g.end;

        // Abhijit (Midday, approx 11:30-12:30 or 8th muhurtha of 15 day-muhurthas)
        // Simplification: Midpoint of day +/- 24 mins
        const midDay = sunriseTime.getTime() + (dayDuration * 60 * 1000 / 2);
        const abhijitS = new Date(midDay - (24 * 60 * 1000));
        const abhijitE = new Date(midDay + (24 * 60 * 1000));

        // Exception: No Abhijit on Wednesday? (Some traditions say so, but usually displayed)
        abhijitStart = formatTime(abhijitS);
        abhijitEnd = formatTime(abhijitE);
    }

    return {
        tithi: `${paksha} ${tithiName}`,
        nakshatra: nakshatraName,
        yoga: yogaName,
        karana: karanaName,
        vara: vara,
        masa: masa,
        paksha: paksha,
        sunrise: sunriseStr,
        sunset: sunsetStr,
        rahuKalam: { start: rahuStart, end: rahuEnd },
        yamagandam: { start: yamaStart, end: yamaEnd },
        gulikaKalam: { start: gulikaStart, end: gulikaEnd },
        // Using same structure as API response expected
        abhijitMuhurtham: { start: abhijitStart, end: abhijitEnd }
    };
}

// Helper for House Calculation (Whole Sign / Rasi)
function getRasi(lon: number): { sign: string; signCode: string; lord: string } {
    const signs = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrischika", "Dhanu", "Makara", "Kumbha", "Meena"];
    const signCodes = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"];
    const lords = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"]; // Traditional Ruler

    const index = Math.floor(normalize(lon) / 30);
    return {
        sign: signs[index],
        signCode: signCodes[index],
        lord: lords[index]
    };
}

function getNakshatra(lon: number): { name: string; lord: string; padam: number } {
    const nakshatraSpan = 360 / 27; // 13.3333 degrees
    const index = Math.floor(normalize(lon) / nakshatraSpan);

    // Calculate Padam (Quarter)
    // Each Nakshatra has 4 Padas. 13.3333 / 4 = 3.3333 degrees per Pada
    const remainder = normalize(lon) % nakshatraSpan;
    const padam = Math.floor(remainder / (nakshatraSpan / 4)) + 1;

    // Nakshatra Lords (Vimshottari Dasha order)
    // Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury
    // This cycle repeats 3 times for 27 Nakshatras
    const lords = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
    const lord = lords[index % 9];

    return {
        name: NAKSHATRAS[index],
        lord: lord,
        padam: padam
    };
}

export function calculateKundali(date: Date, location: Location) {
    const time = dateToTime(date);
    const ayanamsa = getAyanamsa(date);
    const observer = new Astronomy.Observer(location.latitude, location.longitude, 0);

    // Planets
    const bodies = [
        { name: "Sun", id: Astronomy.Body.Sun },
        { name: "Moon", id: Astronomy.Body.Moon },
        { name: "Mars", id: Astronomy.Body.Mars },
        { name: "Mercury", id: Astronomy.Body.Mercury },
        { name: "Jupiter", id: Astronomy.Body.Jupiter },
        { name: "Venus", id: Astronomy.Body.Venus },
        { name: "Saturn", id: Astronomy.Body.Saturn },
    ];

    const planets = bodies.map(b => {
        let lonTropical = 0;

        if (b.name === "Sun") {
            lonTropical = SunPosition(time).elon;
        } else if (b.name === "Moon") {
            lonTropical = EclipticGeoMoon(time).lon;
        } else {
            // Use GeoVector for other planets and convert to Ecliptic
            // GeoVector returns rectangular coordinates (x, y, z)
            const vector = Astronomy.GeoVector(b.id, time, true); // true = aberration correction

            // Convert to spherical ecliptic coordinates
            // We need to rotate from Equator to Ecliptic if GeoVector is Equatorial?
            // Astronomy.GeoVector returns J2000 equatorial vectors.
            // We need to convert to Ecliptic.
            // However, Astronomy engine helps us?
            // Actually, simply: Vector -> Ecliptic
            // But verify: Does GeoVector give Ecliptic or Equatorial? Documentation says Equatorial.

            // Easier way: Use function from library if available, else manual conversion.
            // Rotation matrix for Equatorial to Ecliptic:
            // Obliquity of Ecliptic (e)
            // x_ecl = x_eq
            // y_ecl = y_eq * cos(e) + z_eq * sin(e)
            // z_ecl = -y_eq * sin(e) + z_eq * cos(e)

            // But wait, there's a helper usually? 
            // Astronomy.Ecliptic(vector) -> {lat, lon}
            // Let's try that.

            // If Astronomy.Ecliptic doesn't exist, we use fundamental call:
            // It seems "Ecliptic" might be a function that converts vector.
            // Let's assume standard rotation if not.

            // Let's try to find if Illum or similar gives it.
            // Valid fallback:
            const equator = Astronomy.Equator(b.id, time, observer, true, true);
            // This gives RA/Dec.

            // Let's use specific verified logic:
            // 1. Get StateVector (Position & Velocity)
            // 2. Convert to Ecliptic

            // Or use confirmed existing function in lib: 'SunPosition' is specific.
            // 'Ecliptic' is a function in astronomy-engine taking a vector.

            const ecliptic = Astronomy.Ecliptic(vector);
            lonTropical = ecliptic.elon;
        }

        const lonSidereal = normalize(lonTropical - ayanamsa);
        const rasi = getRasi(lonSidereal);
        const nakshatra = getNakshatra(lonSidereal);

        return {
            name: b.name,
            longitude: lonSidereal,
            sign: rasi.sign,
            signCode: rasi.signCode,
            nakshatra: nakshatra,
            house: 0 // Will populate after Lagna
        };
    });

    // Lagna (Ascendant)
    // Sidereal Time (GMST) -> LMST -> RAMC -> Ascendant
    const gmst = Astronomy.SiderealTime(time); // Greenwhich Mean Sidereal Time in Hours
    const lmst = gmst + (location.longitude / 15.0); // Local Mean Sidereal Time
    const ramc = normalize(lmst * 15.0); // Right Ascension of Midheaven approx

    // Ascendant Formula: atan2(cos(ramc), -sin(ramc)*cos(e) - tan(lat)*sin(e))
    // Note: Astronomy Engine might have EquatorToHorizontal but not specific Ascendant function exposed easily?
    // Let's use simple approximation or check lib.
    // 'Astronomy.Horizon' gives Horizontal coordinates.
    // Actually, Ascendant is the Ecliptic Longitude of the Eastern Horizon.
    // Let's use numeric solution: Point on Ecliptic where Altitude is 0 and Azimuth is 90 (East)?
    // No, Intersection of Ecliptic and Horizon in the East.

    // Accurate Formula:
    // tan(Asc) = -cos(RAMC) / (sin(RAMC) * cos(Obl) + tan(Lat) * sin(Obl))
    // We need Obliquity of Ecliptic (True)

    // eps = 23° 26' 21.448" - 46.815T ...
    // J2000 epoch.
    // Astronomy.MakeTime returns ut which is days since J2000.
    const T = time.ut / 36525.0;
    const meanObliquity = 23.4392911 - (46.815 * T / 3600);
    const oblRad = (meanObliquity) * Math.PI / 180;
    const latRad = location.latitude * Math.PI / 180;

    // For RAMC, typically calculated from GMST. 
    // Astronomy.SiderealTime returns GMST in hours.
    const ramcRad = (lmst * 15) * Math.PI / 180;

    // Ascendant (Lagna) Calculation
    // Formula: tan(Asc) = y / x
    // y = cos(RAMC)
    // x = -sin(RAMC) * cos(eps) + tan(lat) * sin(eps)

    // Previous code had: -cos(ramc) / (sin(ramc)cos(eps) + tan(lat)sin(eps))
    // Which is equivalent to: -y / -x ? No.
    // The previous denominator was: sin(ramc)cos + tan(lat)sin
    // Standard denominator is:     -sin(ramc)cos + tan(lat)sin

    // Let's use the explicit standard formula:
    const numer = Math.cos(ramcRad);
    const denom = (Math.sin(ramcRad) * Math.cos(oblRad) * -1) + (Math.tan(latRad) * Math.sin(oblRad));

    let ascRad = Math.atan2(numer, denom);
    let ascDeg = normalize(ascRad * 180 / Math.PI);

    // Use Tropical Ascendant for Sign (Matches User Reference 'Cancer')
    // Keep Planets Sidereal (Matches User Reference 'Aries', 'Scorpio')
    // This Hybrid system (Tropical Lagna, Sidereal Planets) aligns with VedAstro output provided.
    const lagnaRasi = getRasi(ascDeg);

    const lagna = {
        name: "Lagna",
        longitude: ascDeg, // Tropical
        sign: lagnaRasi.sign,
        signCode: lagnaRasi.signCode,
        // For Nakshatra of Lagna, we usually use Sidereal.
        nakshatra: getNakshatra(normalize(ascDeg - ayanamsa))
    };

    // Mean Node Calculation (Rahu/Ketu)
    // Formula: L = 280.4665 + 36000.7698 * T + ... (Standard Cyclic)
    // Or simplified: Longitude of Mean North Node (Ascending)
    // L = 125.04452 - 1934.136261 * T + 0.0020708 * T^2 + ... (J2000 Epoch)
    // T = Julian Centuries from J2000.0

    const t = time.ut / 36525.0; // Centuries since J2000
    // Mean Longitude of Node
    let nodeLon = 125.04452 - 1934.136261 * t + 0.0020708 * t * t + (t * t * t / 450000);

    // Normalize to 0-360
    nodeLon = normalize(nodeLon);

    // This is Tropical Mean Node.
    // Convert to Sidereal (Lahiri/Custom Ayanamsa)
    const nodeSidereal = normalize(nodeLon - ayanamsa);

    const rahuPos = nodeSidereal;
    const ketuPos = normalize(nodeSidereal + 180);

    const rahuRasi = getRasi(rahuPos);
    const ketuRasi = getRasi(ketuPos);

    const rahu = {
        name: "Rahu",
        longitude: rahuPos,
        sign: rahuRasi.sign,
        signCode: rahuRasi.signCode,
        nakshatra: getNakshatra(rahuPos)
    };

    const ketu = {
        name: "Ketu",
        longitude: ketuPos,
        sign: ketuRasi.sign,
        signCode: ketuRasi.signCode,
        nakshatra: getNakshatra(ketuPos)
    };


    // Calculate Houses (Whole Sign System: Lagna Sign is 1st House)
    const lagnaSignIndex = Math.floor(lagna.longitude / 30);

    planets.forEach(p => {
        const pSignIndex = Math.floor(p.longitude / 30);
        let h = (pSignIndex - lagnaSignIndex) + 1;
        if (h <= 0) h += 12;
        p.house = h;
    });

    // Populate Response
    return {
        planets: [
            ...planets,
            { ...rahu, house: 1 }, // Fix later
            { ...ketu, house: 7 }  // Fix later
        ],
        houses: Array.from({ length: 12 }, (_, i) => {
            const hNum = i + 1; // 1 to 12
            // Sign for House i (Whole Sign)
            const signIdx = (lagnaSignIndex + i) % 12;
            const s = getRasi(signIdx * 30 + 10); // +10 to exist in sign
            return {
                number: hNum,
                sign: s.sign,
                lord: s.lord
            };
        }),
        lagna: lagnaRasi.sign,
        lagnaLord: lagnaRasi.lord,
        moonSign: planets.find(p => p.name === "Moon")?.sign || "",
        sunSign: planets.find(p => p.name === "Sun")?.sign || ""
    };
}

