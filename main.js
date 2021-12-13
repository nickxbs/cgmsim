import dotenv from 'dotenv';
import downloads from './downloads';
import { computeBolusIOB } from './computeBolusIOB';
import { computeBasalIOB } from './computeBasalIOB';
import { detemir } from './detemir';
import { glargine } from './glargine';
import { allMeals } from './all_meals';
import { carbs } from './carbs';
import { arrows } from './arrows';
import { sgvStart } from './sgv_start';
import { uploadCgmSimSgv } from './upload-cgmsim';

dotenv.config();

const tp = parseInt(process.env.TP);
const dia = parseInt(process.env.DIA);
const weight = parseInt(process.env.WEIGHT);
const carbAbsTime = parseInt(process.env.CARBS_ABS_TIME); // meal absoption time in min defautl 360 or 6 hours

const {
	ISF,
	CR,
	API_POST,
	APISECRET,
} = process.env;

function run() {
	return downloads()
		.then(({ profile, sgv, entries }) => {
			const { resultAct, resultIob } = computeBolusIOB(entries, { tp, dia });
			const { lastDET, lastGLA } = computeBasalIOB(entries);
			const detAct = detemir(weight, lastDET);
			const glaAct = glargine(weight, lastGLA);
			const dataMeals24 = allMeals(entries);
			const totalCarbRate = carbs({ carbAbsTime, ISF, CR }, dataMeals24);
			const arrowsDirections = arrows(sgv);

			const cgmSimSgv = sgvStart({ ISF, CR }, sgv, {
				resultAct,
				resultIob,
				detAct,
				glaAct,
				totalCarbRate,
				arrowsDirections,
			});
			return uploadCgmSimSgv({ API_POST, APISECRET }, cgmSimSgv);
		});
}

run();
