import { Grid, Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Folder from "../../components/base/Folder.js";
import AudioPlaylistPlayer from "../../components/player/AudioPlaylistPlayer.js";
import VideoPlaylistPlayer from "../../components/player/VideoPlaylistPlayer.js";
import {
	useSharedFolderContext,
	withSharedFolderContext
} from "../../components/SharedFolderContext.js";
import SharedFolderNavigation from "../../components/SharedFolderNavigation.js";
import APIClient from "../../lib/services/APIClient.js";
import ArrayExtensions from "../../lib/utils/Arrays.js"; // This will effectively extends Array.prototype

/**
 * Retrieve the folder content /share/${uid}
 */
export const getServerSideProps = async ({ params }) => {
	const uid = params.uid;
	console.log(`getServerSideProps(${uid.join("/")})`);

	const { folders } = await APIClient.get(`/api/share/${uid[0]}`);

	return {
		props: {
			folders,
			path: uid.join("/")
		}
	};
};

/**
 * We don't read the props. We rely on the loaded SharedFolderContext
 */
const SharedFolderPage = () => {
	const {
		folders,
		current,
		selectedTracks,
		timestamp,
		navigate
	} = useSharedFolderContext();

	// Load the current folder or display the selected tracks
	const folder = folders[current] || selectedTracks;

	if (!folder) return null;

	const { path, subfolders, audios, videos, settings } = folder;

	useEffect(() => {
		console.log(`Exploring ${current}`, folder, settings);
	}, [current]);

	return (
		<Stack className="folder-content" minH="100vh" margin="0 1rem">
			<SharedFolderNavigation path={path} settings={settings} />

			{subfolders.length && (
				<Grid
					className="sub-folders"
					templateColumns={{ sm: "repeat(2, 1fr)", lg: "repeat(6, 1fr)" }}
					gap={5}
					p={5}
				>
					{subfolders.map((path) => (
						<Folder key={path} path={path} navigate={navigate} />
					))}
				</Grid>
			)}

			{audios.length && (
				<AudioPlaylistPlayer
					type="audio"
					playerId="audio-player"
					playlist={audios.reorderFrom(settings.playlist, "filename")}
					settings={settings}
					timestamp={timestamp}
				/>
			)}

			{videos.length && (
				<VideoPlaylistPlayer
					type="video"
					playerId="video-player"
					playlist={videos}
					settings={settings}
					timestamp={timestamp}
				/>
			)}
		</Stack>
	);
};

export default withSharedFolderContext(SharedFolderPage);
