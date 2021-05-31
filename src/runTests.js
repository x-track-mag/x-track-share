#!/usr/bin/env node

import path, { dirname } from "path";
import { fileURLToPath } from "url";
import FileWalker from "./lib/utils/FileWalker.js";
import { loadEnv } from "./lib/utils/Env.js";
import terminal from "./lib/utils/terminal.js";

// REBUILD THE COMMON JS ENV VARIABLES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const log = console.log;

const runSingleTest = async (sourceFile) => {
	try {
		const testSuite = await import(path.join(__dirname, sourceFile));
		const run = new Promise((resolve, reject) => {
			testSuite.default.after(resolve);
			testSuite.default.run();
		}).catch((err) => {
			terminal.error(`Test suite ${sourceFile} could not be run : ${err}`);
		});

		return run;
	} catch (err) {
		terminal.error(`Test suite ${sourceFile} throwed an error : ${err.message}`);
	}
};

(async function runTests() {
	const messages = [];
	console.log = console.warn = (...args) => messages.push(...args);
	loadEnv();
	try {
		const sourceDir = path.join(__dirname);
		const walk = new FileWalker(sourceDir).filterFiles((vfile) =>
			vfile.path.endsWith(".spec.js")
		);

		const testJobs = [];
		await new Promise(async (resolve, reject) => {
			await walk
				.on("file", (testFile) => {
					testJobs.push(runSingleTest(testFile));
					terminal.info(`Added test file '${testFile}'`);
				})
				.on("end", async () => {
					terminal.info(`We have ${testJobs.length} test jobs pending..\n`);
					resolve(true);
				})
				.on("error", (err) => {
					terminal.error(err.message || err);
					reject(err);
				})
				.explore();
		});

		// Count failed test suites
		const allDone = await Promise.allSettled(testJobs);
		const failed = allDone.reduce(
			(fails, result) => (result.status === "rejected" ? fails + 1 : fails),
			0
		);
		if (failed === 0) {
			terminal.success("Great Success. All tests passed !\n");
		} else {
			terminal.warn(`Some tests failed (${failed}/${allDone.length})!\n`);
		}

		terminal.info("Generated log");
		terminal.info("=============");
		terminal.debug(messages.map((msg) => msg + "\n"));

		process.exit(failed);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
})();
