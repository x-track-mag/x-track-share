import { Heading, Stack, Box, Grid } from "@chakra-ui/layout";
import Folder from "./base/Folder";
import PlaylistEntry from "./PlaylistEntry";

const CloudinaryFolder = ({ label, folders, audios, videos }) => (
	<Stack className="folder-content" bg="black">
		<Heading>{label}</Heading>

		<Grid className="sub-folders" templateColumns="repeat(5, 1fr)" gap={4}>
			{Object.keys(folders).map((name) => (
				<Folder title={name} path={folders[name]} />
			))}
		</Grid>

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
