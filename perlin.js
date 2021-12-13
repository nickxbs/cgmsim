import perlin from 'perlin-noise';

export const perlinRun = () => {
	const time = Date.now();
	console.log('time',time);
	const noise = perlin.generatePerlinNoise(288, 1, {
		amplitude: 0.3,
		octaveCount: 3,
		persistence: 0.3,
	});

	console.log('noise', noise);

	const numbers = noise.map((i) => Number(i));
	console.log(numbers);
	const totalNoise = numbers.reduce((a, b) => a + b, 0);
	const meanNoise = (totalNoise / numbers.length) || 0;
	console.log('this is the noise sum:', totalNoise);
	console.log('this is the noise mean:', meanNoise);

	const myObject = [];
	for (let i = 0; i < noise.length; i++) {
		myObject.push({ noise: noise[i] / 10 - 0.05, order: (i), time: time + (i) * 1000 * 60 * 5 }, );
	}
	console.log(myObject);
	return myObject;
};

