import { Heading, Stack, Box, Grid } from "@chakra-ui/layout";
import Folder from "./base/Folder";
import VideoPlaylistPlayer from "./player/VideoPlaylistPlayer";

const CloudinaryFolder = ({ label, subfolders, audios, videos }) => (
	<Stack className="folder-content" bg="black" minH="100vh">
		<Heading>{label}</Heading>

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
			<VideoPlaylistPlayer playerId="audio-player" playlist={audios} />
		)}

		{videos.length && (
			<VideoPlaylistPlayer playerId="video-player" playlist={videos} />
		)}
	</Stack>
);

export default CloudinaryFolder;
