import { Box, Grid, GridItem, Stack } from "@chakra-ui/react";
import { useDialogContext } from "../base/Dialog";
import { useEventBus } from "../EventBusProvider";
import SvgBin from "../icons/SvgBin";

const TrackEntry = ({ index, public_id, song, artist, filename, onDeleteAction }) => (
	<Grid templateColumns="4ch 1fr 1fr 3ch" _hover={{ bgColor: "gray.700" }}>
		<GridItem>#{index}</GridItem>
		{song && <GridItem>{song}</GridItem>}
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

	// Define the actions associated with each button
	const deleteTrack = ({ filename, song, public_id }) => async (evt) => {
		const confirmDeletion = await confirm({
			title: "TRACK SUPPRESSION",
			message: `Supprimer '${song || filename}' du partage ?`
		});
		if (confirmDeletion) {
		}
	};
	const playTrack = (track) => () => {
		eb.emit("play:track", track);
	};

	return (
		<Box className="mini-playlist">
			<h3>TRACKS</h3>
			<Stack spacing={0}>
				{tracks.map((track, i) => (
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
