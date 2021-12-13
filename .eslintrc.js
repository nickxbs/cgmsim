module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'airbnb-base',
	],
	parserOptions: {
		ecmaVersion: 13,
		sourceType: 'module',
	},
	rules: {
		'linebreak-style': 'off',
		radix: 'off',
		camelcase: 'off',
		'no-console': 'off',
		indent: 'off',
		'no-tabs': 'off',
		'no-plusplus': 'off',
		'import/no-named-as-default': 'off',
		'import/no-named-as-default-member': 'off',
		'import/prefer-default-export': 'off',
		'no-underscore-dangle': 'off',
		'max-len': ['error', { code: 200 }],
		'no-unused-vars': 'warn',
		'prefer-const': 'warn',
	},
};
