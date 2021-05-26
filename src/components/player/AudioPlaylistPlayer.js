import dynamic from "next/dynamic";
import { useShareContext } from "../ShareContextProvider.js";
import PlayerStateProvider from "./PlayerStateProvider.js";
import Playlist from "./Playlist.js";

const AudioPlayer = dynamic(() => import("./AudioPlayer.js"), { ssr: false });

/**
 * @typedef VideoPlaylistPlayerProps
 * @property {String} playerId Unique id of the player where to send events
 * @property {Array} playlist list of tracks
 */

/**
 * Display a soundwave and a playlist of sounds
 * @param {AudioPlaylistPlayerProps} props
 */
const AudioPlaylistPlayer = ({ playerId, playlist = [] }) => {
	const {
		sharedOptions: { addToSelection, directDownload, displayDownloadForm }
	} = useShareContext();

	// Build the list of columns to add to the DataTable
	const columnsToDisplay = ["play"];
	if (addToSelection) {
		columnsToDisplay.push("artist", "song", "addToSelection");
	} else {
		columnsToDisplay.push("title");
	}
	if (directDownload && !displayDownloadForm) {
		columnsToDisplay.push("directDownload");
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
