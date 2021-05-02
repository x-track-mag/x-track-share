import { Box } from "@chakra-ui/layout";
import { useEventBus } from "../EventBusProvider.js";
import clsx from "clsx";
import { usePlayerState } from "./PlayerStateProvider.js";

/**
 * An entry inside the playlist, representing an audio or video asset to play
 * @param {PlaylistEntryProps} props
 * @returns
 */
const PlaylistEntry = ({
	index,
	selected,
	playerId,
	filename,
	format,
	url,
	asset_id
}) => {
	const eb = useEventBus();
	// const playerState = usePlayerState();

	const changeTrack = (i) => {
		eb.emit(`${playerId}:changeTrack`, i);
	};

	return (
		<Box
			bg="black"
			m="0"
			p="1rem"
			as="li"
			key={asset_id}
			onClick={changeTrack(index)}
			className={clsx({ selected })}
		>
			{filename}
		</Box>
	);
};
export default PlaylistEntry;
