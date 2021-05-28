import { useEventBus } from "../EventBusProvider.js";
import { usePlayerState } from "./PlayerStateProvider.js";
import PlayPauseIcon from "./PlayPauseIcon.js";
import styles from "./Playlist.module.scss";
import { Checkbox } from "@chakra-ui/checkbox";
import { DataTable } from "../base/DataTable.js";
import { useMemo } from "react";
import SelectDownloadFormat from "./DownloadSelect.js";

const formatDuration = (ms) =>
	`${Math.floor(ms / 60)}:${(Math.round(ms % 60) + 100).toString().substr(1)}`;

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
	title: {
		Header: "Titre",
		accessor: (row) => row.title || row.filename,
		minWidth: 50
	},
	artist: {
		Header: "Artiste",
		accessor: "artist",
		minWidth: "25%"
	},
	song: {
		Header: "Titre",
		accessor: "song",
		minWidth: "25%"
	},
	addToSelection: {
		Header: "Ajouter à ma sélection",
		accessor: (row) => (
			<Checkbox
				color="blue"
				size="lg"
				onClick={(evt) => evt.stopPropagation()}
				onChange={(evt) => row.toggleSelection(evt.target.checked)}
			/>
		),
		disableSortBy: true,
		width: "100px",
		maxWidth: "100px",
		align: "center"
	},
	directDownload: {
		Header: "Télécharger",
		accessor: (row) => (
			<SelectDownloadFormat
				path={row.public_id}
				filename={`${row.artist} - ${row.song}`}
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
 * @returns {Array<Column>} Columns definitions suitable for useTable()
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
 * @param {PlaylistEntryProps} props
 * @returns
 */
function PlaylistEntry(props, player, eb) {
	Object.assign(this, props);
	this.player = player;
	this.eb = eb;
	this.active = player.selectedIndex === this.index;
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
	},
	downloadUrl: function () {}
};

const playlistStyles = {
	headers: {
		className: "playlist_header"
	},
	rows: {
		className: "playlist_entry"
	}
};

const Playlist = ({
	playerId,
	playlist = [],
	columns = ["play", "title", "duration"]
}) => {
	const eb = useEventBus();
	const player = usePlayerState();
	player.id = playerId;
	const data = playlist.map((entry) => new PlaylistEntry(entry, player, eb));
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
