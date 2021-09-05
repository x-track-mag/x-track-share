import { Box, Heading } from "@chakra-ui/layout";
import { Drawer, DrawerOverlay, DrawerContent } from "@chakra-ui/modal";
import React, { useState } from "react";
import Breadcrumbs from "./Breadcrumbs.js";
import DownloadForm from "./forms/DownloadForm.js";
import { useSharedFolderContext } from "./SharedFolderContext.js";

const SharedFolderNavigation = ({ path, settings = {} }) => {
	const { navigate, timestamp, selectedTracks } = useSharedFolderContext();
	const showSelectedTracks =
		selectedTracks.audios.length + selectedTracks.audios.length > 0;

	// These variables will control the drawer to show the Download form
	const [showDownloadForm, setDrawerVisibility] = useState(false);
	const toggleDownloadForm = (visible) => (evt) => {
		evt.preventDefault();
		setDrawerVisibility(visible);
		return false;
	};

	return (
		<Box className="navigation-header" as="header">
			<Breadcrumbs root="/share" path={path} navigate={navigate} />
			{showSelectedTracks && selectedTracks.path !== path && (
				<Heading
					className="neon-text"
					display="inline-block"
					float="right"
					key={selectedTracks.path}
					timestamp={timestamp}
				>
					<a
						href={`/share/${selectedTracks.path}`}
						onClick={navigate(`/share/${selectedTracks.path}`)}
					>
						Ma&nbsp;Sélection&nbsp;
						<small>
							({selectedTracks.audios.length + selectedTracks.videos.length}
							)
						</small>
					</a>
				</Heading>
			)}
			{selectedTracks.path === path && (
				<>
					<Heading
						className="neon-text"
						display="inline-block"
						float="right"
						key={selectedTracks.path}
					>
						<a
							href={`/share/${selectedTracks.path}/download`}
							onClick={toggleDownloadForm(true)}
						>
							Télécharger
						</a>
					</Heading>
					<Drawer isOpen={showDownloadForm} onClose={toggleDownloadForm(false)}>
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
