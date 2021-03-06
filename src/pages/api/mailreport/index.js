import MailService from "@sendgrid/mail";
import { NextApiRequest, NextApiResponse } from "next";
import withCORS from "../../../lib/services/withCORS.js";
import { extractTrackInfos } from "../../../lib/utils/Cloudinary.js";

const enhanceData = (data) => {
	data.tracks = data.public_ids.map(extractTrackInfos);
	return data;
};

/**
 * Send a mail report about a download,
 * using the data provided by the download form
 * @param {NextApiRequest} req
 * @param {NextApiResponse} resp
 */
const mailReport = async (req, resp) => {
	try {
		const {
			SENDGRID_API_KEY,
			SENDGRID_REPORT_FROM,
			SENDGRID_REPORT_TO,
			SENDGRID_REPORT_BCC = "",
			SENDGRID_REPORT_TEMPLATE_ID
		} = process.env;

		if (!SENDGRID_API_KEY || !SENDGRID_REPORT_TO || !SENDGRID_REPORT_TEMPLATE_ID) {
			console.error(
				"Missing environment variables for Sendgrid client initialization"
			);
			return resp.status(500).json({
				success: false,
				error: "Missing environment variables for Sendgrid client initialization"
			});
		}

		MailService.setApiKey(SENDGRID_API_KEY);

		const msg = {
			from: SENDGRID_REPORT_FROM,
			to: SENDGRID_REPORT_TO.split(","),
			bcc: SENDGRID_REPORT_BCC.split(","),
			templateId: SENDGRID_REPORT_TEMPLATE_ID,

			dynamicTemplateData: enhanceData(req.body)
		};

		console.log(`Sending mail report`, msg);

		// Note : we receive an array of ClientResponse
		const [{ statusCode }] = await MailService.send(msg);

		return resp.status(statusCode).json({
			success: true,
			message: "Message sent"
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

export default withCORS(mailReport);
