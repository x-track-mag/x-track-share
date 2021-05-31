import { IncomingMessage, ServerResponse } from "http";
import Proxy from "next/dist/compiled/http-proxy";

/**
 * Extract the search params from and incoming HTTP GET request
 * @param {IncomingMessage} req
 * @return {URLSearchParams}
 */
export const getSearchParams = (req) =>
	new URL(req.url, `http://${req.headers.host}`).searchParams;

/**
 * Proxy the incoming http request to an external target
 * @param {String} target
 * @param {IncomingMessage} req
 * @param {ServerResponse} resp
 * @returns {Object}
 */
export const proxyRequest = async (target, req, resp) => {
	const proxy = new Proxy({
		target,
		changeOrigin: true,
		ignorePath: true,
		proxyTimeout: 30000 // limit proxying to 30 seconds
	});
	const start = Date.now();

	return new Promise((resolve, reject) => {
		proxy.on("proxyReq", (proxyReq) => {
			proxyReq.once("close", () => {
				const elapsed = Date.now() - start;
				console.log(`Proxy request to ${target} succeded after ${elapsed}ms`);
				resolve(target);
			});
		});
		proxy.once("error", (err) => {
			const elapsed = Date.now() - start;
			console.log(`Proxy request to ${target} failed after ${elapsed}ms :`, err);
			reject(err);
		});
		proxy.web(req, resp);
	});
};
