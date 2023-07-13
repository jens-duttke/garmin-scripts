#!/usr/bin/env node

const { promises: fs } = require('fs');
const path = require('path');

const { getAppDataPath } = require('./helper/get-app-data-path.js');

const productId = process.argv.slice(-1)[0];

const devicePath = path.join(getAppDataPath(), 'Garmin/ConnectIQ/Devices');

void (async () => {
	const files = await fs.readdir(devicePath);

	await Promise.all(files.map(async (filePath) => {
		try {
			/** @type {{ displayName: string; hardwarePartNumber: string; worldWidePartNumber: string; partNumbers: { number: string; firmwareVersion: string; connectIQVersion: string; }[]; }} */
			const data = JSON.parse(await fs.readFile(path.join(devicePath, filePath, 'compiler.json'), 'utf8'));

			if (productId === data.hardwarePartNumber) {
				console.log(`Found Hardware Part Number for "${data.displayName}"`);
			}

			if (productId === data.worldWidePartNumber) {
				console.log(`Found World-wide Part Number for "${data.displayName}"`);
			}

			if (productId === data.hardwarePartNumber) {
				console.log(`Found Hardware Part Number for "${data.displayName}"`);
			}

			const partNumbersItem = data.partNumbers.find(({ number }) => number === productId);

			if (partNumbersItem) {
				console.log(`Found Part Number for "${data.displayName}", Connect IQ Version ${partNumbersItem.connectIQVersion}, Firmware Version: ${partNumbersItem.firmwareVersion}`);
			}
		}
		catch { /* Do nothing */ }
	}));
})();
