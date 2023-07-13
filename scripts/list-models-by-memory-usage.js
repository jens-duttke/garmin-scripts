#!/usr/bin/env node

const { promises: fs } = require('fs');
const path = require('path');

const { getAppDataPath } = require('./helper/get-app-data-path.js');

const devicePath = path.join(getAppDataPath(), 'Garmin/ConnectIQ/Devices');

void (async () => {
	const files = await fs.readdir(devicePath);

	const dataFields = await Promise.all(files.map(async (filePath) => {
		/** @type {string | undefined} */
		let displayName;
		/** @type {string} */
		let memoryLimit;

		try {
			/** @type {{ displayName: string; appTypes: { type: string; memoryLimit: number; }[]; }} */
			const data = JSON.parse(await fs.readFile(path.join(devicePath, filePath, 'compiler.json'), 'utf8'));

			displayName = data.displayName;
			memoryLimit = data.appTypes.find(({ type }) => type === 'datafield')?.memoryLimit.toString() ?? 'Type "datafield" not found.';
		}
		catch (error) {
			if (error instanceof Error) {
				memoryLimit = error.message;
			}
			else {
				memoryLimit = 'Unknown error';
			}
		}

		return {
			filePath,
			displayName,
			memoryLimit
		};
	}));

	/** @type {string[]} */
	const memoryLimits = [];

	for (const { memoryLimit } of dataFields) {
		if (!memoryLimits.includes(memoryLimit)) {
			memoryLimits.push(memoryLimit);
		}
	}

	memoryLimits.sort((a, b) => b.toString().localeCompare(a.toString(), undefined, { numeric: true }));

	for (const memoryLimit of memoryLimits) {
		console.log();
		console.log(`${memoryLimit}:`);

		for (const dataField of dataFields) {
			if (dataField.memoryLimit === memoryLimit) {
				console.log(`- ${dataField.displayName} (${dataField.filePath})`);
			}
		}
	}
})();
