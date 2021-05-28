import { Box, Link } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { useState } from "react";

// @see https://cloudinary.com/documentation/audio_transformations#supported_audio_formats
const _MUSIC_FORMAT_OPTIONS = ["wav", "mp3", "m4a", "ogg"];

const SelectDownloadFormat = ({
	path,
	filename,
	formatsOptions = _MUSIC_FORMAT_OPTIONS,
	...props
}) => {
	const [format, setFormat] = useState(formatsOptions[0]);

	return (
		<Box onClick={(evt) => evt.stopPropagation()} w="100%" h="100%">
			<Link
				href={`/api/download/${path}.${format}`}
				download={`${filename}.${format}`}
			>
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
