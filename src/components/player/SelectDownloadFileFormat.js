import { Box, Link } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { useState } from "react";

// @see https://cloudinary.com/documentation/audio_transformations#supported_audio_formats
export const AVAILABLE_AUDIO_FORMATS = ["wav", "mp3", "m4a", "ogg"];
// @see https://cloudinary.com/documentation/video_manipulation_and_delivery#supported_video_formats
export const AVAILABLE_VIDEO_FORMATS = ["mp4", "webm"];

/**
 * @typedef SelectDownloadFormat
 * @param {File} mediaFile
 * @property {Array<String>} availableFormats Available formats for download (lowercase)
 */

/**
 * Generate a link+selectbox to directly download a file in the required format
 * Or the whole playlist (multiple public_ids)
 * @param {SelectDownloadFormat} props
 */
const SelectDownloadFileFormat = ({
	mediaFile,
	availableFormats = AVAILABLE_AUDIO_FORMATS,
	children,
	...props
}) => {
	const [format, setFormat] = useState(availableFormats[0]);

	// Create the download URL and proposed filename
	let downloadUrl, downloadAs;

	if (mediaFile) {
		downloadUrl =
			"/download/" + mediaFile.url.split("upload/")[1].replace(/\.\w+$/i, "");
		downloadAs = mediaFile.artist
			? `${mediaFile.artist} - ${mediaFile.title}.${format}`
			: mediaFile.filename.replace(/\.\w+$/i, "." + format);
	} else {
		return null;
	}

	return (
		<Box onClick={(evt) => evt.stopPropagation()} w="100%" h="100%">
			<Link href={`${downloadUrl}.${format}`} download={downloadAs}>
				{children || "Télécharger"}
			</Link>
			&nbsp;
			<Select width="5rem" size="sm" display="inline-block" {...props}>
				{availableFormats.map((format) => (
					<option key={format} onClick={() => setFormat(format)}>
						{format.toUpperCase()}
					</option>
				))}
			</Select>
		</Box>
	);
};
export default SelectDownloadFileFormat;
