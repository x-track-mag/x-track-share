import formidable from "formidable-serverless";
import fs from "fs-extra";
import { NextApiRequest, NextApiResponse } from "next";
import CloudinaryClient from "../../../lib/services/CloudinaryClient";
import extendStrings from "../../../lib/utils/Strings";
extendStrings();

/**
 * Convert all parts of the path in lowercase and URL-safe characters
 * @param {String} relativePath
 * @return {String}
 */
const normalizePath = (relativePath) => {
	const parts = relativePath.split("/");
	return parts.map((part) => part.slugify()).join("/") + "/";
};

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

		// Parse the file upload inside the multipart formdata
		// parse a file upload
		const form = new formidable.IncomingForm({
			keepExtensions: true
		});

		const uploadFile = new Promise((resolve, reject) => {
			form.on("file", async (name, file) => {
				const fileName = file.name.split("/").pop(); // Firefox send the full path instead of the file name
				console.log(
					`API Upload received file ${fileName} (${file.size}bytes) to store in ${sharedFolderPath} and saved it ${file.path}`
				);
				try {
					const uploaded = await CloudinaryClient.uploadToPath(
						normalizePath(sharedFolderPath) + fileName,
						file.path
					);
					resolve(uploaded);
				} catch (err) {
					console.error(`Error uploading ${file.name} to Cloudinary`, err);
					reject(err);
				} finally {
					// Delete our temporary file after upload
					fs.remove(file.path);
				}
			});
		});

		form.parse(req);

		const file = await uploadFile;
		return resp.json({
			success: true,
			filename: file.name,
			content: file.path
		});
	} catch (err) {
		console.error("/api/upload/[[...parts]]", err.message);
		return resp.status(err.code || 400).json({
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
