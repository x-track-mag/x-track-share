import { NextApiRequest, NextApiResponse } from "next";
import StringExtensions from "../../../lib/utils/Strings";
import CloudinaryClient from "../../../lib/services/CloudinaryClient";
import fs from "fs-extra";

/**
 * Generate a download URL for a zipped archive
 * containing the required files
 * @param {NextApiRequest} req
 * @param {NextApiResponse} resp
 */
export default async (req, resp) => {
	try {
		const { parts = [""] } = req.query; // parts is an array
		const sharedFolderPath = `share/${parts.join("/")}`;

		// Parse the settings passed inside the JSON body
		const { settings } = req.body;

		const uploadSuccess = await CloudinaryClient.uploadData(
			sharedFolderPath + "/settings.json",
			JSON.stringify({ settings })
		);

		return resp.json({
			success: true,
			...uploadSuccess
		});
	} catch (err) {
		console.error(JSON.stringify(err, null, "\t"));
		return resp.status(err.code || 500).json({
			success: false,
			error: err.message,
			...err.body
		});
	}
};
