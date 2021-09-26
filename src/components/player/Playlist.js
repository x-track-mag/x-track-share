import { Checkbox } from "@chakra-ui/checkbox";
import { useMemo } from "react";
import { DataTable } from "../base/DataTable.js";
import { useEventBus } from "../EventBusProvider.js";
import { useSharedFolderContext } from "../SharedFolderContext.js";
import { usePlayerState } from "./PlayerStateProvider.js";
import styles from "./Playlist.module.scss";
import PlayPauseIcon from "./PlayPauseIcon.js";
import SelectDownloadFileFormat, {
	AVAILABLE_VIDEO_FORMATS
} from "./SelectDownloadFileFormat.js";

const formatDuration = (ms) =>
	`${Math.floor(ms / 60)}:${(Math.round(ms % 60) + 100).toString().substr(1)}`;

/**
 * Define the available table headers
 */
const PlaylistHeaders = {
	play: {
		Header: "",
		maxWidth: 10,
		accessor: (row) => (
			<PlayPauseIcon
				className="allow-select"
				show={row.active}
				playing={row.active && row.player.playing}
				size="2rem"
			/>
		)
	},
	artist: {
		Header: "Artiste",
		accessor: "artist",
		minWidth: "25%"
	},
	title: {
		Header: "Titre",
		accessor: "title",
		minWidth: 50
	},
	download_form: {
		Header: "Ajouter à ma sélection",
		accessor: (row) => (
			<Checkbox
				color="blue"
				size="lg"
				defaultChecked={row.selected}
				onClick={(evt) => evt.stopPropagation()}
				onChange={(evt) => row.toggleSelection(evt.target.checked)}
			/>
		),
		disableSortBy: true,
		width: "100px",
		maxWidth: "100px",
		align: "center"
	},
	download_audio: {
		Header: "Télécharger",
		accessor: (file) => <SelectDownloadFileFormat mediaFile={file} />,
		disableSortBy: true,
		maxWidth: "10rem",
		isNumeric: true
	},
	download_video: {
		Header: "Télécharger",
		accessor: (file) => (
			<SelectDownloadFileFormat
				mediaFile={file}
				availableFormats={AVAILABLE_VIDEO_FORMATS}
			/>
		),
		disableSortBy: true,
		maxWidth: "10rem",
		isNumeric: true
	},
	duration: {
		Header: "Durée",
		accessor: (row) => formatDuration(row.duration),
		maxWidth: "15rem",
		isNumeric: true
	}
};

/**
 * Take the relevant columns from the Headers definitions
 * @param {Array<String>} ids
 * @return {Array<Column>} Columns definitions suitable for useTable()
 */
const makeColumns = (ids) =>
	ids.map((id) => {
		const columnDef = PlaylistHeaders[id] || {};
		return {
			id,
			...columnDef
		};
	});

/**
 * @typedef PlaylistEntryProps
 * @property {Number} index A unique index in the playlist
 * @property {String} filename
 * @property {Number} duration (in secs)
 * @property {String} url The raw url
 */

/**
 * An entry inside the playlist, representing an audio or video asset to play
 * @constructor
 * @param {PlaylistEntryProps} props
 */
function PlaylistEntry(props, player, selectedTracks, eb) {
	Object.assign(this, props);
	this.player = player;
	this.eb = eb;
	this.active = player.selectedIndex === this.index;
	if (selectedTracks.containsMedia(props)) {
		console.log(`Track ${props.public_id} is selected`);
		this.selected = true;
	}
}
PlaylistEntry.prototype = {
	onClick: function (evt) {
		// Check if the native event has something to do about it
		if (
			["INPUT", "BUTTON"].includes(evt.target.tagName) ||
			evt.target.attributes["aria-hidden"]
		) {
			console.log("Forget it...");
			return;
		}
		const {
			eb,
			active,
			index,
			player: { id, playing }
		} = this;
		if (active) {
			if (playing) {
				eb.emit(`${id}:pause`, index);
			} else {
				eb.emit(`${id}:play`, index);
			}
		} else {
			eb.emit(`${id}:changeTrack`, index);
		}
	},
	toggleSelection: function (selected) {
		this.eb.emit(selected ? "selected-tracks:add" : "selected-tracks:remove", this);
	}
};

const playlistStyles = {
	headers: {
		className: "playlist_header"
	},
	rows: {
		className: "playlist_entry"
	}
};

/**
 * @typedef PlaylistProps
 * @property {String} playerId Unique identifiant (for the event bus)
 * @property {Array<Object>} [playlist=[]] Array of track informations (title, artist, duration)
 * @property {Array<String>} [columns= ["play", "title", "duration"]] Name of the columns to display
 */

/**
 *
 * @param {PlaylistProps} props
 */
const Playlist = ({
	playerId,
	playlist = [],
	columns = ["play", "title", "duration"]
}) => {
	const eb = useEventBus();
	const player = usePlayerState();
	const { selectedTracks } = useSharedFolderContext();
	player.id = playerId;
	const data = playlist.map(
		(entry) => new PlaylistEntry(entry, player, selectedTracks, eb)
	);
	const displayColumns = useMemo(() => makeColumns(columns), [columns]);

	return (
		<DataTable
			columns={displayColumns}
			data={data}
			className={styles.playlist}
			styles={playlistStyles}
			size="sm"
		/>
	);
};

export default Playlist;
