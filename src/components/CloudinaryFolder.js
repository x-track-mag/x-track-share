import { Heading, Stack, Box, Grid } from "@chakra-ui/layout";
import Folder from "./base/Folder";
import PlaylistEntry from "./PlaylistEntry";

const CloudinaryFolder = ({ label, subfolders, audios, videos }) => (
	<Stack className="folder-content" bg="black">
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
			<Box as="ol" className="playlist-audio">
				{audios.map((audio) => (
					<PlaylistEntry {...audio} />
				))}
			</Box>
		)}

		{videos.length && (
			<Box as="ol" className="playlist-video">
				{videos.map((video) => (
					<PlaylistEntry {...video} />
				))}
			</Box>
		)}
	</Stack>
);

export default CloudinaryFolder;
