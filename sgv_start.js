import { perlinRun } from './perlin';
import { liver } from './liver';

export const sgvStart = ({ ISF }, sgvValues, {
	resultAct,
	resultIob,
	detAct,
	glaAct,
	totalCarbRate,
	arrowsDirections,
}) => {
	console.log(sgvValues);

	// ENABLE THIS FOR PUMP SIMULATION
	//= ================================
	// var pumpAct = require('./files/pumpBasalAct.json');
	// var jsonPumpAct = JSON.stringify(pumpAct);
	// var pumpBasalAct = JSON.parse(jsonPumpAct);

	const globalBasalAct = glaAct + detAct;
	const globalMealtimeAct = resultAct;

	const globlalInsulinAct = globalBasalAct + globalMealtimeAct;

	const BGI_ins = globlalInsulinAct * ISF * -90;

	const today = new Date();

	// here is the liver BG impact
	const _liver = liver();

	console.log('liver: ', _liver);
	const liver_bgi = _liver;
	// var rnd = (Math.random() * (1.5 - 0.5) + 0.6);
	// var liver_bgi = rnd * 0.0833;
	// var liver_bgi = rnd * 0.12;

	// here is the impact of the latest carbs meal
	const carbs = totalCarbRate;
	console.log(carbs);

	const arrowValues = arrowsDirections;
	console.log(arrowValues);

	// ADD FUNCTION PERLIN NOISE HERE
	const perlValues = perlinRun();

	const timeSincePerlin = perlValues.map((entry) => ({ ...entry, time: (Date.now() - moment(entry.time).valueOf()) / (1000 * 60) }));
	// console.log(perlValues);
	// console.log(timeSincePerlin);

	// keep only the latest noise value
	const lastPerls = timeSincePerlin.filter((e) => e.time >= 0 && e.time <= 5);
	console.log('this is the last perlin noise value:', lastPerls);
	console.log('this is the last perlin noise value:', lastPerls[0].noise);

	// END OF PERLIN NOISE SECTION

	// START OF PLANETS SECTION
	//= =========================
	const planets = require('./files/forceVectors.json');
	// the traction of planets is about 0.0015 (Newtons), add 1 !
	const planetFactorA = 1 + planets.tractionSubject;
	// mkae the inverted dispertion a conjunction factor:
	const conjunctionFactor = 1 + (planets.globalVectorLong_p_SDnorm1 / 100);

	// apply the correction due to inverted dispersion;
	const planetFactor = planetFactorA * conjunctionFactor;

	console.log('planet traction force:', planets.tractionSubject);
	console.log('planetFactorA is 1 + traction force:', planetFactorA);
	console.log('normalized inverted SD of longitude dispersion:', planets.globalVectorLong_p_SDnorm1);
	console.log('conjunction factor:', conjunctionFactor);
	console.log('planetFactorA * conjunction or planetFactor:', planetFactor);

	// the illumination fraction if the moon varies from 0 to 1, divide by 10 and add 1 !

	const moonFactor = ((planets.moon_illumination_fraction) / 10) + 1;
	console.log('moonFactor:', moonFactor);

	// END OF PLANETS SECTION
	//= =========================

	// WITH PUMP
	//= =========
	// var sgv_pump = Math.floor(sgvValues[0].sgv + pumpBasalAct + BGI_ins + (liver_bgi * 18) + (carbs * 18) + (lastPerls[0].noise * 18 *6));
	// var limited_sgv_pump = sgv_pump;
	// if (sgv_pump >= 400) {
	//     limited_sgv_pump = 400;}
	//     else if (sgv_pump <=40) {
	//         limited_sgv_pump = 40;
	// };
	// var dict = {"dateString" : today, "sgv" : limited_sgv_pump, "type" : "sgv", "direction": arrowValues[0].direction, "date" : Date.now(),
	//      };
	// var dictstring = JSON.stringify(dict);

	// WITHOUT PUMP
	//= ===========
	const variation = (sgvValues[0].sgv + BGI_ins + (liver_bgi * 18) + (carbs * 18) + (lastPerls[0].noise * 18 * 6));
	const variationPlanets = variation * planetFactor * moonFactor;

	const sgv_no_pump = Math.floor(variationPlanets);

	let limited_sgv_no_pump = sgv_no_pump;
	if (sgv_no_pump >= 400) {
		limited_sgv_no_pump = 400;
	} else if (sgv_no_pump <= 40) {
		limited_sgv_no_pump = 40;
	}
	const cgmSimSgv = {
		dateString: today,
		sgv: limited_sgv_no_pump,
		type: 'sgv',
		direction: arrowValues[0].direction,
		date: Date.now(),
	};

	//	const dictstring = JSON.stringify(dict);

	// fs.writeFile('./files/cgmsim-sgv.json', dictstring, (err, result) => {
	// 	if (err) console.log('error', err);
	// });

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
	return cgmSimSgv;
};
