const fs = require('fs');

const { getFilesRecursive } = require('./get-files-recursive.js');

/**
 * In debug mode, rename `*.release.mc` to `*.release.mc-`, otherwise rename `*.debug.mc` to `*.debug.mc-` to force the compiler to ignore these files.
 *
 * @public
 * @param {boolean} isDebug
 * @returns {() => void} Function to revert renaming after the compiling is finished
 */
function renameCodeFiles (isDebug) {
	const filesToRename = getFilesRecursive(process.cwd(), (isDebug ? /\.release\.mc$/u : /\.debug\.mc$/u));

	for (const filePath of filesToRename) {
		fs.renameSync(filePath, `${filePath}-`);
	}

	return () => {
		for (const filePath of filesToRename) {
			fs.renameSync(`${filePath}-`, filePath);
		}
	};
}

module.exports = {
	renameCodeFiles
};
