import dynamic from "next/dynamic";
import PlayerStateProvider from "./PlayerStateProvider.js";
import Playlist from "./Playlist.js";

const AudioPlayer = dynamic(() => import("./AudioPlayer.js"), { ssr: false });

/**
 * @typedef VideoPlaylistPlayerProps
 * @property {String} playerId Unique id of the player where to send events
 * @property {Array} playlist list of tracks
 */

/**
 *
 * @param {AudioPlaylistPlayerProps} props
 */
const AudioPlaylistPlayer = ({ playerId, playlist = [] }) => {
	console.log(`We've got some audios to display`, playlist);
	return (
		<PlayerStateProvider>
			<AudioPlayer id={playerId} playlist={playlist} />
			<Playlist playerId={playerId} playlist={playlist} />
		</PlayerStateProvider>
	);
};

export default AudioPlaylistPlayer;
