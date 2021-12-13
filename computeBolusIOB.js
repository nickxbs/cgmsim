import moment from 'moment';

JSON.useDateParser();

export const computeBolusIOB = (entries, { dia, tp }) => {
	const insulin = entries.filter((e) => e.insulin).map((e) => ({ time: e.created_at, insulin: e.insulin }));
	console.log('this is the filtered treatments (insulin):', insulin);
	console.log('length', insulin.length); // returns the number of boluses or lenghth of the array

	// td is the total duration of insulin action in minutes
	const td = dia * 60;
	// tp is the time to the peak insulin action in minutes
	// const tp = parseInt(process.env.TP);

	const tau = (tp * (1 - tp / td)) / (1 - (2 * tp) / td);
	const a = (2 * tau) / td;
	const S = 1 / (1 - a + (1 + a) * Math.exp(-td / tau));

	const timeSinceBolusMin = insulin.map((entry) => ({ ...entry, time: (Date.now() - moment(entry.time).valueOf()) / (1000 * 60) }));
	console.log('this is the trimmed down insulin and time since injection data:', timeSinceBolusMin);

	const timeSinceBolusAct = insulin.map((entry) => {
		const t = (Date.now() - moment(entry.time).valueOf()) / (1000 * 60);
		const dose = entry.insulin;
		return {
			...entry,
			time: t,
			activityContrib: dose * (S / tau ** 2) * t * (1 - t / td) * Math.exp(-t / tau),
			iobContrib: dose * (1 - S * (1 - a) * ((t ** 2 / (tau * td * (1 - a)) - t / tau - 1) * Math.exp(-t / tau) + 1)),
		};
	});
	// console.log(timeSinceBolusAct);

	const lastInsulins = timeSinceBolusAct.filter((e) => e.time <= 300);
	console.log('these are the last insulins and activities:', lastInsulins);

	const resultAct = lastInsulins.reduce((tot, arr) => tot + arr.activityContrib, 0);
	const resultIob = lastInsulins.reduce((tot, arr) => tot + arr.iobContrib, 0);

	console.log(resultAct, resultIob);

	const dataMealTimeArr = { resultAct, resultIob };
	return dataMealTimeArr;
};
