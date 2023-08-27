const fs = require('fs');
const path = require('path');

const { getAppDataPath } = require('./get-app-data-path.js');

const SDK_DATE_REGEXP = /(\d\d\d\d)-(\d\d)-(\d\d)-.+$/u;

/**
 * Returns the path to the current Connect IQ SDK version.
 *
 * @public
 * @returns {string}
 * @throws {Error} If no Connect IQ SDK folder has been found.
 */
function getCurrentSDKPath () {
	const connectIQPath = path.join(getAppDataPath(), 'Garmin/ConnectIQ');
	const sdkConfigFile = path.join(connectIQPath, 'current-sdk.cfg');

	const sdkPath = fs.existsSync(sdkConfigFile) && fs.lstatSync(sdkConfigFile).isFile() && fs.readFileSync(sdkConfigFile, 'utf8').trim();

	if (sdkPath && fs.existsSync(sdkPath) && fs.lstatSync(sdkPath).isDirectory()) {
		return sdkPath;
	}

	const connectIQSdksDirectories = getSubDirectories(path.join(connectIQPath, 'Sdks'));

	if (connectIQSdksDirectories.length === 0) {
		throw new Error(`No Connect IQ SDK found in ${connectIQPath}`);
	}
	else if (connectIQSdksDirectories.length === 1) {
		return connectIQSdksDirectories[0];
	}
	else {
		/** @type {[number, string][]} */
		const orderedDirectories = connectIQSdksDirectories.map((name) => {
			const match = SDK_DATE_REGEXP.exec(name);

			if (match === null) {
				return null;
			}

			const version = Number.parseInt(`${match[1]}${match[2]}${match[3]}`, 10);

			if (!Number.isFinite(version)) {
				return null;
			}

			/** @type {[number, string]} */
			return [version, name];
		}).filter(
			/**
			 * Removes `null` values.
			 *
			 * @param {((number | string)[] | null)} item - The item to check.
			 * @returns {item is [number, string]} - True if the item is of type [number, string], false otherwise.
			 */
			(item) => item !== null
		).sort((a, b) => b[0] - a[0]);

		if (orderedDirectories.length === 0) {
			throw new Error(`No Connect IQ SDK folder found in ${connectIQPath}`);
		}

		return orderedDirectories[0][1];
	}
}

/**
 * Returns an array of all direct sub-directories within a path.
 *
 * @private
 * @param {string} parentPath
 * @returns {string[]}
 */
function getSubDirectories (parentPath) {
	const result = [];

	if (!fs.existsSync(parentPath)) {
		return [];
	}

	const files = fs.readdirSync(parentPath);

	for (const file of files) {
		const filePath = path.join(parentPath, file);

		if (fs.lstatSync(filePath).isDirectory()) {
			result.push(filePath);
		}
	}

	return result;
}

module.exports = {
	getCurrentSDKPath
};
