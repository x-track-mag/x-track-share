import { v2 as cloudinary } from "cloudinary";
import { loadEnv } from "../utils/Env.js";
import SharedFolder from "../cloudinary/SharedFolder.js";
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
 * Cloudinary alter filenames to replace spaces and add a silly unique signature at the end
 * We remove them
 * @param {String} filename
 * @returns String
 */
const fileNameExtras = (cloudinaryFileName) => {
	const filename = cloudinaryFileName
		.replace(/\_[a-z0-9]{6}$/, "") // Remove the random sequence _jhj7yg at the end of the file names
		.replace(/\_/gi, " ");

	if (filename.indexOf("-") > 0) {
		// We have a song title
		const [artist, song] = filename.split(" - ");
		console.log(`Found a song : ${artist} - ${song}`);
		return {
			artist,
			song
		};
	} else {
		return { filename };
	}
};

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

		// Keep only the minimal fields information
		resources = resources.map(
			({ public_id, filename, folder, format, duration, secure_url }) => ({
				public_id,
				folder: folder.substr(6), // remove the 'share/' from the folder path
				format,
				duration,
				url: secure_url.replace(/\.\w{3}$/, ""),
				...fileNameExtras(filename)
			})
		);

		const sharedOptions = {
			addToSelection: false,
			directDownload: true,
			displayDownloadForm: false
		};

		if (resources.find((rsc) => rsc.artist)) {
			// Songs are shared via a virtual playlist and a download form
			sharedOptions.addToSelection = true;
			sharedOptions.displayDownloadForm = true;
		}

		// Keep track of all the folders and sub-folders
		const folders = {};
		folders[root] = new SharedFolder(root); // the root

		resources.forEach((rsc) => {
			let folder = folders[rsc.folder];
			if (!folder) {
				// Not yet known to us
				folder = folders[rsc.folder] = new SharedFolder(rsc.folder);
				const parent = folder.getParentFolder();
				folders[parent]?.subfolders.push(rsc.folder);
			}

			folder.addMedia(rsc);
		});

		console.log(`Loaded shared folders`, folders);
		return { folders, sharedOptions };
	} catch (err) {
		console.error(err);
		throw new ApiError(500, err.message);
	}
};

export const getResource = cloudinary.api.resource;

/**
 * Return a calculated link to download a zip archive
 * containing the selected assets
 * @param {Array<String>} public_ids
 * @param {String} format to convert each asset
 * @returns {String}
 */
export const getZipDownloadUrl = (public_ids, format = "wav") => {
	try {
		// Add the request format to the end of the public_id
		// public_ids = public_ids.map((id) => `${id}.${format}`).join(",");
		const downloadUrl = cloudinary.utils.download_zip_url({
			public_ids,
			resource_type: "video",
			use_original_filename: true,
			target_public_id: `x-track-share-${new Date()
				.toISOString()
				.substr(0, 19)
				.replace(/[^0-9]/g, "-")}`,
			transformations: `f_${format}`
		});
		console.log(`Generate Zip download URL for ${JSON.stringify(
			public_ids
		)} in ${format} format :
${downloadUrl}`);
		return downloadUrl;
	} catch (err) {
		console.error(err);
		throw new ApiError(500, err.message);
	}
};

const CloudinaryClient = {
	getContent,
	getResource,
	getZipDownloadUrl
};

export default CloudinaryClient;
