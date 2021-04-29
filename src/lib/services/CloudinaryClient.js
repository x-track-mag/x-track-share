import { v2 as cloudinary } from "cloudinary";
import { loadEnv } from "../utils/Env.js";
import CloudinaryFolder from "../cloudinary/CloudinaryFolder.js";

if (!process.env.CLOUDINARY_CLOUD_NAME) {
	loadEnv();
}

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Return the list of subfolders and content inside a root folder
 * @see cloudinary-search-results.json to see what the results look like
 * @param {String} root
 */
export const getContent = async (root) => {
	try {
		const rLength = root.length + 1;
		let { resources } = await cloudinary.search
			.expression(`folder=${root}/*`)
			.sort_by("public_id", "desc")
			.max_results(500)
			.execute();

		// Keep only the minimal fields information
		resources = resources.map(({ asset_id, folder, format, secure_url }) => ({
			asset_id,
			folder: folder.substr(rLength), // remove the 'root/' from the folder path
			format,
			url: secure_url
		}));

		const rootFolder = new CloudinaryFolder(root);

		resources.forEach((rsc) => {
			const folder = rootFolder.getFolder(rsc.folder, true);
			folder.addMedia(rsc);
		});

		console.log(`Populated root folder`, JSON.stringify(rootFolder, null, "\t"));
		return rootFolder;
	} catch (err) {
		console.error(err);
	}
};

const CloudinaryClient = {
	getContent
};

export default CloudinaryClient;
