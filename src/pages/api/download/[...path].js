import { ApiError } from "next/dist/next-server/server/api-utils";
import CloudinaryClient from "../../../lib/services/CloudinaryClient.js";
import { proxyRequest } from "../../../lib/utils/http.js";

/**
 * Take a full resource path and change the extension
 * @param {String} path
 * @param {String} format
 */
const changeFileFormat = (path = "", format = "wav") => {
	const formatPosition = path.lastIndexOf(".");
	const uncompletePath = path.substr(0, formatPosition);
	return `${uncompletePath}.${format}`;
};

/**
 * /api/download/.../path/.../filename.format
 */
export default async (req, resp) => {
	const { path } = req.query;
	const [public_id, format] = path.join("/").split(".");

	const resource = await CloudinaryClient.getResource(public_id, {
		resource_type: "video" // audio and video files have this resource type in Cloudinary
	});
	console.log(`Download ${public_id}.${format}`, resource);
	const { success, error } = await proxyRequest(
		changeFileFormat(resource.secure_url, format),
		req,
		resp
	);

	if (!success) {
		throw new ApiError(500, error);
	}
};
