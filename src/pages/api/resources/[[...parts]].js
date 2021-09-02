import { NextApiRequest, NextApiResponse } from "next";
import CloudinaryClient from "../../../lib/services/CloudinaryClient.js";

/**
 * GET a resource by its public_id
 * DELETE a resource
 * @param {NextApiRequest} req
 * @param {NextApiResponse} resp
 */
export default async (req, resp) => {
	const { parts = [""] } = req.query; // parts gives the public_id of a resource
	const public_id = parts.join("/");
	const method = req.method;
	let msg;
	try {
		switch (method) {
			case "GET":
				msg = await CloudinaryClient.getResource(`share/${public_id}`);
				break;

			case "DELETE":
				msg = CloudinaryClient.deleteResource(public_id);

			default:
				break;
		}
		resp.json({
			success: true,
			resource: public_id,
			...msg
		});
	} catch (err) {
		resp.status(err.code || 500).json({
			success: false,
			resource: public_id,
			error: err.message
		});
	}
};
