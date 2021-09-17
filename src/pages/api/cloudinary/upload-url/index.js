import CloudinaryClient from "../../../../lib/services/CloudinaryClient";
import { serializeError } from "../../../../lib/utils/http";

/**
 * Return the Cloudinary upload URL and API signature
 * Note : using this API should require authentication
 * @param {NextApiRequest} req
 * @param {NextApiResponse} resp
 */
export default async (req, resp) => {
	try {
		const { file, ...params } = req.body;
		const resource_type = CloudinaryClient.getResourceType(file);
		const signature = CloudinaryClient.signRequest(params);
		resp.json({
			signature,
			uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resource_type}/upload`
		});
	} catch (err) {
		return serializeError(err, req, resp);
	}
};
