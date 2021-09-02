import { NextApiRequest, NextApiResponse } from "next";
import CloudinaryClient from "../../../lib/services/CloudinaryClient.js";

/**
 * GET the flat content of a shared folder
 * DELETE a folder
 * @param {NextApiRequest} req
 * @param {NextApiResponse} resp
 */
export default async (req, resp) => {
	const { parts = [""] } = req.query; // parts give the path to a shared folder
	const path = parts.join("/");
	const method = req.method;
	let msg;
	try {
		switch (method) {
			case "GET":
				msg = await CloudinaryClient.getFlatContent(`share/${path}`);
				break;

			case "DELETE":
				msg = await CloudinaryClient.deleteFolder(path);

			default:
				break;
		}
		resp.json({
			success: true,
			path,
			...msg
		});
	} catch (err) {
		resp.status(err.code || 500).json({
			success: false,
			path,
			subfolders: [],
			playlist: [],
			error: err.message
		});
	}
};
