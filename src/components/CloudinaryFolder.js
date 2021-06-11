import { Stack, Grid } from "@chakra-ui/layout";
import Folder from "./base/Folder";
import VideoPlaylistPlayer from "./player/VideoPlaylistPlayer.js";
import AudioPlaylistPlayer from "./player/AudioPlaylistPlayer.js";
import Breadcrumbs from "./Breadcrumbs";
import { useEffect } from "react";
import { useShareContext } from "./ShareContextProvider";
import SharedFolderNavigation from "./SharedFolderNavigation";

const CloudinaryFolder = () => {
	const { folders, current, selectedTracks, sharedOptions } = useShareContext();
	const folder = folders[current] || selectedTracks;

	if (!folder) return null;

	const { path, subfolders, audios, videos } = folder;

	useEffect(() => {
		console.log(`Exploring ${current}`, folder);
	}, [current]);

	return (
		<Stack className="folder-content" minH="100vh" margin="0 1rem">
			<SharedFolderNavigation path={path} />

			{subfolders.length && (
				<Grid
					className="sub-folders"
					templateColumns={{ sm: "repeat(2, 1fr)", lg: "repeat(6, 1fr)" }}
					gap={5}
					p={5}
				>
					{subfolders.map((path) => (
						<Folder key={path} path={path} />
					))}
				</Grid>
			)}

			{audios.length && (
				<AudioPlaylistPlayer
					type="audio"
					playerId="audio-player"
					playlist={audios}
				/>
			)}

			{videos.length && (
				<VideoPlaylistPlayer
					type="video"
					playerId="video-player"
					playlist={videos}
				/>
			)}
		</Stack>
	);
};

export default CloudinaryFolder;
