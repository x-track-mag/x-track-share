import MailService from "@sendgrid/mail";
import ApiError from "../ApiError";

/**
 * Send a mail report about a download,
 * using the data provided by the download form
 * @param {SendgridMessage} msg
 */
export const sendMail = async (msg) => {
	try {
		const { SENDGRID_API_KEY } = process.env;

		if (!SENDGRID_API_KEY) {
			throw new ApiError(
				500,
				"Missing environment variables for Sendgrid client initialization"
			);
		}

		["to", "cc", "bcc"].forEach((key) => {
			if (typeof msg[key] === "string") {
				msg[key] = msg[key].split(",");
			}
		});

		MailService.setApiKey(SENDGRID_API_KEY);

		// Note : we receive an array of ClientResponse
		const [{ statusCode }] = await MailService.send(msg);

		return {
			success: true,
			statusCode
		};
	} catch (err) {
		throw new ApiError(
			500,
			`Error sending message ${JSON.stringify(msg, null, "\t")} : ${err.message}`
		);
	}
};
