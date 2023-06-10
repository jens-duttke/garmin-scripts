#!/usr/bin/env node

/**
 * @file The CLI entry point to access the ERA tool (Error Reporting Application) to view your app's crashes after it has been released on the store.
 *
 * @see https://developer.garmin.com/connect-iq/core-topics/exception-reporting-tool/
 */

const childProcess = require('node:child_process');
const path = require('path');

const { getCurrentSDKPath } = require('./helper/get-current-sdk-path.js');

const appId = process.argv[2];

if (!appId) {
	console.log('Please specify a app id');

	process.exit(1);
}

const child = childProcess.spawn(path.join(getCurrentSDKPath(), 'bin/era.bat'), [
	'-a', appId,
	'-k', path.join(process.cwd(), 'developer_key')
]);

child.stdout.on('data', (data) => {
	process.stdout.write(data.toString());
});

child.stderr.on('data', (data) => {
	process.stdout.write(`\u001B[31m${data.toString()}\u001B[39m`);
});

child.on('exit', (code) => {
	process.exit(code);
});
