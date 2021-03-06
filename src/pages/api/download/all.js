import { NextApiRequest, NextApiResponse } from "next";
import APIClient from "../../../lib/services/APIClient.js";
import CloudinaryClient from "../../../lib/services/CloudinaryClient.js";
import withCORS from "../../../lib/services/withCORS.js";
import { serializeError } from "../../../lib/utils/http.js";

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

		// These fields are not mandatory
		if (fullName || email || message) {
			// We have a message ! Send a report
			await APIClient.post("/api/mailreport", req.body);
		}

		return resp.json({
			success: true,
			downloadUrl: CloudinaryClient.getZipDownloadUrl(public_ids, format)
		});
	} catch (err) {
		serializeError(err, req, resp);
	}
};

export default withCORS(downloadAll);
