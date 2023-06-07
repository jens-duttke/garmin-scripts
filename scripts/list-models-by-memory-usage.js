#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const appDataPath = process.env.APPDATA || (process.platform === 'darwin' ? `${process.env.HOME}/Library/Preferences` : `${process.env.HOME}/.local/share`);

const devicePath = path.join(appDataPath, 'Garmin/ConnectIQ/Devices');

fs.readdir(devicePath, (error, files) => {
	const dataFields = [];
	const memoryLimits = [];

	for (const filePath of files) {
		let displayName = undefined;
		let memoryLimit = undefined;

		try {
			const data = JSON.parse(fs.readFileSync(path.join(devicePath, filePath, 'compiler.json'), 'utf8'));

			displayName = data.displayName;
			memoryLimit = data.appTypes.find(({ type }) => type === 'datafield').memoryLimit;
		}
		catch (error) {
			memoryLimit = error.message;
		}

		dataFields.push({
			filePath,
			displayName,
			memoryLimit
		});

		if (!memoryLimits.includes(memoryLimit)) {
			memoryLimits.push(memoryLimit);
		}
	}

	memoryLimits.sort((a, b)=> b - a);

	for (const memoryLimit of memoryLimits) {
		console.log();
		console.log(`${memoryLimit}:`);

		for (const dataField of dataFields) {
			if (dataField.memoryLimit === memoryLimit) {
				console.log(`- ${dataField.displayName} (${dataField.filePath})`);
			}
		}
	}
});
