import { Box } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { useState } from "react";

/**
 * Generate a link+selectbox to directly download a file in the required format
 * Or the whole playlist (multiple public_ids)
 * @param {SelectDownloadFormat} props
 */
const SelectDownloadArchiveFormat = ({
	download_archive_links,
	playlist_name = "playlist-" + new Date().toISOString().substr(0, 19),
	children,
	...props
}) => {
	const availableFormats = Object.keys(download_archive_links) || [];
	const [format, setFormat] = useState(availableFormats[0] || "wav");
	if (!download_archive_links) return null;

	return (
		<Box w="100%" h="100%" pt={4} textAlign="right">
			<a
				target="_blank"
				href={download_archive_links[format]}
				download={playlist_name}
			>
				{children || "Download Archive (zip)"}
			</a>
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
export default SelectDownloadArchiveFormat;
