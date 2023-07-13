const fs = require('fs');

const { getFilesRecursive } = require('./get-files-recursive.js');

const appNameRegExp = /(?<=<string id="AppName">)(.+?)(?=<\/string>)/u;

/**
 * Append the build mode to the AppName in XML files.
 *
 * @public
 * @param {'debug' | 'beta' | 'release'} mode
 * @returns {() => void} Function to reset the AppName string to their original string
 */
function setApplicationName (mode) {
	const files = getFilesRecursive(process.cwd(), /\.xml$/u);
	/** @type {[filePath: string, content: string][]} */
	const replacedFiles = [];

	for (const filePath of files) {
		const content = fs.readFileSync(filePath, 'utf8');

		const match = appNameRegExp.exec(content);
		if (match !== null) {
			const appName = match[0];

			replacedFiles.push([filePath, content]);

			fs.writeFileSync(filePath, content.replace(appNameRegExp, `${appName} (${mode})`));
		}
	}

	return () => {
		for (const [filePath, content] of replacedFiles) {
			fs.writeFileSync(filePath, content);
		}
	};
}

module.exports = {
	setApplicationName
};
