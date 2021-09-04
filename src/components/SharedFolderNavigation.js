import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Heading } from "@chakra-ui/layout";
import { Drawer, DrawerOverlay, DrawerContent } from "@chakra-ui/modal";
import React from "react";
import Breadcrumbs from "./Breadcrumbs.js";
import DownloadForm from "./forms/DownloadForm.js";
import { useSharedFolderContext } from "./SharedFolderContext.js";

const SharedFolderNavigation = ({ path, settings = {} }) => {
	const { navigate, timestamp, selectedTracks } = useSharedFolderContext();
	const { download_form = false } = settings;

	// These variables will control the drawer to show the Download form
	const { isOpen, onOpen, onClose } = useDisclosure();

	// Display the download form which will then display the download URL
	const download = async (evt) => {
		evt.preventDefault();
		onOpen();
	};

	return (
		<Box className="navigation-header" as="header">
			<Breadcrumbs root="/share" path={path} navigate={navigate} />
			{download_form && selectedTracks.path !== path && (
				<Heading
					className="neon-text"
					display="inline-block"
					float="right"
					key={selectedTracks.path}
					timestamp={timestamp}
				>
					<a
						href={`/share/${selectedTracks.path}`}
						onClick={navigate(selectedTracks.path)}
					>
						Ma&nbsp;Sélection&nbsp;
						<small>
							({selectedTracks.audios.length + selectedTracks.videos.length}
							)
						</small>
					</a>
				</Heading>
			)}
			{download_form && selectedTracks.path === path && (
				<>
					<Heading
						className="neon-text"
						display="inline-block"
						float="right"
						key={selectedTracks.path}
					>
						<a
							href={`/share/${selectedTracks.path}/download`}
							onClick={download}
						>
							Télécharger
						</a>
					</Heading>
					<Drawer isOpen={isOpen} onClose={onClose}>
						<DrawerOverlay />
						<DrawerContent padding="80px 2em" bgColor="black">
							<DownloadForm selectedTracks={selectedTracks} />
						</DrawerContent>
					</Drawer>
				</>
			)}
		</Box>
	);
};

export default SharedFolderNavigation;
