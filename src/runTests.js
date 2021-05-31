#!/usr/bin/env node

import path, { dirname } from "path";
import { fileURLToPath } from "url";
import FileWalker from "./lib/utils/FileWalker.js";
import { loadEnv } from "./lib/utils/Env.js";
import terminal from "./lib/utils/terminal.js";

// REBUILD THE COMMON JS ENV VARIABLES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const warn = console.warn;

const runSingleTest = (sourceFile) => {
	return import(path.join(__dirname, sourceFile)).then(
		(testSuite) => {
			return new Promise((resolve, reject) => {
				try {
					if (!testSuite.default) {
						reject(`Test suite ${sourceFile} doesn't export a test suite !`);
					}

					testSuite.default.after(resolve);
					testSuite.default.run();
				} catch (err) {
					reject(new Error(`Test suite ${sourceFile} run failed : ${err}`));
				}
			});
		},
		(errLoading) => {
			throw new Error(
				`Test suite ${sourceFile} couldn't be loaded : ${errLoading} !`
			);
		}
	);
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
		const failed = allDone.filter((result) => result.status === "rejected");

		console.warn = warn;
		if (!failed.length) {
			terminal.success(
				`Great Success. All ${allDone.length} tests have passed !\n`
			);
		} else {
			terminal.warn(`Some tests failed (${failed.length}/${allDone.length})!\n`);
			failed.forEach((result) => terminal.error(result.reason));
		}

		terminal.info("\nGenerated log");
		terminal.info("=============");
		terminal.debug(messages.map((msg) => msg + "\n"));

		process.exit(failed);
	} catch (err) {
		terminal.error(err);
		process.exit(1);
	}
})();
