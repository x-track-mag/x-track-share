import { Flex } from "@chakra-ui/layout";
import { AspectRatio } from "@cloudinary/base/qualifiers/aspectRatio";

/**
 * An entry inside the playlist, representing an audio or video asset to play
 * @param {PlaylistEntryProps} props
 * @returns
 */
const PlaylistEntry = ({ filename, format, url, asset_id }) => (
	<Flex bg="black" m="0" as="li" key={asset_id} alignItems="center">
		<AspectRatio ratio={1}>
			<PlayPauseIcon />
		</AspectRatio>
		{filename}
	</Flex>
);

export default PlaylistEntry;
