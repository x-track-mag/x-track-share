import { Box, Link } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { useState } from "react";

// @see https://cloudinary.com/documentation/audio_transformations#supported_audio_formats
const _MUSIC_FORMAT_OPTIONS = ["wav", "mp3", "m4a", "ogg"];

const SelectDownloadFormat = ({
	file,
	formatsOptions = _MUSIC_FORMAT_OPTIONS,
	...props
}) => {
	const [format, setFormat] = useState(formatsOptions[0]);
	// Create the download URL (without the format)
	const rawPath = "/download/" + file.url.split("upload/")[1].replace(/\.\w+$/i, "");
	const niceFileName = file.artist
		? `${file.artist} - ${file.title}.${format}`
		: file.filename.replace(/\.\w+$/i, format);

	return (
		<Box onClick={(evt) => evt.stopPropagation()} w="100%" h="100%">
			<Link href={`${rawPath}.${format}`} download={niceFileName}>
				Télécharger
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
export default SelectDownloadFormat;
