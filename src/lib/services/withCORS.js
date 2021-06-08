import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

// Default CORS options
const _DEFAULT_OPTIONS = {
	methods: ["GET", "HEAD"],
	origin: "http://localhost:6006"
};

/**
 * Helper method to wait for a middleware to execute before continuing
 * And to throw an error when an error happens in a middleware
 * @see http://expressjs.com/en/guide/writing-middleware.html
 *
 * @param {Function} middleware Express compatible middleware
 * @param {NextApiRequest} req
 * @param {NextApiResponse} resp
 * @returns
 */
export const runMiddleware = (middleware, req, resp) => {
	return new Promise((resolve, reject) => {
		middleware(req, resp, (result) => {
			if (result instanceof Error) {
				return reject(result);
			}

			return resolve(result);
		});
	});
};

/**
 * @see https://github.com/expressjs/cors#configuration-options
 * @param {Function} handler API request handler
 * @param {Object} corsOptions
 * @returns {Function} API request handler with CORS check
 */
const withCORS = (handler, corsOptions = _DEFAULT_OPTIONS) => async (req, resp) => {
	// Run the middleware
	await runMiddleware(Cors(corsOptions), req, resp);

	// Rest of the API logic
	await handler(req, resp);
};

export default withCORS;
