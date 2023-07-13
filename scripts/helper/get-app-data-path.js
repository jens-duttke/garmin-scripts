/**
 * Returns the path to the app data folder on different operating systems.
 *
 * @public
 * @returns {string}
 */
function getAppDataPath () {
	// eslint-disable-next-line n/no-process-env -- The process environment variables are the source for the paths, so using them is required here.
	return process.env.APPDATA ?? (process.platform === 'darwin' ? `${process.env.HOME}/Library/Preferences` : `${process.env.HOME}/.local/share`);
}

module.exports = {
	getAppDataPath
};
