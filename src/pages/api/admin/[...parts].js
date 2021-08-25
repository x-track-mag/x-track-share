import CloudinaryClient from "../../../lib/services/CloudinaryClient.js";

/**
 * The API entry point (GET) to retrieve the flat content of a shared folder
 */
export default async (req, resp) => {
	const { parts } = req.query; // parts give path to a shared folder
	const path = parts.join("/");
	try {
		const content = await CloudinaryClient.getFlatContent(`share/${path}`);
		resp.json({
			path,
			...content
		});
	} catch (err) {
		resp.status(err.code || 500).json({
			success: false,
			error: err.message
		});
	}
};
