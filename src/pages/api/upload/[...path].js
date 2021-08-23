import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable-serverless";
import CloudinaryClient from "../../../lib/services/CloudinaryClient";

/**
 * Generate a download URL for a zipped archive
 * containing the required files
 * @param {NextApiRequest} req
 * @param {NextApiResponse} resp
 */
export default async (req, resp) => {
	try {
		const { path } = req.query; // path is an array

		// Parse the file upload inside the multipart formdata
		// parse a file upload
		const form = new formidable.IncomingForm();

		const uploadSuccess = new Promise((resolve, reject) => {
			form.on("file", async (name, file) => {
				console.log(
					`/api/upload received file ${file.name} (${file.size}bytes) and saved it ${file.path}`
				);
				try {
					const uploaded = await CloudinaryClient.uploadToPath(
						file.name,
						file.path
					);
					resolve(uploaded);
				} catch (err) {
					console.error(`Error uploading ${file.name} to Cloudinary`, err);
					reject(err);
				}
			});
		});

		form.parse(req);

		const file = await uploadSuccess;
		return resp.json({
			success: true,
			filename: file.name,
			content: file.path
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

export const config = {
	api: {
		bodyParser: false // Disallow body parsing, consume as stream
	}
};
