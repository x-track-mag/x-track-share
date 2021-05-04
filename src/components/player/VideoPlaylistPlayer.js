import dynamic from "next/dynamic";
import { Box } from "@chakra-ui/layout";
import PlayerStateProvider from "./PlayerStateProvider.js";
import PlaylistEntry from "./PlaylistEntry.js";

const VideoPlayer = dynamic(() => import("./VideoPlayer.js"), { ssr: false });

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
	console.log(`We've got some videos to disply`, playlist);
	return (
		<PlayerStateProvider>
			<VideoPlayer id={playerId} playlist={playlist} />
			<Box as="ol" className="playlist-video">
				{playlist.map((video, i) => (
					<PlaylistEntry
						playerId={playerId}
						key={`entry-${i}`}
						index={i}
						{...video}
					/>
				))}
			</Box>
		</PlayerStateProvider>
	);
};

export default VideoPlaylistPlayer;
