#!/usr/bin/env node
import suite from "baretest";
import code from "@hapi/code";
import { getDeepContent } from "./CloudinaryClient.js";

const { expect } = code;
const CloudinaryClientTestSuite = suite("Cloudinary Client Test Suite");

CloudinaryClientTestSuite("Get a folder's content", async () => {
	const sharedFolders = await getDeepContent("share");
	expect(sharedFolders).to.be.an.object();
});

export default CloudinaryClientTestSuite;

/**
 * Check to see if we were launched from the command line to launch the test suite immediately
 */
(async () => {
	if (process.argv0) {
		// Running the test suite from the command line
		await CloudinaryClientTestSuite.run();
	}
})();
