import fetch from 'node-fetch';
import dotenv from 'dotenv';
// import fs from 'fs';

dotenv.config();

const api_url = process.env.API_URL;
const api_profile = process.env.API_PROFILE;
const api_sgv = process.env.API_SGV;
// const api_sgv1 = process.env.API_SGV1;

// const dir = './files';
// if (!fs.existsSync(dir)) {
//   fs.mkdirSync(dir);
// }

const downloadTreatments = () => fetch(api_url);

const downloadProfile = () => fetch(api_profile);

const downloadSGV = () => fetch(api_sgv);

// fetch(api_sgv1)
//   .then((resSGV) => resSGV.json())
//   .then((json) => {
//     const jsonSGV = JSON.stringify(json, null, 4);
//     fs.writeFile('./files/sgv1.json', jsonSGV, 'utf8', (err) => {
//       if (err) throw err;
//       console.log('File created!');
//     });
//   });
const downloadAll = () => Promise.all([
	downloadProfile(),
	downloadSGV(),
	downloadTreatments(),
]).then(([
	profile,
	sgv,
	entries,
]) => ({
	profile,
	sgv,
	entries,
}));

export default downloadAll;
