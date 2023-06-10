const childProcess = require('node:child_process');
const path = require('path');

const { getCurrentSDKPath } = require('./get-current-sdk-path.js');

/**
 * Run the simulator
 *
 * @public
 * @param {string} device
 * @returns {Promise<number>}
 */
async function runSimulator (device) {
	const exitCode = await new Promise((resolve) => {
		const child = childProcess.spawn(`"${path.join(getCurrentSDKPath(), 'bin/connectiq')}"`, {
			shell: true
		});

		child.stdout.on('data', (data) => {
			process.stdout.write(data.toString());
		});

		child.stderr.on('data', (data) => {
			const lines = data.toString().split(/\r\n|\n|\r/u);
			const lastLine = lines.length - 1;

			for (let i = 0; i <= lastLine; i++) {
				const line = lines[i];

				if (line !== '') {
					if (line.startsWith('WARNING:')) {
						process.stdout.write(`\u001B[90m${line}\u001B[39m`);
					}
					else {
						process.stdout.write(`\u001B[31m${line}\u001B[39m`);
					}
				}

				if (i < lastLine) {
					process.stdout.write('\n');
				}
			}
		});

		child.on('exit', (code) => {
			resolve(code);
		});
	});

	if (exitCode !== 0) {
		return exitCode;
	}

	return new Promise((resolve) => {
		const child = childProcess.spawn(`"${path.join(getCurrentSDKPath(), 'bin/monkeydo')}"`, [
			path.join(process.cwd(), 'build', path.basename(path.resolve(process.cwd())) + '.prg'),
			device
		], {
			shell: true
		});

		child.stdout.on('data', (data) => {
			process.stdout.write(data.toString());
		});

		child.stderr.on('data', (data) => {
			const lines = data.toString().split(/\r\n|\n|\r/u);
			const lastLine = lines.length - 1;

			for (let i = 0; i <= lastLine; i++) {
				const line = lines[i];

				if (line !== '') {
					if (line.startsWith('WARNING:')) {
						process.stdout.write(`\u001B[90m${line}\u001B[39m`);
					}
					else {
						process.stdout.write(`\u001B[31m${line}\u001B[39m`);
					}
				}

				if (i < lastLine) {
					process.stdout.write('\n');
				}
			}
		});

		child.on('exit', (code) => {
			resolve(code ?? 0);
		});
	});
}

module.exports = {
	runSimulator
};
