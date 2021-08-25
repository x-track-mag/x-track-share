import { Stack, Grid } from "@chakra-ui/layout";
import Folder from "./base/Folder";
import VideoPlaylistPlayer from "./player/VideoPlaylistPlayer.js";
import AudioPlaylistPlayer from "./player/AudioPlaylistPlayer.js";
import { useEffect } from "react";

import SharedFolderNavigation from "./SharedFolderNavigation";
import { PlusIcon } from "./icons";

const CloudinaryAdminFolder = ({ path, subfolders, playlist }) => {
	return (
		<Stack className="folder-content" minH="100vh" margin="0 1rem">
			<SharedFolderNavigation path={path} />

			<Grid
				className="sub-folders"
				templateColumns={{ sm: "repeat(2, 1fr)", lg: "repeat(6, 1fr)" }}
				gap={5}
				p={5}
			>
				<Folder key="upload" path={path}>
					<PlusIcon />
				</Folder>
				{subfolders.map((path) => (
					<Folder key={path} path={path} />
				))}
			</Grid>

			{audios.length && (
				<AudioPlaylistPlayer
					type="audio"
					playerId="audio-player"
					playlist={audios}
					timestamp={timestamp}
				/>
			)}

			{videos.length && (
				<VideoPlaylistPlayer
					type="video"
					playerId="video-player"
					playlist={videos}
					timestamp={timestamp}
				/>
			)}
		</Stack>
	);
};

export default CloudinaryAdminFolder;
