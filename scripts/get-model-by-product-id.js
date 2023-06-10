#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const productId = process.argv.slice(-1)[0];

const appDataPath = process.env.APPDATA || (process.platform === 'darwin' ? `${process.env.HOME}/Library/Preferences` : `${process.env.HOME}/.local/share`);

const devicePath = path.join(appDataPath, 'Garmin/ConnectIQ/Devices');

fs.readdir(devicePath, (error, files) => {
	for (const filePath of files) {
		try {
			const data = JSON.parse(fs.readFileSync(path.join(devicePath, filePath, 'compiler.json'), 'utf8'));

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
	}
});
