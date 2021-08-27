import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable-serverless";
import StringExtensions from "../../../lib/utils/Strings";
import CloudinaryClient from "../../../lib/services/CloudinaryClient";
import fs from "fs-extra";

/**
 * Convert all parts of the path in lowercase
 * @param {String} relativePath
 * @returns
 */
const normalizePath = (relativePath) => {
	const parts = relativePath.split("/");
	const fileName = parts.pop();
	return parts.map((part) => part.slugify()).join("/") + "/" + fileName;
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
		const form = new formidable.IncomingForm();

		const uploadSuccess = new Promise((resolve, reject) => {
			form.on("file", async (name, file) => {
				console.log(
					`API Upload received file ${file.name} (${file.size}bytes) to store in ${sharedFolderPath} and saved it ${file.path}`
				);
				try {
					const uploaded = await CloudinaryClient.uploadToPath(
						sharedFolderPath + "/" + normalizePath(file.name),
						file.path
					);
					resolve(uploaded);
				} catch (err) {
					console.error(`Error uploading ${file.name} to Cloudinary`, err);
					reject(err);
				} finally {
					// Delete our temporary file after upload
					fs.rm(file.path);
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
