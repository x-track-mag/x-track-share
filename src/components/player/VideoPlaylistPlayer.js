import dynamic from "next/dynamic";
import PlayerStateProvider from "./PlayerStateProvider.js";
import Playlist from "./Playlist.js";

const VideoPlayer = dynamic(() => import("./VideoPlayer.js"), { ssr: false });

/**
 * @typedef VideoPlaylistPlayerProps
 * @property {String} playerId Unique id of the player where to send events
 * @property {Array} playlist list of tracks
 * @property {String} [type="video"]
 */

/**
 *
 * @param {VideoPlaylistPlayerProps} props
 */
const VideoPlaylistPlayer = ({ type = "video", playerId, playlist = [] }) => {
	console.log(`We've got some ${type}s to display`, playlist);
	return (
		<PlayerStateProvider>
			<VideoPlayer id={playerId} playlist={playlist} withPlaylistEvents={true} />
			<Playlist playerId={playerId} playlist={playlist} />
		</PlayerStateProvider>
	);
};

export default VideoPlaylistPlayer;
