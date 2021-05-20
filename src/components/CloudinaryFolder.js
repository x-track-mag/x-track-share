import { Stack, Grid } from "@chakra-ui/layout";
import Folder from "./base/Folder";
import VideoPlaylistPlayer from "./player/VideoPlaylistPlayer.js";
import AudioPlaylistPlayer from "./player/AudioPlaylistPlayer.js";
import Breadcrumbs from "./Breadcrumbs";
import { useEffect } from "react";
import { useShareContext } from "./ShareContextProvider";

const CloudinaryFolder = () => {
	const { folders, current, playlist } = useShareContext();
	const folder = folders[current] || playlist;

	if (!folder) return null;

	const { path, label, subfolders, audios, videos, displayPlaylist } = folder;

	useEffect(() => {
		console.log(`Exploring ${current}`, folder);
	}, [current]);

	return (
		<Stack className="folder-content" minH="100vh" margin="0 1rem">
			{displayPlaylist ? (
				<Breadcrumbs path={path} additionalLink={playlist && playlist.path} />
			) : (
				<Breadcrumbs path={path} />
			)}

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
