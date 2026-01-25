
import * as A from 'astronomy-engine';
console.log('Keys:', Object.keys(A));
console.log('MakeTime:', A.MakeTime);
try {
    const d = new Date();
    const t = A.MakeTime(d);
    console.log('MakeTime result:', t);
} catch (e) {
    console.error('MakeTime error:', e);
}
