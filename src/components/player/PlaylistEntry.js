import { Box } from "@chakra-ui/layout";
import { useEventBus } from "../EventBusProvider.js";
import clsx from "clsx";
import { usePlayerState } from "./PlayerStateProvider.js";
import PlayPauseIcon from "./PlayPauseIcon.js";

/**
 * An entry inside the playlist, representing an audio or video asset to play
 * @param {PlaylistEntryProps} props
 * @returns
 */
const PlaylistEntry = ({ index, playerId, filename, format, url, asset_id }) => {
	const eb = useEventBus();
	const { selected, playing } = usePlayerState();

	const changeTrack = (i) => {
		if (index === selected) {
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
			bg="black"
			m="0"
			p="0.1rem 2rem"
			as="li"
			key={asset_id}
			_hover={{ cursor: "pointer" }}
			onClick={() => changeTrack(index)}
			className={clsx({ selected })}
		>
			<PlayPauseIcon
				show={index === selected}
				playing={index === selected && playing}
				size="2rem"
			/>
			<Box as="span" ml="1rem">
				{filename}
			</Box>
		</Box>
	);
};
export default PlaylistEntry;
