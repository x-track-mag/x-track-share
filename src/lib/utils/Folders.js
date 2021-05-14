export const EMPTY_RAILWAY = {
	leaf: "",
	parents: []
};

/**
 * @typedef Railway
 * @property {String} leaf
 * @property {Array<String>} parents
 */

/**
 * Giving a slash '/' separated path,
 * extract the leaf and all the preceding parent paths
 * eg.
 *   extractPaths("my/way/to/home") =>
 *   {
 *     leaf: "home",
 *     parents: [
 *       "my",
 *       "my/way",
 *       "my/way/to"
 *     ]
 *   }
 * @param {String} path
 * @returns {Railway}
 */
export const extractPaths = (path) => {
	if (!path) {
		return EMPTY_RAILWAY;
	}
	const parents = path.split("/");
	const leaf = parents.pop();
	for (let i = parents; i < parents.length; i++) {
		if (i > 0) {
			parents[i] = parents[i - 1] + "/" + parents[i];
		}
	}
	return {
		leaf,
		parents
	};
};
