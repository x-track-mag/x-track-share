import { NextApiRequest, NextApiResponse } from "next";
import CloudinaryClient from "../../../lib/services/CloudinaryClient";

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

		switch (req.method) {
			case "GET":
				const body = await CloudinaryClient.getResourceContent(
					sharedFolderPath + "/settings.json"
				);

			case "POST":
				// Parse the settings passed inside the JSON body
				const { settings } = req.body;
				console.log(`Updating settings for ${sharedFolderPath}`, settings);

				const uploadSuccess = await CloudinaryClient.uploadData(
					sharedFolderPath + "/settings.json",
					JSON.stringify({ settings })
				);

				return resp.json({
					success: true,
					...uploadSuccess
				});

			default:
				return null;
		}
	} catch (err) {
		console.error(JSON.stringify(err, null, "\t"));
		return resp.status(err.code || 500).json({
			success: false,
			error: err.message,
			...err.body
		});
	}
};
