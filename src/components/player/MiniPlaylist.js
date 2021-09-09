import { Box, Grid, GridItem, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import APIClient from "../../lib/services/APIClient";
import { useDialogContext } from "../base/Dialog";
import { useEventBus } from "../EventBusProvider";
import SvgBin from "../icons/SvgBin";

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

const MiniPlaylist = ({ path, tracks = [], updatePlaylist }) => {
	const { confirm } = useDialogContext();
	const eb = useEventBus();
	const [orderedTracks, setOrderedTracks] = useState(tracks);

	useEffect(() => {
		console.log(`MiniPlaylist rendering the tracks for ${path}`, tracks);
	}, [path, tracks]);

	// Define the actions associated with each button
	const deleteTrack = ({ title, public_id }) => async (evt) => {
		const confirmDeletion = await confirm({
			title: "TRACK SUPPRESSION",
			message: `Supprimer '${title}' du partage ?`
		});
		if (confirmDeletion) {
			// Remove the resource
			updatePlaylist(tracks.filter((track) => track.public_id !== public_id));
			const { success } = await APIClient.del(`/api/resources/${public_id}`);
			if (!success) {
				alert(
					`La suppression du fichier partagé '${title}' n'a pu être effective. 
Il faut le supprimer totalement dans Cloudinary`
				);
			}
		}
	};
	const playTrack = (track) => () => {
		eb.emit("play:track", track);
	};
	const reorderTracks = (tracks) => {
		updatePlaylist(tracks);
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
