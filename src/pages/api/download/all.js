import { NextApiRequest, NextApiResponse } from "next";
import APIClient from "../../../lib/services/APIClient.js";
import CloudinaryClient from "../../../lib/services/CloudinaryClient.js";
import withCORS from "../../../lib/services/withCORS.js";

/**
 * Generate a download URL for a zipped archive
 * containing the required files
 * @param {NextApiRequest} req
 * @param {NextApiResponse} resp
 */
const downloadAll = async (req, resp) => {
	try {
		console.log("/api/download/all", req.body);
		const { public_ids, format, fullName, email, message } = req.body;

		if (fullName || email || message) {
			// These fields are not mandatory
			APIClient.post("/api/mailreport", req.body); // don't wait for the answer
		}

		return resp.json({
			success: true,
			downloadUrl: CloudinaryClient.getZipDownloadUrl(public_ids, format)
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

export default withCORS(downloadAll);
