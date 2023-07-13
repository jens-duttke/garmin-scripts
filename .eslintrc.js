/**
 * @file ESLint configuration
 */

module.exports = {
	extends: [
		require.resolve('linter-bundle/eslint'),
		require.resolve('linter-bundle/eslint/overrides-javascript-lazy'),
		require.resolve('linter-bundle/eslint/overrides-jsdoc'),
		require.resolve('linter-bundle/eslint/overrides-type-declarations')
	],
	rules: {
		'no-console': 'off',
		'n/no-process-exit': 'off',
		'jsdoc/require-file-overview': 'off',
		'jsdoc/require-param-description': 'off',
		'jsdoc/require-returns-description': 'off'
	}
};
