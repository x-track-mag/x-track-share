import { Box, Heading } from "@chakra-ui/layout";
import Breadcrumbs from "./Breadcrumbs";
import { useShareContext } from "./ShareContextProvider";

const download = (tracks, displayDownloadForm) => (evt) => {
	evt.preventDefault();
};

const SharedFolderNavigation = ({ path }) => {
	const {
		navigate,
		selectedTracks,
		sharedOptions: { addToSelection, displayDownloadForm }
	} = useShareContext();
	return (
		<Box className="navigation-header" as="header">
			<Breadcrumbs path={path} />
			{addToSelection && selectedTracks.path !== path && (
				<Heading display="inline-block" float="right" key={selectedTracks.path}>
					<a
						href={`/share/${selectedTracks.path}`}
						onClick={navigate(selectedTracks.path)}
					>
						Sélection
					</a>
				</Heading>
			)}
			{addToSelection && selectedTracks.path === path && (
				<Heading display="inline-block" float="right" key={selectedTracks.path}>
					<a
						href={`/share/${selectedTracks.path}/download`}
						onClick={download(selectedTracks, displayDownloadForm)}
					>
						Download
					</a>
				</Heading>
			)}
		</Box>
	);
};

export default SharedFolderNavigation;
