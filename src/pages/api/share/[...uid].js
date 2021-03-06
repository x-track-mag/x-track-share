import CloudinaryClient from "../../../lib/services/CloudinaryClient.js";

/**
 * The API entry point (GET) to retrieve the full (recursive) content of a shared root folder
 */
export default async (req, resp) => {
	const { uid } = req.query; // UID of the shared folder
	const sharedRoot = uid.join("/");
	try {
		const respBody = await CloudinaryClient.getDeepContent(sharedRoot);
		resp.json(respBody);
	} catch (err) {
		resp.status(err.code || 500).json({
			success: false,
			error: err.message
		});
	}
};
