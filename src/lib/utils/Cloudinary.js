export const getResourceType = (ext) => {
	if (ext.indexOf(".") > 0) {
		// It may be the file name
		ext = ext.split(".").pop().toLowerCase();
	}

	// Note : the switch order is defined by our most common use cases
	switch (ext) {
		case "mp3":
		case "wav":
		case "mp4":
		case "m4a":
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
 * @return {Object}
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
		const [artist, title] = filename.split(" - ");
		console.log(`Found a title : ${artist} - ${title}`);
		return {
			artist,
			title
		};
	} else {
		return { title: filename };
	}
};

/**
 * Take a file path from the local file system and create a friendly public_id (Cloudinary URL)
 * @param {String} filePath
 * @return {String}
 */
export const createPublicId = (filePath) => {
	const dirParts = filePath.split("/").filter((dir) => Boolean(dir));
	let fileName = dirParts.pop();

	if (getResourceType(fileName) !== "raw") {
		fileName = fileName.replace(/\.\w+$/gi, ""); // get rid of the extension for the media formats (we swap them easily)
	}
	fileName = fileName.replace(/[^\wàéèôê\- ]/gi, "_"); // get rid of strange letters

	return dirParts.map((dir) => dir.slugify()).join("/") + "/" + fileName;
};

/**
 * @return {ResourceDef}
 */
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
		filename: filename + "." + format,
		sharedFolder: folder.replace(/^share\//, ""), // remove the 'share/' from the folder path
		format,
		duration,
		url: secure_url, // remove the extension
		...extractTrackInfos(filename)
	};
};
