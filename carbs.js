export const carbs = ({ carbAbsTime, ISF, CR }, meals) => {
	const fast_carbAbsTime = carbAbsTime / 6; // = 1 h or 60 min
	const slow_carbAbsTime = carbAbsTime / 1.5; // = 4 h or 240 min

	const timeSinceMealAct = meals.map((entry) => {
		const t = entry.time;
		const carbs_g = entry.carbs;

		// the first 40g of every meal are always considered fast carbs
		const fast = Math.min(entry.carbs, 40);

		// the amount exceeding 40 grams will be randomly split into fast and slow carbs
		const rest = entry.carbs - fast;
		const FSR = (Math.random() * (0.4 - 0.1) + 0.1); // FSR = FAST RANDOM RATIO

		// all fast carbs counted together
		const fast_carbs = fast + (FSR * rest);

		// the remainder is slow carbs
		const slow_carbs = (1 - FSR) * rest;

		// console.log(fast_random_ratio);
		// console.log(fast_carbs);
		// console.log(slow_carbs);
		console.log('carbs_g:', carbs_g, 'fast:', fast, 'rest:', rest, 'fast_carbs:', fast_carbs, 'slow_carbs:', slow_carbs);
		let AT2;
		let fast_carbrate;
		let slow_carbrate;
		let COB;
		let AAA;
		let BBB;
		if (t < (fast_carbAbsTime / 2)) {
			AT2 = fast_carbAbsTime ** 2;
			fast_carbrate = (fast_carbs * 4 * t) / AT2;
			COB = (fast_carbs * 2 * t ** 2) / AT2;
		} else if (t < (fast_carbAbsTime)) {
			fast_carbrate = ((fast_carbs * 4) / fast_carbAbsTime) * (1 - (t / fast_carbAbsTime));
			AAA = ((4 * fast_carbs) / fast_carbAbsTime);
			BBB = t ** 2 / (2 * fast_carbAbsTime);
			COB = (AAA * (t - BBB)) - fast_carbs;
		} else {
			fast_carbrate = 0;
			COB = 0;
			console.log('fast carb absorption rate:', fast_carbrate);
		}

		if (t < (slow_carbAbsTime / 2)) {
			AT2 = slow_carbAbsTime ** 2;
			slow_carbrate = (slow_carbs * 4 * t) / AT2;
			COB = (slow_carbs * 2 * t ** 2) / AT2;
		} else if (t < (slow_carbAbsTime)) {
			slow_carbrate = ((slow_carbs * 4) / slow_carbAbsTime) * (1 - (t / slow_carbAbsTime));
			AAA = ((4 * slow_carbs) / slow_carbAbsTime);
			BBB = t ** 2 / (2 * slow_carbAbsTime);
			COB = (AAA * (t - BBB)) - slow_carbs;
		} else {
			slow_carbrate = 0;
			COB = 0;
			console.log('slow carb absorption rate:', slow_carbrate);
		}

		return {
			...entry,
			time: t,
			fast_carbrate,
			slow_carbrate,
			all_carbrate: fast_carbrate + slow_carbrate,
		};
	});
	console.log(timeSinceMealAct);

	const totalCarbRate = timeSinceMealAct.reduce((tot, arr) => tot + arr.all_carbrate, 0);

	console.log(totalCarbRate);

	return totalCarbRate;
};
