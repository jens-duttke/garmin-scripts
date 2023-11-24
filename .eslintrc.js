/**
 * @file ESLint configuration
 */

module.exports = {
	extends: [
		require.resolve('linter-bundle/eslint.cjs'),
		require.resolve('linter-bundle/eslint/overrides-javascript-lazy.cjs'),
		require.resolve('linter-bundle/eslint/overrides-jsdoc.cjs'),
		require.resolve('linter-bundle/eslint/overrides-type-declarations.cjs')
	],
	rules: {
		'no-console': 'off',
		'n/no-process-exit': 'off',
		'jsdoc/require-file-overview': 'off',
		'jsdoc/require-param-description': 'off',
		'jsdoc/require-returns-description': 'off'
	}
};
