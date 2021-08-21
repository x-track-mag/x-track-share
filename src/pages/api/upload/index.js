import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";

const fileUploader = multer({
	storage: multer.memoryStorage()
});

const upload = nextConnect({
	// Handle any other HTTP method
	onNoMatch(req, res) {
		res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
	}
});

upload.use(fileUploader.single("file"));

/**
 * Generate a download URL for a zipped archive
 * containing the required files
 * @param {NextApiRequest} req
 * @param {NextApiResponse} resp
 */
upload.post(async (req, resp) => {
	try {
		const file = req.file;
		console.log(`/api/upload received file ${file.originalname} (${file.size}bytes)`);

		return resp.json({
			success: true,
			filename: file.originalname,
			content: file.buffer.toString("base64")
		});
	} catch (err) {
		console.error(JSON.stringify(err, null, "\t"));
		return resp.status(err.code || 500).json({
			success: false,
			error: err.message,
			...err.body
		});
	}
});

export default upload;

export const config = {
	api: {
		bodyParser: false // Disallow body parsing, consume as stream
	}
};
