/** @type {Record<string, number | undefined>} */
const EXIT_CODE_MAPPING = {
	SIGHUP: 129,
	SIGINT: 130,
	SIGQUIT: 131,
	SIGILL: 132,
	SIGTRAP: 133,
	SIGABRT: 134,
	SIGBUS: 135,
	SIGFPE: 136,
	SIGKILL: 137,
	SIGUSR1: 138,
	SIGSEGV: 139,
	SIGUSR2: 140,
	SIGPIPE: 141,
	SIGALRM: 142,
	SIGTERM: 143
};

/**
 * Retrieves the exit code based on the given signal.
 *
 * @public
 * @param {string | null} signal - The signal for which to retrieve the exit code.
 * @returns {number} The exit code corresponding to the provided signal. If the signal is recognized, the exit code is calculated as 128 + signal number. If the signal is not recognized, -1 is returned.
 */
function getExitCodeBySignal (signal) {
	if (signal === null) {
		return -1;
	}

	return EXIT_CODE_MAPPING[signal] ?? -1;
}

module.exports = {
	getExitCodeBySignal
};
