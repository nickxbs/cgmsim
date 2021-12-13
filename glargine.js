export const glargine = (weight, lastGLA) => {
	const timeSinceGlargineAct = lastGLA.map((entry) => {
		const { time } = entry;
		const { dose } = entry;
		const duration = (22 + ((12 * dose) / weight));
		const peak = (duration / 2.5);
		const tp = peak;
		const td = duration;

		const tau = (tp * (1 - tp / td)) / (1 - (2 * tp) / td);
		const a = (2 * tau) / td;
		const S = 1 / (1 - a + (1 + a) * Math.exp(-td / tau));

		return {
			...entry,
			time,
			glargineActivity: (dose * (S / tau ** 2) * time * (1 - time / td) * Math.exp(-time / tau)) / 60,
		};
	});
	console.log('the is the accumulated glargine activity:', timeSinceGlargineAct);

	// compute the aggregated activity of last glargines in 27 hours

	const lastGlargines = timeSinceGlargineAct.filter((e) => e.time <= 30);
	console.log('these are the last glargines and activities:', lastGlargines);

	const glaAct = lastGlargines.reduce((tot, arr) => tot + arr.glargineActivity, 0);

	console.log(glaAct);
	return glaAct;
};
