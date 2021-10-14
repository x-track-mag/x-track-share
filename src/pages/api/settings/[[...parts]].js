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
				const { settings, recursive = false } = req.body;

				if (!settings) {
					// That's wrong really
					return resp.json({
						success: false,
						error: "Bad Parameters. You must provide a settings object."
					});
				}

				console.log(`Updating settings for ${sharedFolderPath}`, settings);

				const updateFolderSettings = async (folder) =>
					CloudinaryClient.uploadData(
						folder + "/settings.json",
						JSON.stringify({ settings })
					);

				let uploadSuccess = await updateFolderSettings(sharedFolderPath);

				if (recursive) {
					// Now we should apply these settings to all sub-folders !
					const subfolders = await CloudinaryClient.getSubFolders(
						sharedFolderPath
					);
					const updated = await Promise.allSettled(
						subfolders.map(updateFolderSettings)
					);
				}

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
