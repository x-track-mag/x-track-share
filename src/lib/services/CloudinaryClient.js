// import { Cloudinary } from "@cloudinary/base";
// import APIClient from "./APIClient";
import { v2 as cloudinary } from "cloudinary";
import { loadEnv } from "../utils/Env.js";

if (!process.env.CLOUDINARY_CLOUD_NAME) {
	loadEnv();
}

// let clientInstance;

// export const getInstance = () => {
// 	if (!clientInstance) {
// 		clientInstance = new Cloudinary({
// 			cloud: { cloudName: process.env.CLOUDINARY_CLOUD_NAME }
// 		});
// 	}

// 	return clientInstance;
// };

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Return the list of subfolders and content inside a root folder
 * @param {String} root
 */
export const getContent = async (root) => {
	try {
		const results = await cloudinary.search
			.expression(`folder=${root}/*`)
			.max_results(500)
			.execute();
		console.log(
			`CloudinaryClient.getContent("${root}")`,
			JSON.stringify(results, null, "\t")
		);
		return results;
	} catch (err) {
		console.error(err);
	}
};

const CloudinaryClient = {
	getContent
};

export default CloudinaryClient;
