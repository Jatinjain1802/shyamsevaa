
import { getPanchangam, Observer } from '@ishubhamx/panchangam-js';

const observer = new Observer(25.3176, 82.9739, 81);
const date = new Date();
const panchang = getPanchangam(date, observer);

console.log(JSON.stringify(panchang, null, 2));
