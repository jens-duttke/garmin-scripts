const childProcess = require('node:child_process');
const path = require('path');

const { getCurrentSDKPath } = require('./get-current-sdk-path.js');
const { getExitCodeBySignal } = require('./get-exit-code-by-signal.js');

/**
 * Run the Monkey C compiler.
 *
 * @public
 * @param {'debug' | 'beta' | 'release'} mode
 * @param {string} device
 * @returns {Promise<number>}
 */
async function runCompiler (mode, device) {
	return new Promise((resolve) => {
		const child = childProcess.spawn('java', [
			'-Xms1g',
			'-Dfile.encoding=UTF-8',
			'-Dapple.awt.UIElement=true',
			'-jar', path.join(getCurrentSDKPath(), 'bin/monkeybrains.jar'),
			'--output', path.join(process.cwd(), 'build', path.basename(path.resolve(process.cwd())) + (mode === 'debug' ? '.prg' : '')),
			'--jungles', path.join(process.cwd(), 'monkey.jungle'),
			'--private-key', path.join(process.cwd(), 'developer_key'),
			...(mode === 'debug' ? ['--device', device, '--profile'] : ['--package-app', '--release']),
			'--typecheck', '3',
			'--optimization', '3z',
			'--warn'
		]);

		child.stdout.on('data', (data) => {
			const text = data.toString();

			if (text.startsWith('usage:')) {
				return;
			}

			process.stdout.write(text);
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

		child.on('exit', (code, signal) => {
			resolve(code ?? getExitCodeBySignal(signal));
		});
	});
}

module.exports = {
	runCompiler
};
