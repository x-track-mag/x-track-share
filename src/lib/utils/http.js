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
		proxyTimeout: 30_000 // limit proxying to 30 seconds
	});
	const start = Date.now();

	try {
		await new Promise((resolve, reject) => {
			let finished = false;

			proxy.on("proxyReq", (proxyReq) => {
				proxyReq.on("close", () => {
					if (!finished) {
						const elapsed = start - Date.now();
						console.log(
							`Proxy request to ${target} succeded after ${elapsed}ms`
						);
						finished = true;
						resolve(true);
					}
				});
			});
			proxy.on("error", (err) => {
				if (!finished) {
					const elapsed = start - Date.now();
					console.log(
						`Proxy request to ${target} failed after ${elapsed}ms :`,
						err
					);
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
