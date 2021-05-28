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
 * @see https://github.com/stegano/next-http-proxy-middleware/issues/25
 * @param {NextApiRequest} req
 * @param {NextApiResponse} resp
 */
export default async (req, resp) => {
	const { path } = req.query;
	const [public_id, format] = path.join("/").split(".");

	const resource = await CloudinaryClient.getResource(public_id, {
		resource_type: "video" // audio and video files have this resource type in Cloudinary
	});
	const cloudinaryDownloadUrl = changeFileFormat(resource.secure_url, format);
	console.log(`Download ${public_id}.${format}`, resource);

	return proxyRequest(cloudinaryDownloadUrl, req, resp).catch((err) => {
		console.error(err);
		resp.setHeader("Content-Type", "text/plain").status(500).end(err);
	});

	try {
		if (!success) {
			console.error(`Download of ${cloudinaryDownloadUrl} failed`, error);
		}
	} catch (err) {}
};
