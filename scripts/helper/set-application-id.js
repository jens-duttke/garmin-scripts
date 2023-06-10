const fs = require('fs');
const path = require('path');

const applicationIdRegExp = /(?<=iq:application\s.*(?<=\s)id=")(.*?)(?=".*>)/u;

/**
 * Set the application ID in the manifest.xml
 *
 * @public
 * @param {'debug' | 'beta' | 'release'} mode
 * @returns {() => void)} Function to unset the application id after the compiling is finished
 */
function setApplicationId (mode) {
	const store = JSON.parse(fs.readFileSync(path.join(process.cwd(), '.store')));

	const filePath = path.join(process.cwd(), 'manifest.xml');

	const content = fs.readFileSync(filePath, { encoding: 'utf8' });

	if (!applicationIdRegExp.test(content)) {
		throw new Error('"id" not found in manifest.xml');
	}

	const id = (mode in store ? store[mode] : '00000000-0000-0000-0000-000000000000');

	fs.writeFileSync(filePath, content.replace(applicationIdRegExp, id));

	return () => {
		fs.writeFileSync(filePath, content.replace(applicationIdRegExp, ''));
	};
}

module.exports = {
	setApplicationId
};
