import fetch from 'node-fetch';

import crypto from 'crypto';

export const uploadCgmSimSgv = ({ API_POST, APISECRET }, cgmSimSgv) => {
	// let's build the API_secret for the headers and the API_url for the fetch() function
	//= ==================================================================================

	const hash = crypto.createHash('sha1');
	hash.update(APISECRET);
	const hashed_secret = hash.digest('hex');

	// now the fetch function itself
	//= =============================
	const headers = {
		'Content-Type': 'application/json',
		'api-secret': hashed_secret,
	};

	console.log(cgmSimSgv);

	return fetch(API_POST, {
		method: 'POST',
		headers,
		body: cgmSimSgv,
	});
};
