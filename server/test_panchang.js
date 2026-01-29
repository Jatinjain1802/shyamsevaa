import { getPanchangam, Observer, tithiNames } from '@ishubhamx/panchangam-js';

const observer = new Observer(25.3176, 82.9739, 81); // Varanasi
const date = new Date();
const panchang = getPanchangam(date, observer);

console.log('Raw Tithi:', panchang.tithi);
console.log('Tithi Name (Index tithi):', tithiNames[panchang.tithi]);
console.log('Tithi Name (Index tithi-1):', tithiNames[panchang.tithi - 1]);
console.log('Full Panchang Tithi:', panchang.tithi);
