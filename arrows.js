// const sgvs = require('./files/sgv.json');
export const arrows = (sgvs) => {
	const sgvDir1 = sgvs[0].sgv - sgvs[1].sgv;
	const sgvDir2 = sgvs[1].sgv - sgvs[2].sgv;
	const sgvDir3 = sgvs[2].sgv - sgvs[3].sgv;
	const sgvDir15Min = (sgvDir1 + sgvDir2 + sgvDir3) / 3;
	console.log('this is the mean SGV 5 min variation in the last 15 minutes:', sgvDir15Min, 'mg/dl');

	const arrowsDirections = [];

	if (sgvDir15Min < -10) {
		arrowsDirections.push({ svgdir: sgvDir15Min, direction: 'DoubleDown' });
	} else if (sgvDir15Min < -6) {
		arrowsDirections.push({ svgdir: sgvDir15Min, direction: 'SingleDown' });
	} else if (sgvDir15Min < -2) {
		arrowsDirections.push({ svgdir: sgvDir15Min, direction: 'FortyFiveDown' });
	} else if (sgvDir15Min < 2) {
		arrowsDirections.push({ svgdir: sgvDir15Min, direction: 'Flat' });
	} else if (sgvDir15Min < 6) {
		arrowsDirections.push({ svgdir: sgvDir15Min, direction: 'FortyFiveUp' });
	} else if (sgvDir15Min < 10) {
		arrowsDirections.push({ svgdir: sgvDir15Min, direction: 'SingleUp' });
	} else if (sgvDir15Min >= 10) {
		arrowsDirections.push({ svgdir: sgvDir15Min, direction: 'DoubleUp' });
	}
	console.log(arrowsDirections);
	return arrowsDirections;
};
