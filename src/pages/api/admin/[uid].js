import CloudinaryClient from "../../../lib/services/CloudinaryClient.js";

/**
 * The API entry point (GET) to retrieve the full content of a root shared folder
 */
export default async (req, resp) => {
	const { uid } = req.query; // UID of the shared folder
	try {
		const respBody = await CloudinaryClient.getFlatContent(uid);
		resp.json(respBody);
	} catch (err) {
		resp.status(err.code || 500).json({
			success: false,
			error: err.message
		});
	}
};
