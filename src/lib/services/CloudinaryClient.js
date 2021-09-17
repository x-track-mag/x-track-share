/**
 * CLOUDINARY CLIENT UTILS
 * NOTE : SOME OF THESE METHODS CAN BE USED BOTH ON THE CLIENT (REACT) AND SERVER (API METHODS)
 * WHILE SOME OTHERS CAN ONLY BE USED ON THE SERVER SIDE
 * TO PRESERVE THE API SECRETS AND CLOUDINARY CREDENTIALS
 */
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import ApiError from "../ApiError.js";
import SharedFolder, { DOWNLOAD_AUDIO_FORMATS } from "../cloudinary/SharedFolder.js";
import { extractTrackInfos, getResourceInfos } from "../utils/Cloudinary.js";
import { merge } from "../utils/deepMerge.js";
import { loadEnv } from "../utils/Env.js";
import APIClient from "./APIClient.js";

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

/**
 * Browser request needs to be signed
 * @see
 * @param {Object} params
 * @returns Object {signature, api_key}
 */
export const signRequest = (params) => {
	return cloudinary.utils.sign_request(params);
};

/**
 * Some resource like settings.json and playlist.m3u have text content that we must parse
 * @param {*} rsc
 * @returns {Promise<String>}
 */
export const getRawResourceContent = async (rsc) => {
	if (rsc.filename === "settings.json") {
		console.log("Reading settings.json");
		return await APIClient.get(rsc.url); // { "settings": {...} }
	} else if (rsc.filename === "playlist.m3u") {
		console.log("Reading playlist.m3u");
		const playListContent = await APIClient.getText(rsc.url);
		return {
			settings: {
				playlist: playListContent.split("\n")
			}
		};
	} else {
		return {};
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
				.sort_by("public_id", "desc") // To ensure that we read settings.json BEFORE playlist.m3u
				.max_results(500)
				.execute(),
			cloudinary.api.sub_folders(folderPath)
		]);

		// Extract the special resources : settings.json and playlist.m3u if they exist
		const { settings, tracks } = await resources.reduce(
			async (folderPromise, file) => {
				const folder = await folderPromise;
				const rscType = file.resource_type;

				if (rscType === "video") {
					folder.tracks.push(getResourceInfos(file));
				} else if (rscType === "raw") {
					const { settings } = await getRawResourceContent(file);
					if (file.filename === "settings.json") {
						console.log("Merging settings.json ");
						merge(folder, { settings });
					} else if (!folder.settings) {
						console.log("Merging playlist.m3u");
						merge(folder, { settings });
					}
				}
				return folder;
			},
			{
				tracks: [],
				settings: {}
			}
		);

		return {
			subfolders: folders.map(({ name, path }) => ({
				name,
				path: path.replace("share/", "") // the share/ common root is allways obfuscated
			})),
			settings,
			tracks
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
			.sort_by("public_id", "asc")
			.max_results(500)
			.execute();

		// Keep only the minimal fields information
		console.log(
			`getDeepContent(share/${root}/*)`,
			resources.map((rsc) => rsc.public_id)
		);
		resources = resources.map(
			({
				public_id,
				filename,
				resource_type,
				folder,
				format,
				duration,
				secure_url
			}) => ({
				public_id,
				filename: resource_type !== "raw" ? filename + "." + format : filename, // raw resources have preserved their extension
				folder: folder.substr(6), // remove the 'share/' from the folder path
				format,
				type: resource_type,
				duration,
				url: secure_url,
				...extractTrackInfos(filename)
			})
		);

		// Keep track of all the folders and sub-folders
		const folders = {};
		folders[root] = new SharedFolder(root); // the root

		const updateFolders = async (rsc) => {
			let folder = folders[rsc.folder];

			if (!folder) {
				// Not yet known to us
				folder = folders[rsc.folder] = new SharedFolder(rsc.folder);
				const parent = folder.getParentFolder();
				folders[parent]?.subfolders.push(rsc.folder);
			}

			folder.addResource(rsc);

			// Load special resources content (settings.json and playlist.m3u)
			if (rsc.type === "raw") {
				const specialContent = await getRawResourceContent(rsc);
				merge(folder, specialContent);
			}

			return true;
		};

		await Promise.allSettled(resources.map(updateFolders));

		// Now we need to prepare the download_archive links
		Object.keys(folders).map((folderPath) => {
			const folder = folders[folderPath];
			const { audios, videos, settings } = folder;
			if (settings.download_zip) {
				// We have to prepare the download links for all the public_ids
				if (audios.length > 0) {
					folder.download_audio_links = DOWNLOAD_AUDIO_FORMATS.reduce(
						(links, format) => {
							links[format] = getZipDownloadUrl(
								audios.map((audio) => audio.public_id),
								format
							);
							return links;
						},
						{}
					);
				}
			}
		});

		console.log(`Loaded shared folders`, folders);
		return { folders };
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
export const getZipDownloadUrl = (public_ids, format = "wav", download_as) => {
	try {
		// Add the request format to the end of the public_id
		// public_ids = public_ids.map((id) => `${id}.${format}`).join(",");
		const downloadUrl = cloudinary.utils.download_zip_url({
			public_ids,
			resource_type: "video",
			use_original_filename: true,
			target_public_id:
				download_as ||
				`x-track-share-${new Date()
					.toISOString()
					.substr(0, 19)
					.replace(/[^0-9]/g, "-")}`,
			transformations: `f_${format}`
		});
		return downloadUrl;
	} catch (err) {
		console.error(err);
		throw new ApiError(500, err.message);
	}
};

/**
 * Upload a single local file to a folder in Cloudinary
 * @param {String} destPath
 * @param {String} localPath Path to the local file where the file can be readen
 * @returns
 */
export const uploadToPath = async (destPath, localPath) => {
	return cloudinary.uploader
		.upload(localPath, {
			overwrite: true,
			public_id: destPath.replace(/\.(\w)+$/i, ""), // remove extension from path. don't slugify the filename through
			resource_type: getResourceType(localPath)
		})
		.catch((err) => {
			throw new ApiError(400, err.message);
		});
};

/**
 * Upload a piece of text content inside a file in Cloudinary
 * @param {String} destPath The destination path (URL)
 * @param {String} textData Content of a file in text format (TXT, JSON, Markdown, ...)
 */
export const uploadData = async (destPath, textData) => {
	const uploadOptions = {
		overwrite: true,
		public_id: destPath, // Don't allow Cloudinary to do 'smart' things on the public_id
		resource_type: "raw"
	};

	const textStream = Readable.from([textData]);

	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			uploadOptions,
			(err, result) => {
				if (err) {
					console.error(err);
					reject(err);
				} else {
					resolve(result);
				}
			}
		);
		textStream.pipe(uploadStream);
	});
};

export const deleteResource = async (public_id) => {
	try {
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

const CloudinaryClient = {
	deleteFolder,
	deleteResource,
	getDeepContent,
	getFlatContent,
	getResource,
	getZipDownloadUrl,
	signRequest,
	uploadData,
	uploadToPath
};

export default CloudinaryClient;
