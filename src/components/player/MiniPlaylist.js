import { Box, Grid, GridItem, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import APIClient from "../../lib/services/APIClient";
import { useDialogContext } from "../base/Dialog";
import { useEventBus } from "../EventBusProvider";
import SvgBin from "../icons/SvgBin";

/**
 * Reorder the tracks according to the playlist
 * playlist is a list of file names
 * @return {Array<file>}
 */
const orderTracks = (tracks = [], playlist = []) => {
	if (tracks.length !== playlist.length) {
		// We have a mismatch ! We can't apply the playlist order
		return tracks.sort((a, b) => (a.filename > b.filename ? 1 : -1));
	}
	const orderedTracks = [];
	playlist.forEach((fileName) => {
		orderedTracks.push(tracks.find((f) => f.filename === fileName));
	});
	return orderedTracks;
};

const compareTracklists = (l1, l2) =>
	JSON.stringify(l1.map((t) => t.filename)) ===
	JSON.stringify(l2.map((t) => t.filename));

const TrackEntry = ({ index, title, artist, onDeleteAction }) => (
	<Grid
		as="li"
		templateColumns="4ch 1fr 1fr 3ch"
		_hover={{ bgColor: "gray.700" }}
		cursor="move"
	>
		<GridItem>#{index}</GridItem>
		{artist ? (
			<>
				<GridItem>{artist}</GridItem>
				<GridItem>{title}</GridItem>
			</>
		) : (
			<GridItem colSpan={2}>{title}</GridItem>
		)}
		<GridItem>
			<SvgBin color="yellow" onClick={onDeleteAction} />
		</GridItem>
	</Grid>
);

/**
 * Render a simple, editable list of tracks (sort, delete)
 * @param {MiniPlaylistProps} props
 * @return
 */
const MiniPlaylist = ({ folderPath, tracks = [], playlist = [], updatePlaylist }) => {
	const { confirm } = useDialogContext();
	const eb = useEventBus();
	const [orderedTracks, setOrderedTracks] = useState();

	useEffect(() => {
		setOrderedTracks(orderTracks(tracks, playlist));
	}, [folderPath]);

	if (!orderedTracks || orderedTracks.length === 0) return null;

	// Define the actions associated with each button
	const deleteTrack = ({ title, public_id }) => async (evt) => {
		const confirmDeletion = await confirm({
			title: "TRACK SUPPRESSION",
			message: `Supprimer '${title}' du partage ?`,
			choices: ["Oui", "Non"],
			focusOn: 1 // Don't select the destructive option
		});
		if (confirmDeletion) {
			// Remove the resource
			const newTrackList = orderedTracks.filter(
				(track) => track.public_id !== public_id
			);
			setOrderedTracks(newTrackList);
			updatePlaylist(newTrackList);
			const { success } = await APIClient.del(`/api/resources/${public_id}`);
			if (!success) {
				confirm({
					title: "ECHEC",
					message: `La suppression du fichier partagé '${title}' n'a pu être effective. 
Il faut le supprimer totalement dans Cloudinary`,
					choices: ["OK"]
				});
			}
		}
	};
	const playTrack = (track) => () => {
		eb.emit("play:track", track);
	};
	const reorderTracks = (tracks) => {
		if (compareTracklists(orderedTracks, tracks) === false) {
			updatePlaylist(tracks);
		}
		setOrderedTracks(tracks);
	};

	return (
		<Box className="mini-playlist">
			<h3>TRACKS</h3>
			<Stack spacing={0}>
				<ReactSortable tag="ul" list={orderedTracks} setList={reorderTracks}>
					{orderedTracks.map((track, i) => (
						<TrackEntry
							key={track.public_id}
							index={i + 1}
							{...track}
							onDeleteAction={deleteTrack(track)}
							onPlayAction={playTrack(track)}
						/>
					))}
				</ReactSortable>
			</Stack>
		</Box>
	);
};

export default MiniPlaylist;
