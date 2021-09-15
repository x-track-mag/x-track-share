import { Box, Center, Grid, Stack } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { useDialogContext } from "../../components/base/Dialog.js";
import Folder from "../../components/base/Folder.js";
import Breadcrumbs from "../../components/Breadcrumbs.js";
import SvgBin from "../../components/icons/SvgBin.js";
import SvgLink from "../../components/icons/SvgLink.js";
import SvgPlus from "../../components/icons/SvgPlus";
import MiniPlaylist from "../../components/player/MiniPlaylist.js";
import SharedSettings from "../../components/SharedSettings.js";
import APIClient from "../../lib/services/APIClient.js";
import ArrayExtensions from "../../lib/utils/Arrays.js";

ArrayExtensions();

/**
 * Retrieves the subfolders and playlist linked to this shared folder
 * @param {Object} param0
 * @returns { props } to fill the page component
 */
export const getServerSideProps = async ({ params }) => {
	const parts = params.parts || [""];
	const folderPath = parts.join("/");

	const props = await APIClient.get(`/api/folders/${folderPath}`);
	console.log(`getServerSideProps(${folderPath}) :`, props);

	return {
		props
	};
};

const linkIcon = (path) => (props) => (
	<a href={`/share/${path}`} target="_blank" onClick={(evt) => evt.stopPropagation()}>
		<SvgLink size="1.5rem" {...props} />
	</a>
);
const deleteIcon = (action) => (props) => (
	<SvgBin size="1.5rem" onClick={action} {...props} />
);

/**
 * Display the admin view of a shared folder
 */
const AdminPage = ({ path, subfolders, tracks, settings = SHARED_SETTINGS_DEFAULTS }) => {
	const uploadPath = `/_admin/upload/${path}`;
	const [sharedSettings, setSharedSettings] = useState(settings);
	const [vFolders, setVFolders] = useState(); // Use a virtual list of folders to allow for fast suppression
	const [orderedTracks, setOrderedTracks] = useState();

	const { confirm } = useDialogContext();

	useEffect(() => {
		setVFolders(subfolders);
		// Still don't know why i need to do that in a hook to force the tracks to be re-rendered on each pages..
		const orderedTracks = tracks.reorderFrom(settings.playlist, "filename");
		setOrderedTracks(orderedTracks);
	}, [path]);

	const updateSettings = (newSettings) => {
		setSharedSettings({ ...newSettings });
		APIClient.post("/api/settings/" + path, { settings: newSettings });
	};
	const updatePlaylist = (updatedTracks) => {
		updateSettings({
			...sharedSettings,
			playlist: updatedTracks.map((track) => track.filename)
		});
	};

	const deleteFolder = (folderPath) => async (evt) => {
		evt.stopPropagation();
		const confirmDeletion = await confirm({
			title: "SUPPRESSION DE PARTAGE",
			message: `Supprimer le dossier de partage '${folderPath}' ?`,
			yes: "Oui",
			no: "Non"
		});
		if (confirmDeletion) {
			// Remove the folder from the virtual folder list without reloading the page
			setVFolders(vFolders.filter(({ path }) => path !== folderPath));
			const { success } = await APIClient.del(`/api/folders/${folderPath}`);
			if (!success) {
				alert(
					"La suppression totale du dossier n'a pu être effective. Il faut le supprimer totalement dans Cloudinary"
				);
			}
		}
	};

	return (
		<Stack className="folder-content" minH="100vh" margin="0 1rem">
			<Box className="navigation-header" as="header">
				<Breadcrumbs root="/_admin" path={path} linkRoot="Share" />
			</Box>

			<Grid
				templateColumns={{ sm: "repeat(2, 1fr)", lg: "repeat(6, 1fr)" }}
				className="sub-folders"
				gap={5}
				p={5}
			>
				<Folder key="upload" path={uploadPath}>
					<SvgPlus />
				</Folder>
				{vFolders &&
					vFolders.map(({ name, path }) => (
						<Folder
							key={name}
							path={`/_admin/${path}`}
							icons={[linkIcon(path), deleteIcon(deleteFolder(path))]}
						/>
					))}
			</Grid>
			{orderedTracks && orderedTracks.length > 0 && (
				<Grid templateColumns={{ sm: "1fr", lg: "60% 40%" }} color="white">
					<MiniPlaylist
						folderPath={path}
						tracks={orderedTracks}
						updatePlaylist={updatePlaylist}
					/>
					<Center>
						<SharedSettings
							folderPath={path}
							settings={settings}
							updateSettings={updateSettings}
						/>
					</Center>
				</Grid>
			)}
		</Stack>
	);
};

export default AdminPage;
