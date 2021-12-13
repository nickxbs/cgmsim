import moment from 'moment';
// const entries = require('./files/entries.json');
// var json = JSON.stringify(entries);
// var entries = JSON.parseWithDate(json);
// console.log(entries);
export const allMeals = (entries) => {
	const meals = entries
		.filter((e) => e.carbs)
		.map((e) => ({
			time: e.created_at,
			carbs: e.carbs,
		}));

	console.log('this is the filtered meals (carbs):', meals);
	console.log('length', meals.length); // returns the number of meals or lenghth of the array

	const meals2 = meals
		.map((entry) => ({
			...entry,
			time: moment(entry.time).valueOf(),
		}));
	const timeSinceMealMin = meals2
		.map((entry) => ({
			...entry,
			mills: entry.time,
			time: (Date.now() - moment(entry.time).valueOf()) / (1000 * 60),
		}));
	console.log('this is the trimmed down meals and time since last meal:', timeSinceMealMin);

	// this is for the calculations of carbs ingestion
	// keep only the meals from the last 6 hours or 360 min
	const lastMeals = timeSinceMealMin.filter((e) => e.time <= 360);
	console.log('these are the last meals: ', lastMeals);

	const dataMeals = JSON.stringify(lastMeals, null, 4);

	// this is added only for the generation of surprise meals, counted on the amount of carbs in the previous 24h
	// keep only the meals from the last 24 hours or 1440 min
	const dataMeals24 = timeSinceMealMin.filter((e) => e.time <= 1440);
	console.log('these are the last meals: ', dataMeals24);

	return dataMeals24;
};
