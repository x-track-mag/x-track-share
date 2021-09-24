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
const VideoPlaylistPlayer = ({
	type = "video",
	playerId,
	playlist = [],
	settings = {}
}) => {
	// `download_form` allows to add the tracks to a playlist and download them later
	// `download_links` allows to immediately download each tracks via a direct link
	const { download_form = false, download_links = false } = settings;

	// Build the list of columns to add to the DataTable
	const columnsToDisplay = ["play", "title"];
	if (download_form) {
		columnsToDisplay.push("download_form");
	}
	if (download_links) {
		columnsToDisplay.push("download_video");
	}
	columnsToDisplay.push("duration");
	return (
		<PlayerStateProvider>
			<VideoPlayer id={playerId} playlist={playlist} withPlaylistEvents={true} />
			<Playlist
				playerId={playerId}
				playlist={playlist}
				columns={columnsToDisplay}
			/>
		</PlayerStateProvider>
	);
};

export default VideoPlaylistPlayer;
