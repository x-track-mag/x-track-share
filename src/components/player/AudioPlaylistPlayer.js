import dynamic from "next/dynamic";
import { useScreenSize } from "../base/ScreenSizeProvider.js";
import PlayerStateProvider from "./PlayerStateProvider.js";
import Playlist from "./Playlist.js";

const AudioPlayer = dynamic(() => import("./AudioPlayer.js"), { ssr: false });

/**
 * @typedef AudioPlaylistPlayerProps
 * @property {String} playerId Unique id of the player where to send events
 * @property {Array} playlist list of tracks
 * @property {Object} settings a map of settings keys
 */

/**
 * Display a soundwave and a playlist of sounds
 * @param {AudioPlaylistPlayerProps} props
 */
const AudioPlaylistPlayer = ({ playerId, playlist = [], settings = {} }) => {
	const { screenWidth } = useScreenSize();

	// `download_form` allows to add the tracks to a playlist and download them later
	// `download_links` allows to immediately download each tracks via a direct link
	const { download_form = false, download_links = false } = settings;

	// Build the list of columns to add to the DataTable
	const columnsToDisplay = ["play"];

	if (playlist[0] && playlist[0].artist) {
		columnsToDisplay.push("artist");
	}
	columnsToDisplay.push("title");

	if (download_form) {
		columnsToDisplay.push("download_form");
	}
	if (download_links) {
		columnsToDisplay.push("download_audio");
	}
	if (screenWidth > 640) {
		// We cannot afford these columns on tiny screens
		columnsToDisplay.push("duration");
	}

	return (
		<PlayerStateProvider>
			<AudioPlayer id={playerId} playlist={playlist} />
			<Playlist playerId={playerId} playlist={playlist} columns={columnsToDisplay} />
		</PlayerStateProvider>
	);
};

export default AudioPlaylistPlayer;
