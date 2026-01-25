
import * as Astronomy from 'astronomy-engine';

const date = new Date();
const time = Astronomy.MakeTime(date);
const body = Astronomy.Body.Jupiter;

try {
    // @ts-ignore
    const lon = Astronomy.EclipticLongitude(body, time);
    console.log(`Jupiter Longitude: ${lon}`);
} catch (e) {
    console.error("Error using EclipticLongitude:", e);
    console.log("Keys available:", Object.keys(Astronomy));
}
