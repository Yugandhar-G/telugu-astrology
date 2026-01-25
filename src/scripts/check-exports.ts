
import * as Astronomy from 'astronomy-engine';

console.log('Available Astronomy keys:', Object.keys(Astronomy));

try {
    // Check common names
    // @ts-ignore
    console.log('RotationAxis:', Astronomy.RotationAxis);
    // @ts-ignore
    console.log('Obliquity:', Astronomy.Obliquity);
} catch (e) { }
