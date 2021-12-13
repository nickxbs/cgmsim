const dotenv = require('dotenv');
const result = require('dotenv').config();
const moment = require('moment');
const fs = require('fs');
const fetch = require('node-fetch');

const sgvs = require('./files/sgv1.json');

const jsonsgvs = JSON.stringify(sgvs);
const sgvValues = JSON.parse(jsonsgvs);
console.log(sgvValues);

const ISF = parseInt(process.env.ISF); // mmol/l/U
console.log('ISF=', ISF);

const NR = require('./files/last_mealtime.json');

const jsonNR = JSON.stringify(NR);
const NRAct = JSON.parse(jsonNR);

const GLA = require('./files/last_glargine_aggrACT.json');

const jsonGLA = JSON.stringify(GLA);
const glaAct = JSON.parse(jsonGLA);

const DET = require('./files/last_detemir_aggrACT.json');

const jsonDET = JSON.stringify(DET);
const detAct = JSON.parse(jsonDET);

// ENABLE THIS FOR PUMP SIMULATION
//= ================================
const pumpAct = require('./files/pumpBasalAct.json');

const jsonPumpAct = JSON.stringify(pumpAct);
const pumpBasalAct = JSON.parse(jsonPumpAct);

const globalBasalAct = glaAct + detAct;
const globalMealtimeAct = NRAct[0];

const globlalInsulinAct = globalBasalAct + globalMealtimeAct;

const BGI_ins = globlalInsulinAct * ISF * -90;

const today = new Date();

// here is the liver BG impact
const liver = require('./files/latest_liver.json');

console.log('liver: ', liver);
const liver_bgi = liver;

// here is the impact of the latest carbs meal
const carbzz = require('./files/latest_carbs.json');

const jsoncarbzz = JSON.stringify(carbzz);
const carbs = JSON.parse(jsoncarbzz);
console.log(carbs);

const arrows = require('./files/arrows.json');

const jsonArrows = JSON.stringify(arrows);
const arrowValues = JSON.parse(jsonArrows);
console.log(arrowValues);

// ADD FUNCTION PERLIN NOISE HERE

const perls = require('./files/perlin.json');

const jsonperls = JSON.stringify(perls);
const perlValues = JSON.parse(jsonperls);

const timeSincePerlin = perlValues.map((entry) => ({ ...entry, time: (Date.now() - moment(entry.time).valueOf()) / (1000 * 60) }));
// console.log(perlValues);
// console.log(timeSincePerlin);

const lastPerls = timeSincePerlin.filter((e) => e.time >= 0 && e.time <= 5, // keep only the latest noise value
);
console.log('this is the last perlin noise value:', lastPerls);
console.log('this is the last perlin noise value:', lastPerls[0].noise);

// END OF PERLIN NOISE SECTION

// WITH PUMP
//= =========
const sgv_pump = Math.floor(sgvValues[0].sgv + pumpBasalAct + BGI_ins + (liver_bgi * 18) + (carbs * 18) + (lastPerls[0].noise * 18 * 6));
let limited_sgv_pump = sgv_pump;
if (sgv_pump >= 400) {
  limited_sgv_pump = 400;
} else if (sgv_pump <= 40) {
  limited_sgv_pump = 40;
}
const dict = {
  dateString: today, sgv: limited_sgv_pump, type: 'sgv', direction: arrowValues[0].direction, date: Date.now(),
};
const dictstring = JSON.stringify(dict);

fs.writeFile('./files/cgmsim-sgv.json', dictstring, (err, result) => {
  if (err) console.log('error', err);
});

console.log('-------------------------------------------');
console.log('glaAct:', glaAct, 'detAct:', detAct, 'total basal act:', globalBasalAct);
console.log('-------------------------------------------');
console.log('total mealtime insulin activity:', globalMealtimeAct);
console.log('-------------------------------------------');
console.log('total insulin activity:', globlalInsulinAct);

console.log('-------------------------------------------');
console.log('total BG impact of insulin for 5 minutes:', BGI_ins, 'mg/dl');
console.log('total BG impact of insulin for 5 minutes:', BGI_ins / 18, 'mmol/l');

console.log('-------------------------------------------');
console.log('total BG impact of liver for 5 minutes: +', liver_bgi, 'mmol/l');

console.log('-------------------------------------------');
console.log('total BG impact of carbs for 5 minutes: +', carbs, 'mmol/l');

console.log('-------------------------------------------');
console.log('total BG impact of carbs, liver and insulin for 5 minutes: +', (BGI_ins / 18) + liver_bgi + carbs, 'mmol/l');

// console.log('this is the pump basal insulin activity:', pumpBasalAct);
