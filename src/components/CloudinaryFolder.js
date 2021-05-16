import { Heading, Stack, Box, Grid } from "@chakra-ui/layout";
import Folder from "./base/Folder";
import VideoPlaylistPlayer from "./player/VideoPlaylistPlayer.js";
import AudioPlaylistPlayer from "./player/AudioPlaylistPlayer.js";
import Breadcrumbs from "./Breadcrumbs";
import { useEffect } from "react";

const CloudinaryFolder = ({ folders = {}, current }) => {
	const router = useRouter();
	const folder = folders[current];
	if (!folder) return null;
	const { path, label, subfolders, audios, videos } = folder;

	useEffect(() => {
		console.log(`Exploring ${current}`, folder);
	}, [current]);

	return (
		<Stack className="folder-content" bg="black" minH="100vh">
			<Breadcrumbs path={path} />

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
