import Proxy from "next/dist/compiled/http-proxy";

/**
 * Extract the search params from and incoming HTTP GET request
 * @param {IncomingMessage} req
 * @return {URLSearchParams}
 */
export const getSearchParams = (req) =>
	new URL(req.url, `http://${req.headers.host}`).searchParams;

/**
 *
 * @param {String} target
 * @param {IncomingMessage} req
 * @param {ServerRes} resp
 * @returns {Object}
 */
export const proxyReq = async (target, req, resp) => {
	const proxy = new Proxy({
		target,
		changeOrigin: true,
		ignorePath: true,
		proxyTimeout: 30_000 // limit proxying to 30 seconds
	});

	try {
		await new Promise((resolve, reject) => {
			let finished = false;

			proxy.on("proxyReq", (proxyReq) => {
				proxyReq.on("close", () => {
					if (!finished) {
						finished = true;
						resolve(true);
					}
				});
			});
			proxy.on("error", (err) => {
				if (!finished) {
					finished = true;
					reject(err);
				}
			});
			proxy.web(req, resp);
		});

		return {
			success: true
		};
	} catch (err) {
		console.error(`Error Proxying API request to '${target}'`, err);
		return {
			code: 500,
			success: false,
			error: err
		};
	}
};
