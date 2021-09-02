import { v2 as cloudinary } from "cloudinary";
import { loadEnv } from "../utils/Env.js";
import SharedFolder from "../cloudinary/SharedFolder.js";
import ApiError from "../ApiError.js";
import { getFontDefinitionFromManifest } from "next/dist/next-server/server/font-utils";

if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
	loadEnv();
}

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

export const getResource = async (resource_id) => {
	try {
		return await cloudinary.api.resource(resource_id);
	} catch (err) {
		console.error(err);
		return undefined;
	}
};

export const getResourceInfos = ({
	public_id,
	filename,
	folder,
	format,
	duration,
	secure_url
}) => {
	return {
		public_id,
		folder,
		sharedFolder: folder.replace(/^share\//, ""), // remove the 'share/' from the folder path
		format,
		duration,
		url: secure_url.replace(`.${format}`, ""), // remove the extension
		...extractTrackInfos(filename)
	};
};

const getResourceType = (format) => {
	if (format.indexOf(".") > 0) {
		// It may be the file name
		format = format.split(".").pop().toLowerCase();
	}

	// Note : the switch order is defined by our most common use cases
	switch (format) {
		case "mp3":
		case "wav":
		case "mp4":
		case "mov":
		case "mpeg":
		case "webm":
		case "aac":
		case "ogg":
			return "video";

		case "jpg":
		case "png":
		case "svg":
		case "webp":
			return "image";

		default:
			return "raw";
	}
};

/**
 * Extract $artist - $title from a track filename
 * @param {String} filename
 * @returns {Object}
 */
export const extractTrackInfos = (filename) => {
	// Cloudinary alter filenames to replace spaces and add a silly unique signature at the end
	// Lest's remove them
	if (filename.indexOf("/") > 0) {
		// It's a full path : keep only the filename
		filename = filename.split("/").pop();
	}
	filename = filename
		.replace(/\_[a-z0-9]{6}$/, "") // Remove the random sequence _jhj7yg at the end of the file names
		.replace(/\_/gi, " "); // Restore the spaces between words

	if (filename.indexOf(" - ") > 0) {
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
 * Upload a single local file to a folder in Cloudinary
 * @param {String} destPath
 * @param {String} localPath Path to the local file where the file can be readen
 * @returns
 */
export const uploadToPath = async (destPath, localPath) => {
	const uploadOptions = {
		overwrite: true,
		public_id: destPath.replace(/\.(\w)+$/i, ""), // remove extension from path
		resource_type: getResourceType(localPath)
	};
	return new Promise((resolve, reject) => {
		cloudinary.uploader.upload(localPath, uploadOptions, (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
};

export const deleteResource = async (public_id) => {
	try {
		console.log("Cloudinary delete resource", public_id);
		// If we don't know the resource type, try them all..
		const deletions = await Promise.allSettled([
			cloudinary.api.delete_resources([public_id], {
				all: true,
				resource_type: "video"
			}),
			cloudinary.api.delete_resources([public_id], {
				all: true,
				resource_type: "image"
			}),
			cloudinary.api.delete_resources([public_id], {
				all: true,
				resource_type: "raw"
			})
		]);
		// The deletion count total should be 1
		const count = deletions.reduce((prev, deletion) => {
			return prev + deletion.value.deleted_counts;
		}, 0);

		return { success: count === 1, resource: public_id };
	} catch (err) {
		console.error(`Cloudinary resource deletion failed (${public_id}).`, err);
		return { success: false, error: err.message };
	}
};

export const deleteFolder = async (folderPath) => {
	try {
		const { folders } = await getDeepContent(folderPath);

		// We must delete all recursive content first
		console.log(`Deleting all resources inside share/${folderPath}`);
		// const public_ids = Object.keys(folders)
		// 	.map((p) => folders[p].getAllMediaIds())
		// 	.flat();

		// But we have to delete separately all different types of resources !
		const deletions = await Promise.allSettled([
			cloudinary.api.delete_resources_by_prefix(`share/${folderPath}`, {
				all: true,
				resource_type: "video"
			}),
			cloudinary.api.delete_resources_by_prefix(`share/${folderPath}`, {
				all: true,
				resource_type: "image"
			}),
			cloudinary.api.delete_resources_by_prefix(`share/${folderPath}`, {
				all: true,
				resource_type: "raw"
			})
		]);

		console.log("Deletions result", deletions);

		const deepFoldersList = Object.keys(folders).sort((a, b) => (a > b ? -1 : 1));
		console.log("Deleting folders", deepFoldersList);

		return {
			success: deepFoldersList.reduce(async (success, folderPath) => {
				try {
					await cloudinary.api.delete_folder(`share/${folderPath}`);
					return success;
				} catch (err) {
					return false;
				}
			}, true)
		};
	} catch (err) {
		console.error(`Cloudinary folder deletion failed (${folderPath}).`, err);
		throw new ApiError(500, err.message);
	}
};

/**
 * Return the immediate content of a folder
 * @param {String} root
 */
export const getFlatContent = async (folderPath) => {
	try {
		const [{ resources }, { folders }] = await Promise.all([
			cloudinary.search
				.expression(`folder=${folderPath}`)
				.sort_by("public_id", "desc")
				.max_results(500)
				.execute(),
			cloudinary.api.sub_folders(folderPath)
		]);

		return {
			subfolders: folders.map(({ name, path }) => ({
				name,
				path: path.replace("share/", "") // the share/ common root is allways obfuscated
			})),
			playlist: resources.map(getResourceInfos)
		};
	} catch (err) {
		console.error(err);
		throw new ApiError(500, err.message);
	}
};

/**
 * Return the full list of subfolders and content inside the given root
 * @see cloudinary-search-results.json to see what the results look like
 * @param {String} root
 */
export const getDeepContent = async (root) => {
	try {
		let { resources } = await cloudinary.search
			.expression(`folder=share/${root}/*`)
			.sort_by("public_id", "desc")
			.max_results(500)
			.execute();

		// Keep only the minimal fields information
		console.log(
			`getDeepContent(share/${root}/*)`,
			resources.map((rsc) => rsc.public_id)
		);
		resources = resources.map(
			({ public_id, filename, folder, format, duration, secure_url }) => ({
				public_id,
				folder: folder.substr(6), // remove the 'share/' from the folder path
				format,
				duration,
				url: secure_url.replace(/\.\w+$/, ""),
				...extractTrackInfos(filename)
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
	deleteFolder,
	deleteResource,
	getDeepContent,
	getFlatContent,
	getResource,
	getZipDownloadUrl,
	uploadToPath
};

export default CloudinaryClient;
