#!/usr/bin/env node

const { promises: fs } = require('fs');
const path = require('path');

const { getAppDataPath } = require('./helper/get-app-data-path.js');

const devicePath = path.join(getAppDataPath(), 'Garmin/ConnectIQ/Devices');

void (async () => {
	const files = await fs.readdir(devicePath);

	const devices = await Promise.all(files.map(async (filePath) => {
		/** @type {string | undefined} */
		let displayName;
		/** @type {string} */
		let bitsPerPixel;

		try {
			/** @type {{ displayName: string; bitsPerPixel?: number; }} */
			const data = JSON.parse(await fs.readFile(path.join(devicePath, filePath, 'compiler.json'), 'utf8'));

			displayName = data.displayName;
			bitsPerPixel = data.bitsPerPixel?.toString() ?? '"bitsPerPixel" not found.';
		}
		catch (error) {
			if (error instanceof Error) {
				bitsPerPixel = error.message;
			}
			else {
				bitsPerPixel = 'Unknown error';
			}
		}

		return {
			filePath,
			displayName,
			bitsPerPixel
		};
	}));

	/** @type {string[]} */
	const bitsPerPixels = [];

	for (const { bitsPerPixel } of devices) {
		if (!bitsPerPixels.includes(bitsPerPixel)) {
			bitsPerPixels.push(bitsPerPixel);
		}
	}

	bitsPerPixels.sort((a, b) => b.toString().localeCompare(a.toString(), undefined, { numeric: true }));

	for (const bitsPerPixel of bitsPerPixels) {
		console.log();
		console.log(`${bitsPerPixel} bit (${2 ** Number.parseInt(bitsPerPixel, 10)} colors):`);

		for (const device of devices) {
			if (device.bitsPerPixel === bitsPerPixel) {
				console.log(`- ${device.displayName} (${device.filePath})`);
			}
		}
	}
})();
