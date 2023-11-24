#!/usr/bin/env node

const { promises: fs } = require('fs');
const path = require('path');

const { getAppDataPath } = require('./helper/get-app-data-path.js');

const devicePath = path.join(getAppDataPath(), 'Garmin/ConnectIQ/Devices');
console.log(devicePath);

void (async () => {
	const files = await fs.readdir(devicePath);

	const devices = await Promise.all(files.map(async (filePath) => {
		/** @type {string | undefined} */
		let displayName;
		/** @type {string} */
		let deviceId;

		try {
			/** @type {{ displayName: string; deviceId: string; }} */
			const data = JSON.parse(await fs.readFile(path.join(devicePath, filePath, 'compiler.json'), 'utf8'));

			displayName = data.displayName;
			deviceId = data.deviceId;
		}
		catch (error) {
			if (error instanceof Error) {
				deviceId = error.message;
			}
			else {
				deviceId = 'Unknown error';
			}
		}

		return {
			filePath,
			displayName,
			deviceId
		};
	}));

	const manifestFilePath = path.join(process.cwd(), 'manifest.xml');
	const manifestContent = await fs.readFile(manifestFilePath, 'utf8');

	for (const device of devices) {
		if (!(new RegExp(`<iq:product\\s+id="${device.deviceId}"\\s*/>`, 'u').test(manifestContent))) {
			// eslint-disable-next-line unicorn/string-content -- We need to keep the closing XML comment as it is.
			console.log(`<iq:product id="${device.deviceId}"/> <!-- ${device.displayName} -->`);
		}
	}
})();
