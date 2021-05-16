import { v2 as cloudinary } from "cloudinary";
import { loadEnv } from "../utils/Env.js";
import CloudinaryFolder from "../cloudinary/CloudinaryFolder.js";
import ApiError from "../ApiError.js";

if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
	loadEnv();
}

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
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
		let { resources } = await cloudinary.search
			.expression(`folder=share/${root}/*`)
			.sort_by("public_id", "desc")
			.max_results(500)
			.execute();

		console.log(resources);

		// Keep only the minimal fields information
		resources = resources.map(
			({ asset_id, filename, folder, format, duration, secure_url }) => ({
				asset_id,
				filename,
				folder: folder.substr(6), // remove the 'share/' from the folder path
				format,
				duration,
				url: secure_url
			})
		);

		// Keep track of all the folders and sub-folders
		const folders = {};
		folders[root] = new CloudinaryFolder(root); // the root

		resources.forEach((rsc) => {
			let folder = folders[rsc.folder];
			if (!folder) {
				// Not yet known to us
				folder = folders[rsc.folder] = new CloudinaryFolder(rsc.folder);
				const parent = folder.getParentFolder();
				folders[parent]?.subfolders.push(rsc.folder);
			}

			folder.addMedia(rsc);
		});

		// console.log(`Loaded shared folders`, folders);
		return folders;
	} catch (err) {
		console.error(err);
		throw new ApiError(500, err.message);
	}
};

const CloudinaryClient = {
	getContent
};

export default CloudinaryClient;
