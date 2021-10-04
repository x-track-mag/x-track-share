import { Box, Grid, Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Folder from "../../components/base/Folder.js";
import AudioPlaylistPlayer from "../../components/player/AudioPlaylistPlayer.js";
import SelectDownloadArchiveFormat from "../../components/player/SelectDownloadArchiveFormat.js";
import VideoPlaylistPlayer from "../../components/player/VideoPlaylistPlayer.js";
import {
	useSharedFolderContext,
	withSharedFolderContext
} from "../../components/SharedFolderContext.js";
import SharedFolderNavigation from "../../components/SharedFolderNavigation.js";
import APIClient from "../../lib/services/APIClient.js";

/**
 * Retrieve the folder content /share/${uid}
 */
export const getServerSideProps = async ({ params }) => {
	const uid = params.uid;
	const sharedRoot = uid.join("/");
	console.log(`getServerSideProps(sharedRoot})`);

	const { folders } = await APIClient.get(`/api/share/${sharedRoot}`);

	return {
		props: {
			folders,
			path: sharedRoot
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

	const {
		path,
		subfolders,
		audios,
		videos,
		settings,
		download_audios_archive,
		download_videos_archive,
		download_folder_archive
	} = folder;

	useEffect(() => {
		console.log(`Exploring ${current}`, folder, settings);
	}, [current]);

	return (
		<Stack className="folder-content" minH="100vh" margin="0 1rem">
			<SharedFolderNavigation path={path} settings={settings} />

			{subfolders.length && (
				<Grid
					className="sub-folders"
					templateColumns={{
						xs: "1fr 1fr",
						sm: "repeat(3, 1fr)",
						lg: "repeat(4, 1fr)",
						xl: "repeat(6, 1fr)"
					}}
					gap={5}
					p={5}
				>
					{subfolders.map((path) => (
						<Folder key={path} path={path} navigate={navigate} />
					))}
				</Grid>
			)}

			{audios.length && (
				<Box position="relative">
					<AudioPlaylistPlayer
						type="audio"
						playerId="audio-player"
						playlist={audios.reorderFrom(settings.playlist, "filename")}
						settings={settings}
						timestamp={timestamp}
					/>
					{settings.download_zip && (
						<SelectDownloadArchiveFormat
							playlist_name={current.replace("/", "-")}
							download_archive_links={download_audios_archive}
						>
							Download zip
						</SelectDownloadArchiveFormat>
					)}
				</Box>
			)}

			{videos.length && (
				<Box position="relative">
					<VideoPlaylistPlayer
						type="video"
						playerId="video-player"
						playlist={videos}
						settings={settings}
						timestamp={timestamp}
					/>
					{settings.download_zip && (
						<SelectDownloadArchiveFormat
							playlist_name={current.replace("/", "-")}
							download_archive_links={download_videos_archive}
						>
							Download zip
						</SelectDownloadArchiveFormat>
					)}
				</Box>
			)}

			{settings.download_zip && (
				<Box position="relarive" mt={5}>
					<a
						href={download_folder_archive}
						target="_blank"
						download={`${path}.zip`}
					>
						Download All
					</a>
				</Box>
			)}
		</Stack>
	);
};

export default withSharedFolderContext(SharedFolderPage);
