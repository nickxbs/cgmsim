// const weight = parseInt(process.env.WEIGHT);
// const detemirs = require('./files/last_detemir.json');
// const jsondet = JSON.stringify(detemirs);
// const detemir_data = JSON.parseWithDate(jsondet);
// console.log(detemir_data);
export const detemir = (weight, lastDET) => {
	const timeSinceDetemirAct = lastDET.map((entry) => {
		const { time } = entry;
		const { dose } = entry;
		const duration = (14 + ((24 * dose) / weight));
		const peak = (duration / 3);
		const tp = peak;
		const td = duration;

		const tau = (tp * (1 - tp / td)) / (1 - (2 * tp) / td);
		const a = (2 * tau) / td;
		const S = 1 / (1 - a + (1 + a) * Math.exp(-td / tau));

		return {
			...entry,
			time,
			dose,
			detemirActivity: (dose * (S / tau ** 2) * time * (1 - time / td) * Math.exp(-time / tau)) / 60,
		};
	});
	console.log('these are the detemir activities:', timeSinceDetemirAct);

	// compute the aggregated activity of last detemirs in 30 hours

	const lastDetemirs = timeSinceDetemirAct.filter((e) => e.time <= 30);
	console.log('these are the last detemirs and activities:', lastDetemirs);

	const detAct = lastDetemirs.reduce((tot, arr) => tot + arr.detemirActivity, 0);

	console.log(detAct);

	return detAct;
};

// activities be expressed as U/min !!!
