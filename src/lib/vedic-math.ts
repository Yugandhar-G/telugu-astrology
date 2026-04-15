
import * as Astronomy from 'astronomy-engine';
import { formatInTimeZone } from 'date-fns-tz';
import { resolveTimezoneOffset } from './utils/timezone';

export interface Location {
    latitude: number;
    longitude: number;
    timezone?: string;
}

export type NodeType = 'true' | 'mean';

const DEG = Math.PI / 180;

// Lahiri Ayanamsa at J2000.0 (23°51'25.3" per IAE)
const AYANAMSA_J2000 = 23.85703;
// Precession: 50.291"/yr base + 1.11161"/century quadratic term
const PRECESSION_BASE = 50.291 / 3600;
const PRECESSION_QUAD = 1.11161 / 3600;

const NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const TITHIS = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashti", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashti", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"
];

const YOGAS = [
    "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
    "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva",
    "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan",
    "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
    "Brahma", "Indra", "Vaidhriti"
];

const KARANAS = [
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
    "Shakuni", "Chatushpada", "Naga", "Kimstughna"
];

const SIGNS = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrischika", "Dhanu", "Makara", "Kumbha", "Meena"];
const SIGN_CODES = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"];
const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

const NAKSHATRA_LORDS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

// ======================== CORE HELPERS ========================

function normalize(angle: number): number {
    const a = angle % 360;
    return a < 0 ? a + 360 : a;
}

/**
 * Lahiri Ayanamsa with polynomial precession and nutation correction.
 * Formula from IAE: A = A0 + p*t + q*T  where A0=23°51'25.3" at J2000,
 * p=50.291"/yr, q=1.11161"/century. Nutation in longitude applied separately.
 */
function getAyanamsa(date: Date): number {
    const time = Astronomy.MakeTime(date);
    const T = time.ut / 36525.0;
    const t = T * 100; // years since J2000

    const precession = AYANAMSA_J2000 + (PRECESSION_BASE * t) + (PRECESSION_QUAD * T);

    // Nutation in longitude (IAU 1980 simplified):
    // ΔΨ = -17.20" sin(Ω) - 1.32" sin(2L) - 0.23" sin(2L') + 0.21" sin(2Ω)
    const omega = (125.04452 - 1934.136261 * T) * DEG;
    const L = (280.4665 + 36000.7698 * T) * DEG;
    const Lp = (218.3165 + 481267.8813 * T) * DEG;

    const nutationLon = (-17.20 * Math.sin(omega) - 1.32 * Math.sin(2 * L)
                         - 0.23 * Math.sin(2 * Lp) + 0.21 * Math.sin(2 * omega)) / 3600;

    return precession + nutationLon;
}

/**
 * True obliquity of the ecliptic (mean + nutation correction).
 */
function getTrueObliquity(T: number): number {
    const meanObl = 23.4392911 - (46.8150 * T + 0.00059 * T * T - 0.001813 * T * T * T) / 3600;

    const omega = (125.04452 - 1934.136261 * T) * DEG;
    const L = (280.4665 + 36000.7698 * T) * DEG;
    const Lp = (218.3165 + 481267.8813 * T) * DEG;

    const nutationObl = (9.20 * Math.cos(omega) + 0.57 * Math.cos(2 * L)
                         + 0.10 * Math.cos(2 * Lp) - 0.09 * Math.cos(2 * omega)) / 3600;

    return meanObl + nutationObl;
}

/**
 * Get ecliptic-of-date longitude for any body.
 * Uses EclipticLongitude for planets (returns ECT longitude directly).
 * Uses SunPosition for Sun (already ECT).
 * Uses GeoVector + Ecliptic for Moon (converts J2000 EQ → ECT).
 */
function getBodyLongitude(body: { name: string; id: Astronomy.Body }, time: Astronomy.AstroTime): number {
    if (body.name === "Sun") {
        return Astronomy.SunPosition(time).elon;
    }

    if (body.name === "Moon") {
        // EclipticGeoMoon returns J2000 ecliptic — convert to ecliptic of date
        // by going through GeoVector (J2000 equatorial) → Ecliptic (ECT)
        const geoMoon = Astronomy.GeoVector(Astronomy.Body.Moon, time, true);
        return Astronomy.Ecliptic(geoMoon).elon;
    }

    // Mars, Mercury, Jupiter, Venus, Saturn: GeoVector → Ecliptic gives ECT
    const vector = Astronomy.GeoVector(body.id, time, true);
    return Astronomy.Ecliptic(vector).elon;
}

/**
 * Mean lunar node longitude (tropical).
 */
function getMeanNodeLongitude(T: number): number {
    return normalize(125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T / 450000));
}

/**
 * True lunar node longitude (tropical).
 * Applies the principal nutation/perturbation corrections to the mean node.
 */
function getTrueNodeLongitude(T: number): number {
    const meanNode = getMeanNodeLongitude(T);

    const D = (297.85036 + 445267.111480 * T) * DEG;
    const M = (357.52772 + 35999.050340 * T) * DEG;
    const Mp = (134.96298 + 477198.867398 * T) * DEG;
    const F = (93.27191 + 483202.017538 * T) * DEG;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const omega = meanNode * DEG;

    // Principal perturbation terms for true node (Meeus, Ch. 47)
    const correction =
        -1.4979 * Math.sin(2 * (D - F)) +
        -0.1500 * Math.sin(M) +
        -0.1226 * Math.sin(2 * D) +
         0.1176 * Math.sin(2 * F) +
        -0.0801 * Math.sin(2 * (Mp - F));

    return normalize(meanNode + correction);
}

function getRasi(lon: number): { sign: string; signCode: string; lord: string } {
    const index = Math.floor(normalize(lon) / 30);
    return { sign: SIGNS[index], signCode: SIGN_CODES[index], lord: SIGN_LORDS[index] };
}

function getNakshatra(lon: number): { name: string; lord: string; padam: number } {
    const span = 360 / 27;
    const normLon = normalize(lon);
    const index = Math.floor(normLon / span);
    const remainder = normLon % span;
    const padam = Math.floor(remainder / (span / 4)) + 1;

    return { name: NAKSHATRAS[index], lord: NAKSHATRA_LORDS[index % 9], padam };
}

// ======================== PANCHANG ========================

export function calculatePanchang(date: Date, location: Location) {
    const time = Astronomy.MakeTime(date);
    const ayanamsa = getAyanamsa(date);
    const tzOffset = resolveTimezoneOffset(location.timezone);

    const sunLon = normalize(getBodyLongitude({ name: "Sun", id: Astronomy.Body.Sun }, time) - ayanamsa);
    const moonLon = normalize(getBodyLongitude({ name: "Moon", id: Astronomy.Body.Moon }, time) - ayanamsa);

    // Tithi: (Moon - Sun) / 12°
    const diff = normalize(moonLon - sunLon);
    const tithiIndex = Math.floor(diff / 12);
    const paksha = tithiIndex < 15 ? "Shukla" : "Krishna";

    // Nakshatra: Moon / 13.333°
    const nakshatraIndex = Math.floor(moonLon / (360 / 27));

    // Yoga: (Sun + Moon) / 13.333°
    const yogaIndex = Math.floor(normalize(sunLon + moonLon) / (360 / 27));

    // Karana: half-tithi (6°)
    const karanaIndexFull = Math.floor(diff / 6);
    let karanaName = "";
    if (karanaIndexFull === 0) karanaName = "Kimstughna";
    else if (karanaIndexFull === 57) karanaName = "Shakuni";
    else if (karanaIndexFull === 58) karanaName = "Chatushpada";
    else if (karanaIndexFull === 59) karanaName = "Naga";
    else karanaName = KARANAS[(karanaIndexFull - 1) % 7];

    // Vara (weekday) in local timezone
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const localDate = new Date(date.getTime() + (tzOffset * 60 * 60 * 1000));
    const vara = days[localDate.getUTCDay()];

    // Masa (lunar month based on solar month)
    const solarMonthIndex = Math.floor(sunLon / 30);
    const TELUGU_MASAS = [
      "మేష మాసం", "వృషభ మాసం", "మిథున మాసం", "కర్కాటక మాసం",
      "సింహ మాసం", "కన్యా మాసం", "తులా మాసం", "వృశ్చిక మాసం",
      "ధనుస్సు మాసం", "మకర మాసం", "కుంభ మాసం", "మీన మాసం"
    ];
    const CHANDRAMANA_MASAS = [
      "చైత్రం", "వైశాఖం", "జ్యేష్ఠం", "ఆషాఢం",
      "శ్రావణం", "భాద్రపదం", "ఆశ్వయుజం", "కార్తీకం",
      "మార్గశిరం", "పుష్యం", "మాఘం", "ఫాల్గుణం"
    ];
    const chandramanaIndex = (solarMonthIndex + 0) % 12;

    // Samvatsara (60-year cycle)
    const SAMVATSARAS = [
      "ప్రభవ", "విభవ", "శుక్ల", "ప్రమోదూత", "ప్రజోత్పత్తి",
      "ఆంగీరస", "శ్రీముఖ", "భావ", "యువ", "ధాతు",
      "ఈశ్వర", "బహుధాన్య", "ప్రమాధి", "విక్రమ", "వృష",
      "చిత్రభాను", "స్వభాను", "తారణ", "పార్ధివ", "వ్యయ",
      "సర్వజిత్", "సర్వధారి", "విరోధి", "వికృతి", "ఖర",
      "నందన", "విజయ", "జయ", "మన్మథ", "దుర్ముఖి",
      "హేవిళంబి", "విళంబి", "వికారి", "శార్వరి", "ప్లవ",
      "శుభకృత్", "శోభకృత్", "క్రోధి", "విశ్వావసు", "పరాభవ",
      "ప్లవంగ", "కీలక", "సౌమ్య", "సాధారణ", "విరోధికృత్",
      "పరీధావి", "ప్రమాదీచ", "ఆనంద", "రాక్షస", "నల",
      "పింగళ", "కాళయుక్తి", "సిద్ధార్థి", "రౌద్రి", "దుర్మతి",
      "దుందుభి", "రుధిరోద్గారి", "రక్తాక్షి", "క్రోధన", "అక్షయ"
    ];
    const gregYear = localDate.getUTCFullYear();
    const samvatsaraIndex = ((gregYear - 1987 + 3) % 60 + 60) % 60;
    const samvatsara = SAMVATSARAS[samvatsaraIndex];

    // Sunrise / Sunset
    const observer = new Astronomy.Observer(location.latitude, location.longitude, 0);
    const year = localDate.getUTCFullYear();
    const month = localDate.getUTCMonth();
    const day = localDate.getUTCDate();
    const midnightLocal = new Date(Date.UTC(year, month, day, 0, 0, 0));
    const dateMidnight = new Date(midnightLocal.getTime() - (tzOffset * 60 * 60 * 1000));

    const sunriseInfo = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, dateMidnight, 1);
    const sunsetInfo = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, dateMidnight, 1);

    const tz = location.timezone || 'Asia/Kolkata';
    const formatTime = (dateObj: Date | null): string => {
        if (!dateObj) return "--:--";
        try {
            return formatInTimeZone(dateObj, tz, 'h:mm a');
        } catch {
            const localMs = dateObj.getTime() + (tzOffset * 60 * 60 * 1000);
            const localDt = new Date(localMs);
            let hours = localDt.getUTCHours();
            const minutes = localDt.getUTCMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
        }
    };

    const sunriseTime = sunriseInfo?.date ?? null;
    const sunsetTime = sunsetInfo?.date ?? null;

    // Kalams
    let rahuKalam = { start: "--:--", end: "--:--" };
    let yamagandam = { start: "--:--", end: "--:--" };
    let gulikaKalam = { start: "--:--", end: "--:--" };
    let abhijitMuhurtham = { start: "--:--", end: "--:--" };

    if (sunriseTime && sunsetTime) {
        const dayMs = sunsetTime.getTime() - sunriseTime.getTime();
        const partMs = dayMs / 8;

        const getKalamTime = (part: number) => ({
            start: formatTime(new Date(sunriseTime.getTime() + (part * partMs))),
            end: formatTime(new Date(sunriseTime.getTime() + ((part + 1) * partMs))),
        });

        const weekday = localDate.getUTCDay();
        const rahuMap = [7, 1, 6, 4, 5, 3, 2];
        const yamaMap = [4, 3, 2, 1, 0, 6, 5];
        const gulikaMap = [6, 5, 4, 3, 2, 0, 1];

        rahuKalam = getKalamTime(rahuMap[weekday]);
        yamagandam = getKalamTime(yamaMap[weekday]);
        gulikaKalam = getKalamTime(gulikaMap[weekday]);

        // Abhijit Muhurtham: midday ± 24 minutes
        const midDay = sunriseTime.getTime() + (dayMs / 2);
        abhijitMuhurtham = {
            start: formatTime(new Date(midDay - (24 * 60 * 1000))),
            end: formatTime(new Date(midDay + (24 * 60 * 1000))),
        };
    }

    return {
        tithi: `${paksha} ${TITHIS[tithiIndex]}`,
        nakshatra: NAKSHATRAS[nakshatraIndex],
        yoga: YOGAS[yogaIndex],
        karana: karanaName,
        vara,
        masa: CHANDRAMANA_MASAS[chandramanaIndex],
        teluguMasa: TELUGU_MASAS[solarMonthIndex],
        samvatsara,
        paksha,
        sunrise: formatTime(sunriseTime),
        sunset: formatTime(sunsetTime),
        rahuKalam,
        yamagandam,
        gulikaKalam,
        abhijitMuhurtham,
    };
}

// ======================== KUNDALI ========================

export function calculateKundali(date: Date, location: Location, nodeType: NodeType = 'true') {
    const time = Astronomy.MakeTime(date);
    const ayanamsa = getAyanamsa(date);
    const T = time.ut / 36525.0;

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
        const lonTropical = getBodyLongitude(b, time);
        const lonSidereal = normalize(lonTropical - ayanamsa);
        const rasi = getRasi(lonSidereal);
        const nakshatra = getNakshatra(lonSidereal);

        return {
            name: b.name,
            longitude: lonSidereal,
            sign: rasi.sign,
            signCode: rasi.signCode,
            nakshatra,
            house: 0,
        };
    });

    // Lagna (Ascendant) using true obliquity
    const gmst = Astronomy.SiderealTime(time);
    const lmst = gmst + (location.longitude / 15.0);
    const trueObl = getTrueObliquity(T);
    const oblRad = trueObl * DEG;
    const latRad = location.latitude * DEG;
    const ramcRad = normalize(lmst * 15) * DEG;

    // Meeus Ch.14: Asc = atan2(cos(RAMC), -(sin(RAMC)*cos(ε) + tan(φ)*sin(ε)))
    const ascRad = Math.atan2(
        Math.cos(ramcRad),
        -(Math.sin(ramcRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad))
    );
    const ascTropical = normalize(ascRad / DEG);
    const ascSidereal = normalize(ascTropical - ayanamsa);
    const lagnaRasi = getRasi(ascSidereal);

    const lagna = {
        name: "Lagna",
        longitude: ascSidereal,
        sign: lagnaRasi.sign,
        signCode: lagnaRasi.signCode,
        nakshatra: getNakshatra(ascSidereal),
    };

    // Rahu/Ketu (user-selectable True or Mean node)
    const nodeTropical = nodeType === 'true' ? getTrueNodeLongitude(T) : getMeanNodeLongitude(T);
    const rahuPos = normalize(nodeTropical - ayanamsa);
    const ketuPos = normalize(rahuPos + 180);

    const rahu = {
        name: "Rahu",
        longitude: rahuPos,
        sign: getRasi(rahuPos).sign,
        signCode: getRasi(rahuPos).signCode,
        nakshatra: getNakshatra(rahuPos),
    };

    const ketu = {
        name: "Ketu",
        longitude: ketuPos,
        sign: getRasi(ketuPos).sign,
        signCode: getRasi(ketuPos).signCode,
        nakshatra: getNakshatra(ketuPos),
    };

    // Houses (Whole Sign)
    const lagnaSignIndex = Math.floor(lagna.longitude / 30);

    const assignHouse = (lon: number) => {
        const signIdx = Math.floor(lon / 30);
        let h = signIdx - lagnaSignIndex + 1;
        if (h <= 0) h += 12;
        return h;
    };

    planets.forEach(p => { p.house = assignHouse(p.longitude); });
    const rahuHouse = assignHouse(rahu.longitude);
    const ketuHouse = assignHouse(ketu.longitude);

    // Manglik Dosha: Mars in houses 1, 2, 4, 7, 8, or 12
    const mars = planets.find(p => p.name === "Mars");
    const manglikHouses = [1, 2, 4, 7, 8, 12];
    const isManglik = mars ? manglikHouses.includes(mars.house) : false;

    return {
        planets: [
            ...planets,
            { ...rahu, house: rahuHouse },
            { ...ketu, house: ketuHouse },
        ],
        houses: Array.from({ length: 12 }, (_, i) => {
            const signIdx = (lagnaSignIndex + i) % 12;
            return {
                number: i + 1,
                sign: SIGNS[signIdx],
                lord: SIGN_LORDS[signIdx],
            };
        }),
        lagna: lagnaRasi.sign,
        lagnaLord: lagnaRasi.lord,
        moonSign: planets.find(p => p.name === "Moon")?.sign || "",
        sunSign: planets.find(p => p.name === "Sun")?.sign || "",
        isManglik,
        nodeType,
    };
}

// ======================== ASHTA KOOTA MATCHMAKING ========================

// Varna for each nakshatra (0=Brahmin, 1=Kshatriya, 2=Vaishya, 3=Shudra)
const NAKSHATRA_VARNA = [
    1, 3, 0, 3, 2, 3, 0, 1, 3, 3, 0, 1, 2, 2, 3, 0, 3, 2, 3, 0, 1, 2, 3, 3, 0, 1, 2
];

// Vashya: 0=Chatushpada, 1=Manava, 2=Jalachara, 3=Vanachara, 4=Keeta
const SIGN_VASHYA = [3, 0, 1, 2, 3, 1, 1, 4, 0, 0, 1, 2];

// Yoni animal for each nakshatra
const NAKSHATRA_YONI = [
    0, 1, 2, 3, 3, 4, 5, 2, 5, 6, 6, 7, 8, 9, 8, 9, 10, 10, 4, 11, 12, 11, 13, 0, 13, 7, 1
];

const YONI_MATRIX: number[][] = [
    [4, 2, 2, 3, 2, 2, 2, 1, 0, 1, 3, 3, 2, 2],
    [2, 4, 2, 3, 2, 2, 2, 2, 3, 1, 2, 3, 2, 0],
    [2, 2, 4, 2, 2, 2, 1, 3, 2, 2, 2, 0, 3, 2],
    [3, 3, 2, 4, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2],
    [2, 2, 2, 2, 4, 1, 2, 3, 2, 2, 0, 2, 2, 2],
    [2, 2, 2, 2, 1, 4, 0, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 1, 0, 2, 0, 4, 2, 2, 2, 2, 2, 2, 2],
    [1, 2, 3, 2, 3, 2, 2, 4, 3, 0, 2, 2, 2, 2],
    [0, 3, 2, 2, 2, 2, 2, 3, 4, 2, 2, 2, 2, 1],
    [1, 1, 2, 2, 2, 2, 2, 0, 2, 4, 1, 2, 2, 2],
    [3, 2, 2, 2, 0, 2, 2, 2, 2, 1, 4, 2, 2, 2],
    [3, 3, 0, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2],
    [2, 2, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2],
    [2, 0, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 4],
];

// Gana: 0=Deva, 1=Manushya, 2=Rakshasa
const NAKSHATRA_GANA = [
    0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0
];

const GANA_MATRIX: number[][] = [
    [6, 5, 1],
    [5, 6, 0],
    [1, 0, 6],
];

// Nadi: 0=Aadi(Vata), 1=Madhya(Pitta), 2=Antya(Kapha)
const NAKSHATRA_NADI = [
    0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2
];

// Sign lord index: 0=Mars, 1=Venus, 2=Mercury, 3=Moon, 4=Sun, 5=Jupiter, 6=Saturn
const SIGN_LORD_INDEX = [0, 1, 2, 3, 4, 2, 1, 0, 5, 6, 6, 5];

// Graha Maitri: 5=friend, 3=neutral, 0=enemy
const GRAHA_MAITRI_MATRIX: number[][] = [
    [5, 3, 3, 5, 5, 5, 0],
    [0, 5, 5, 3, 0, 3, 5],
    [3, 5, 5, 3, 5, 3, 5],
    [3, 3, 0, 5, 5, 5, 3],
    [5, 0, 3, 5, 5, 5, 0],
    [5, 0, 3, 5, 5, 5, 0],
    [0, 5, 5, 0, 0, 3, 5],
];

// Bhakoot bad pairs (6-8 and 2-12 relationships)
const BHAKOOT_BAD_PAIRS = [
    [0, 5], [1, 6], [2, 7], [3, 8], [4, 9], [5, 10],
    [0, 11], [1, 0], [2, 1], [3, 2], [4, 3], [5, 4],
];

export interface MatchmakingResult {
    varna: { score: number; maxScore: number; description: string };
    vashya: { score: number; maxScore: number; description: string };
    tara: { score: number; maxScore: number; description: string };
    yoni: { score: number; maxScore: number; description: string };
    grahaMaitri: { score: number; maxScore: number; description: string };
    gana: { score: number; maxScore: number; description: string };
    bhakoot: { score: number; maxScore: number; description: string };
    nadi: { score: number; maxScore: number; description: string };
    totalScore: number;
    maxScore: number;
    compatibility: number;
    recommendation: string;
}

function calculateVarna(brideNak: number, groomNak: number): number {
    return NAKSHATRA_VARNA[groomNak] <= NAKSHATRA_VARNA[brideNak] ? 1 : 0;
}

function calculateVashya(brideSign: number, groomSign: number): number {
    const bv = SIGN_VASHYA[brideSign];
    const gv = SIGN_VASHYA[groomSign];
    if (bv === gv) return 2;
    if (bv === 1 || gv === 1) return 1;
    if ((bv === 0 && gv === 3) || (bv === 3 && gv === 0)) return 1;
    return 0;
}

function calculateTara(brideNak: number, groomNak: number): number {
    const diff = ((groomNak - brideNak) % 27 + 27) % 27;
    const tara = (diff % 9) + 1;
    return [1, 2, 4, 6, 8, 9].includes(tara) ? 3 : 0;
}

function calculateYoni(brideNak: number, groomNak: number): number {
    return YONI_MATRIX[NAKSHATRA_YONI[brideNak]][NAKSHATRA_YONI[groomNak]];
}

function calculateGrahaMaitri(brideSign: number, groomSign: number): number {
    return GRAHA_MAITRI_MATRIX[SIGN_LORD_INDEX[brideSign]][SIGN_LORD_INDEX[groomSign]];
}

function calculateGana(brideNak: number, groomNak: number): number {
    return GANA_MATRIX[NAKSHATRA_GANA[brideNak]][NAKSHATRA_GANA[groomNak]];
}

function calculateBhakoot(brideSign: number, groomSign: number): number {
    for (const pair of BHAKOOT_BAD_PAIRS) {
        if ((brideSign === pair[0] && groomSign === pair[1]) ||
            (brideSign === pair[1] && groomSign === pair[0])) {
            return 0;
        }
    }
    return 7;
}

function calculateNadi(brideNak: number, groomNak: number): number {
    return NAKSHATRA_NADI[brideNak] === NAKSHATRA_NADI[groomNak] ? 0 : 8;
}

export function calculateMatchmaking(
    person1MoonLongitude: number,
    person2MoonLongitude: number
): MatchmakingResult {
    const span = 360 / 27;
    const bride_nak = Math.floor(normalize(person1MoonLongitude) / span);
    const groom_nak = Math.floor(normalize(person2MoonLongitude) / span);
    const bride_sign = Math.floor(normalize(person1MoonLongitude) / 30);
    const groom_sign = Math.floor(normalize(person2MoonLongitude) / 30);

    const scores = {
        varna: calculateVarna(bride_nak, groom_nak),
        vashya: calculateVashya(bride_sign, groom_sign),
        tara: calculateTara(bride_nak, groom_nak),
        yoni: calculateYoni(bride_nak, groom_nak),
        grahaMaitri: calculateGrahaMaitri(bride_sign, groom_sign),
        gana: calculateGana(bride_nak, groom_nak),
        bhakoot: calculateBhakoot(bride_sign, groom_sign),
        nadi: calculateNadi(bride_nak, groom_nak),
    };

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const maxScore = 36;
    const compatibility = Math.round((totalScore / maxScore) * 100);

    let recommendation = "";
    if (totalScore >= 28) recommendation = "Excellent match - highly recommended";
    else if (totalScore >= 21) recommendation = "Good match - recommended with minor considerations";
    else if (totalScore >= 18) recommendation = "Average match - proceed with caution";
    else if (totalScore >= 14) recommendation = "Below average - not recommended without remedies";
    else recommendation = "Poor match - not recommended";

    return {
        varna: { score: scores.varna, maxScore: 1, description: "Spiritual/Work compatibility" },
        vashya: { score: scores.vashya, maxScore: 2, description: "Mutual attraction and control" },
        tara: { score: scores.tara, maxScore: 3, description: "Birth star compatibility" },
        yoni: { score: scores.yoni, maxScore: 4, description: "Physical and sexual compatibility" },
        grahaMaitri: { score: scores.grahaMaitri, maxScore: 5, description: "Mental and intellectual compatibility" },
        gana: { score: scores.gana, maxScore: 6, description: "Temperament compatibility" },
        bhakoot: { score: scores.bhakoot, maxScore: 7, description: "Health, wealth and family" },
        nadi: { score: scores.nadi, maxScore: 8, description: "Health and genetic compatibility" },
        totalScore,
        maxScore,
        compatibility,
        recommendation,
    };
}
