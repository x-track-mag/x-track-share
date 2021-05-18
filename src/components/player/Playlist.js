import { useEventBus } from "../EventBusProvider.js";
import { usePlayerState } from "./PlayerStateProvider.js";
import PlayPauseIcon from "./PlayPauseIcon.js";
import styles from "./Playlist.module.scss";
import { Checkbox } from "@chakra-ui/checkbox";
import { DataTable } from "../base/DataTable.js";

const formatDuration = (ms) =>
	`${Math.floor(ms / 60)}:${(Math.round(ms % 60) + 100).toString().substr(1)}`;

const PlaylistHeaders = {
	play: {
		Header: "",
		width: 10,
		accessor: (row) => (
			<PlayPauseIcon
				className="allow-select"
				show={row.selected}
				playing={row.selected && row.player.playing}
				size="2rem"
			/>
		)
	},
	title: {
		Header: "Titre",
		accessor: (row) => row.filename.split(" - ")[0],
		minWidth: 50
	},
	artist: {
		Header: "Artiste",
		accessor: (row) => row.filename.split(" - ")[1] || "",
		minWidth: 50
	},
	addToPlaylist: {
		Header: "Ajouter à ma playliste",
		accessor: (row) => (
			<Checkbox
				colorSheme="blue"
				onClick={(evt) => evt.stopPropagation()}
				onChange={(evt) => row.toggleAddToPlaylist(evt.checked)}
			/>
		),
		sortable: false,
		width: 15,
		align: "center"
	},
	duration: {
		Header: "Durée",
		accessor: (row) => formatDuration(row.duration),
		width: 15,
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
 * @property {String} url The
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
	this.selected = player.selectedIndex === this.index;
}
PlaylistEntry.prototype = {
	onClick: function (evt) {
		console.log(evt);
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
			selected,
			index,
			player: { id, playing }
		} = this;
		if (selected) {
			if (playing) {
				eb.emit(`${id}:pause`, index);
			} else {
				eb.emit(`${id}:play`, index);
			}
		} else {
			eb.emit(`${id}:changeTrack`, index);
		}
	},
	toggleAddToPlaylist: function (selected) {
		this.eb.emit(selected ? "playlist:add" : "playlist:remove", this);
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

const Playlist = ({
	playerId,
	playlist = [],
	columns = ["play", "title", "duration"]
}) => {
	const eb = useEventBus();
	const player = usePlayerState();
	player.id = playerId;
	const data = playlist.map((entry) => new PlaylistEntry(entry, player, eb));

	return (
		<DataTable
			className={styles.playlist}
			size="sm"
			columns={makeColumns(columns)}
			data={data}
			styles={playlistStyles}
		/>
	);
};

export default Playlist;
