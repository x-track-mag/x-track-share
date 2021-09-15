import { Box, Link } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { useState } from "react";

// @see https://cloudinary.com/documentation/audio_transformations#supported_audio_formats
const _MUSIC_FORMAT_OPTIONS = ["wav", "mp3", "m4a", "ogg"];

/**
 * Generate a link+selectbox to directly download a file in the required format
 * Or the whole playlist (multiple public_ids)
 * @param {SelectDownloadFormat} props
 */
const SelectDownloadFileFormat = ({
	file,
	formatsOptions = _MUSIC_FORMAT_OPTIONS,
	children,
	...props
}) => {
	const [format, setFormat] = useState(formatsOptions[0]);

	// Create the download URL and proposed filename
	let downloadUrl, downloadAs;

	if (file) {
		downloadUrl = "/download/" + file.url.split("upload/")[1].replace(/\.\w+$/i, "");
		downloadAs = file.artist
			? `${file.artist} - ${file.title}.${format}`
			: file.filename.replace(/\.\w+$/i, format);
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
				{formatsOptions.map((format) => (
					<option key={format} onClick={() => setFormat(format)}>
						{format.toUpperCase()}
					</option>
				))}
			</Select>
		</Box>
	);
};
export default SelectDownloadFileFormat;
