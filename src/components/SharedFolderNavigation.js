import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Heading } from "@chakra-ui/layout";
import { Drawer, DrawerOverlay, DrawerHeader, DrawerContent } from "@chakra-ui/modal";
import Breadcrumbs from "./Breadcrumbs.js";
import DownloadForm from "./forms/DownloadForm.js";
import { useShareContext } from "./ShareContextProvider.js";
import useIsomorphicLayoutEffect from "../hooks/useIsomorphicLayoutEffect.js";

const SharedFolderNavigation = ({ path }) => {
	const {
		navigate,
		selectedTracks,
		sharedOptions: { addToSelection, displayDownloadForm }
	} = useShareContext();

	// These variables will control the drawer to show the Download form
	const { isOpen, onOpen, onClose } = useDisclosure();

	// Display the download form which will then display the download URL
	const download = async (evt) => {
		evt.preventDefault();
		onOpen();
	};

	return (
		<Box className="navigation-header" as="header">
			<Breadcrumbs path={path} />
			{addToSelection && selectedTracks.path !== path && (
				<Heading
					className="neon-text"
					display="inline-block"
					float="right"
					key={selectedTracks.path}
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
			{addToSelection && selectedTracks.path === path && (
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
							Download
						</a>
					</Heading>
					{displayDownloadForm && (
						<Drawer isOpen={isOpen} onClose={onClose}>
							<DrawerOverlay />
							<DrawerHeader mt="50px">Merci de renseigner</DrawerHeader>
							<DrawerContent padding={2} bgColor="black">
								<DownloadForm
									maxWidth="50rem"
									selectedTracks={selectedTracks}
								/>
							</DrawerContent>
						</Drawer>
					)}
				</>
			)}
		</Box>
	);
};

export default SharedFolderNavigation;
