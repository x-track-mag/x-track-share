import { Box } from "@chakra-ui/layout";
import { useEventBus } from "../EventBusProvider.js";
import clsx from "clsx";
import { usePlayerState } from "./PlayerStateProvider.js";
import PlayPauseIcon from "./PlayPauseIcon.js";

const formatDuration = (ms) => `${Math.floor(ms / 60)}:${Math.round(ms % 60)}`;

/**
 * An entry inside the playlist, representing an audio or video asset to play
 * @param {PlaylistEntryProps} props
 * @returns
 */
const PlaylistEntry = ({
	index,
	playerId,
	filename,
	format,
	duration,
	url,
	asset_id
}) => {
	const eb = useEventBus();
	const { selectedIndex, playing } = usePlayerState();
	const selected = selectedIndex === index;

	const changeTrack = (i) => {
		if (selected) {
			if (playing) {
				eb.emit(`${playerId}:pause`, i);
			} else {
				eb.emit(`${playerId}:play`, i);
			}
		} else {
			eb.emit(`${playerId}:changeTrack`, i);
		}
	};

	return (
		<Box
			role="group"
			bg="black"
			m="0"
			p="0.1rem 2rem"
			as="li"
			key={asset_id}
			// _hover={{ cursor: "pointer", color: "yellow" }}
			// color={selected ? "yellow" : "white"}
			onClick={() => changeTrack(index)}
			className={clsx("playlist_entry", { selected })}
		>
			<PlayPauseIcon show={selected} playing={selected && playing} size="2rem" />
			<Box as="span" ml="1rem">
				{filename}
			</Box>
			<Box as="span" ml="1rem">
				{formatDuration(duration)}
			</Box>
		</Box>
	);
};
export default PlaylistEntry;
