import suite from "baretest";
import code from "@hapi/code";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { extractPaths, EMPTY_RAILWAY } from "./Folders.js";

const { expect } = code;
const FoldersTestSuite = suite("Folders");

// REBUILD THE COMMON JS ENV VARIABLES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

FoldersTestSuite("Empty path yields empty leaf and parents", () => {
	const emptyRailway = extractPaths("");
	expect(emptyRailway).to.equal(EMPTY_RAILWAY);
});
