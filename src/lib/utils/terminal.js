import colors from "colors/safe.js";

const colorTheme = {
	debug: "gray",
	log: "white",
	info: "cyan",
	success: "brightGreen",
	warn: "yellow",
	trace: "yellow",
	error: "red"
};

// set theme
colors.setTheme(colorTheme);

const terminal = {};

Object.keys(colorTheme).forEach((methodName) => {
	terminal[methodName] = (...args) => {
		(console[methodName] || console.info)(
			...args.map((arg) => colors[methodName](arg))
		);
		return terminal; // for chaining
	};
});

/**
 * @typedef terminal
 * @property {Function} debug
 * @property {Function} log
 * @property {Function} info
 * @property {Function} success
 * @property {Function} warn
 * @property {Function} trace
 * @property {Function} error
 */
export default terminal;
