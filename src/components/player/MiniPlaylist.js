import { Box, Grid, GridItem, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import APIClient from "../../lib/services/APIClient";
import { useDialogContext } from "../base/Dialog";
import { useEventBus } from "../EventBusProvider";
import SvgBin from "../icons/SvgBin";

const TrackEntry = ({ index, public_id, title, artist, filename, onDeleteAction }) => (
	<Grid templateColumns="4ch 1fr 1fr 3ch" _hover={{ bgColor: "gray.700" }}>
		<GridItem>#{index}</GridItem>
		{title && <GridItem>{title}</GridItem>}
		{artist && <GridItem>{artist}</GridItem>}
		{filename && <GridItem colSpan={2}>{filename}</GridItem>}
		<GridItem>
			<SvgBin color="yellow" onClick={onDeleteAction} />
		</GridItem>
	</Grid>
);

const MiniPlaylist = ({ tracks = [] }) => {
	const { confirm } = useDialogContext();
	const eb = useEventBus();
	const [vTracks, setVTracks] = useState(tracks);

	useEffect(() => {
		// Replace the real subfolder list by the virtual one
		setVTracks(tracks);
	}, [tracks]);

	// Define the actions associated with each button
	const deleteTrack = ({ filename, title, public_id }) => async (evt) => {
		const confirmDeletion = await confirm({
			title: "TRACK SUPPRESSION",
			message: `Supprimer '${title || filename}' du partage ?`
		});
		if (confirmDeletion) {
			// Remove the resource  reloading the page
			setVTracks(vTracks.filter((track) => track.public_id !== public_id));
			const { success } = await APIClient.del(`/api/resources/${public_id}`);
			if (!success) {
				alert(
					`La suppression du partage '${
						title || filename
					}' n'a pu être effective. Il faut le supprimer totalement dans Cloudinary`
				);
			}
		}
	};
	const playTrack = (track) => () => {
		eb.emit("play:track", track);
	};

	return (
		<Box className="mini-playlist">
			<h3>TRACKS</h3>
			<Stack spacing={0}>
				{vTracks.map((track, i) => (
					<TrackEntry
						key={`track-${i}`}
						index={i + 1}
						{...track}
						onDeleteAction={deleteTrack(track)}
						onPlayAction={playTrack(track)}
					/>
				))}
			</Stack>
		</Box>
	);
};

export default MiniPlaylist;
