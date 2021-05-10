import { Box } from "@chakra-ui/layout";
import { useEventBus } from "../EventBusProvider.js";
import { usePlayerState } from "./PlayerStateProvider.js";
import PlayPauseIcon from "./PlayPauseIcon.js";
import styles from "./Playlist.module.scss";
import clsx from "clsx";

const formatDuration = (ms) =>
	`${Math.floor(ms / 60)}:${(Math.round(ms % 60) + 100).toString().substr(1)}`;

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
			as="li"
			key={asset_id}
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

const Playlist = ({ playerId, playlist = [] }) => (
	<Box as="ol" className={styles.playlist}>
		{playlist.map((video, i) => (
			<PlaylistEntry playerId={playerId} key={`entry-${i}`} index={i} {...video} />
		))}
	</Box>
);

export default Playlist;
