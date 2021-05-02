import { Box } from "@chakra-ui/layout";
import { useEventBus } from "../EventBusProvider.js";
import clsx from "clsx";

/**
 * An entry inside the playlist, representing an audio or video asset to play
 * @param {PlaylistEntryProps} props
 * @returns
 */
const PlaylistEntry = ({ index, selected, playerId, title, format, url, asset_id }) => {
	const eb = useEventBus();
	const playerState = usePlayerState();

	return (
		<Box
			bg="black"
			m="0"
			p="1rem"
			as="li"
			key={asset_id}
			onClick={changePlaying(selected)}
			className={clsx({ selected })}
		>
			{title}
		</Box>
	);
};
export default PlaylistEntry;
