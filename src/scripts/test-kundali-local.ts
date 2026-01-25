
import * as Astronomy from 'astronomy-engine';

const date = new Date('2000-01-01T10:00:00+05:30');
const observer = new Astronomy.Observer(17.3850, 78.4867, 0);

console.log("Calculating Planet Positions for:", date.toISOString());

const bodies = [
    Astronomy.Body.Sun,
    Astronomy.Body.Moon,
    Astronomy.Body.Mars,
    Astronomy.Body.Mercury,
    Astronomy.Body.Jupiter,
    Astronomy.Body.Venus,
    Astronomy.Body.Saturn,
    // Rahu/Ketu are nodes, handled differently usually, but let's check
];

bodies.forEach(body => {
    const equator = Astronomy.Equator(body, date, observer, true, true);
    const horizon = Astronomy.Horizon(date, observer, equator.ra, equator.dec, 'normal');
    // We need ecliptic longitude for Kundali (Sidereal)
    // Astronomy engine gives Tropical. We need Ayanamsa.

    // Approximate Ayanamsa for 2000 is ~23.85 deg (Lahiri)
    // Precise calculation needed, but for test:
    const ayanamsa = 23.85;

    // Ecliptic coordinates
    const sunPos = Astronomy.SunPosition(date); // Just for example, need specific func for others
    const illumination = Astronomy.Illumination(body, date);

    // GeoVector -> Ecliptic
    const vec = Astronomy.GeoVector(body, date, true);
    // This returns x,y,z. We need Ecliptic Longitude.
    // Astronomy.Ecliptic(vec) ? No.

    // Helper to get Ecliptic Lon (Tropical)
    // For Moon: EclipticGeoMoon
    // For others: HELIOCENTRIC is easy, GEO is harder?
    // Actually, `Astronomy.EclipticGeoMoon` works for Moon.
    // For planets, `Astronomy.GeoVector` gives rectangular.
    // Let's use `Astronomy.EclipticLongitude`? No such function directly exposed maybe?

    // Actually simpler: 
    // const eq = Astronomy.Equator(body, date, observer, true, true);
    // const ecl = Astronomy.HorizonToEcliptic(...) ? No.

    // Let's use the known functions
    // SunPosition gives .elon (Ecliptic Longitude)
    // EclipticGeoMoon gives .lon
    // For planets?

    console.log(`Body: ${body}`);
});

// Let's try to find how to get Ecliptic Longitude for planets.
// Documentation says: 
// Astronomy.GeoEmbed(body, date) -> J2000 vectors.
// We might need a conversion.

// OR, we can use a simpler approach if available.
// Let's check what functions are available in the import.
console.log(Object.keys(Astronomy).filter(k => k.includes('Ecliptic')));
