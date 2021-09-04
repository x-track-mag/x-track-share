import dynamic from "next/dynamic";
import { useSharedFolderContext } from "../SharedFolderContext.js";
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
	// `download_form` allows to add the tracks to a playlist and download them later
	// `download_links` allows to immediately download each tracks via a direct link
	const { download_form = false, download_links = false } = settings;

	// Build the list of columns to add to the DataTable
	const columnsToDisplay = ["play"];
	if (download_form) {
		columnsToDisplay.push("artist", "song", "download_form");
	} else {
		columnsToDisplay.push("title");
	}
	if (download_links) {
		columnsToDisplay.push("download_links");
	}
	columnsToDisplay.push("duration");

	return (
		<PlayerStateProvider>
			<AudioPlayer id={playerId} playlist={playlist} />
			<Playlist
				playerId={playerId}
				playlist={playlist}
				columns={columnsToDisplay}
			/>
		</PlayerStateProvider>
	);
};

export default AudioPlaylistPlayer;
