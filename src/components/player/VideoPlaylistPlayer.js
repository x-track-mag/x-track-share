import { Box } from "@chakra-ui/layout";
import PlayerStateProvider from "./PlayerStateProvider.js";
import PlaylistEntry from "./PlaylistEntry.js";
import VideoPlayer from "./VideoPlayer.js";

/**
 * @typedef VideoPlaylistPlayerProps
 * @property {String} playerId Unique id of the player where to send events
 * @property {Array} playlist list of tracks
 */

/**
 *
 * @param {VideoPlaylistPlayerProps} props
 */
const VideoPlaylistPlayer = ({ playerId, playlist = [] }) => {
	console.log(`We've got some videos to diaply`, playlist);
	return (
		<PlayerStateProvider playerId={playerId} playlist={playlist}>
			<VideoPlayer id={playerId} />
			<Box as="ol" className="playlist-video">
				{playlist.map((video, i) => (
					<PlaylistEntry index={i} {...video} />
				))}
			</Box>
		</PlayerStateProvider>
	);
};

export default VideoPlaylistPlayer;
