import moment from 'moment';

// const entries = require('./files/entries.json');
// var json = JSON.stringify(entries);
// var notes = JSON.parseWithDate(json);
// console.log(notes);

export const computeBasalIOB = (entries) => {
	const basal = entries
		.filter((e) => e.notes)
		.map((e) => ({ time: e.created_at, notes: e.notes }));

	console.log('this is the filtered treatments (basal):', basal);
	console.log('length', basal.length); // returns the number of boluses or lenghth of the array

	const basals = basal
		.map((entry) => ({ ...entry, time: moment(entry.time).valueOf() }));

	const timeSinceBasalMin = basals.map((entry) => ({
		...entry,
		time: (Date.now() - moment(entry.time).valueOf()) / (1000 * 60 * 60),
		drug: entry.notes.slice(0, 3),
		dose: parseInt(entry.notes.slice(8), 10),
	}));
	console.log('this is the trimmed down insulin and time since injection data:', timeSinceBasalMin);
	// keep only the basals from the last 36 hours
	const lastBasals = timeSinceBasalMin.filter((e) => e.time <= 36);
	console.log('these are the last basals: ', lastBasals);
	// keep only the glas from the last 36 hours
	const lastGLA = lastBasals.filter((e) => e.drug === 'gla' || e.drug === 'Gla');
	console.log('these are the last glargines: ', lastGLA);

	// keep only the dets from the last 36 hours
	const lastDET = lastBasals.filter((e) => e.drug === 'det' || e.drug === 'Det');
	console.log('these are the last detemirs: ', lastDET);

	return { lastDET, lastGLA };
	// const datadet = JSON.stringify(lastDET, null, 4);
	// const datagla = JSON.stringify(lastGLA, null, 4);
};

// fs.writeFile('./files/last_detemir.json', datadet, (err) => {
// 	if (err) {
// 		throw err;
// 	}
// 	console.log("JSON detemir data is saved.");
// });
// fs.writeFile('./files/last_glargine.json', datagla, (err) => {
// 	if (err) {
// 		throw err;
// 	}
// 	console.log("JSON glargine data is saved.");
// });
