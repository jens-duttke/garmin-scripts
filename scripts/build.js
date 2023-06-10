#!/usr/bin/env node

const { renameCodeFiles } = require('./helper/rename-code-files.js');
const { runCompiler } = require('./helper/run-compiler.js');
const { runSimulator } = require('./helper/run-simulator.js');
const { setApplicationId } = require('./helper/set-application-id.js');
const { setApplicationName } = require('./helper/set-application-name.js');

if (process.platform === 'win32') {
	const readline = require('readline').createInterface({
		input: process.stdin,
		output: process.stdout
	});

	readline.on('SIGINT', () => {
		process.emit('SIGINT');
	});
}

void (async () => {
	if (!['--debug', '--simulator', '--beta', '--release'].includes(process.argv[2])) {
		console.log('Please specify either --debug, --simulator, --beta or --release');

		process.exit(1);
	}

	const arg2 = process.argv[2].substr(2);
	let device = process.argv[3];
	const isSimulator = (arg2 === 'simulator');
	/** @type {'debug' | 'release' | 'beta'} */
	const mode = (isSimulator ? 'debug' : arg2);

	if (['debug', 'simulator'].includes(mode)) {
		if (!device) {
			device = 'fenix7';
		}
	}
	else {
		if (device) {
			console.log(`Device "${device}" can only be specified in --debug or --simulator`);

			process.exit(1);
		}
	}

	const unsetApplicationId = setApplicationId(mode);
	const revertApplicationName = (mode === 'release' ? () => undefined : setApplicationName(mode));
	const revertRenaming = renameCodeFiles(mode === 'debug');

	// Revert changes on Ctrl+C
	process.on('SIGINT', () => {
		revertRenaming();
		revertApplicationName();
		unsetApplicationId();

		process.exit();
	});

	let code = await runCompiler(mode, device);

	revertRenaming();
	revertApplicationName();
	unsetApplicationId();

	if (code === 0 && isSimulator) {
		code = await runSimulator(device);
	}

	if (code === 0) {
		process.stdout.write('\n\u001B[32mEverything is fine!\u001B[39m\n\n');
	}
	else {
		process.stdout.write('\n\u001B[31mERROR!!!\u001B[39m\n\n');
	}

	process.exit(code);
})();
