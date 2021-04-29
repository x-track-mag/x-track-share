import { Box } from "@chakra-ui/layout";

/**
 * An entry inside the playlist, representing an audio or video asset to play
 * @param {PlaylistEntryProps} props
 * @returns
 */
const PlaylistEntry = ({ title, format, url, asset_id }) => (
	<Box bg="black" m="0" p="1rem" as="li" key={asset_id}>
		{title}
	</Box>
);

export default PlaylistEntry;
