import { Box, Center, Grid, Stack } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { useDialogContext } from "../../components/base/Dialog.js";
import Folder from "../../components/base/Folder.js";
import Breadcrumbs from "../../components/Breadcrumbs.js";
import { Bin, PlusIcon } from "../../components/icons";
import MiniPlayer from "../../components/player/MiniPlayer.js";
import MiniPlaylist from "../../components/player/MiniPlaylist.js";
import SharedSettings from "../../components/SharedSettings.js";
import APIClient from "../../lib/services/APIClient.js";

/**
 * Retrieves the subfolders and playlist linked to this shared folder
 * @param {Object} param0
 * @returns { props } to fill the page component
 */
export const getServerSideProps = async ({ params }) => {
	const parts = params.parts || [""];
	const folderPath = parts.join("/");

	const props = await APIClient.get(`/api/folders/${folderPath}`);
	console.log(`getServerSideProps(${folderPath}) returned`, props);

	return {
		props
	};
};

const deleteIcon = (action) => <Bin size="1rem" onClick={action} />;

/**
 * Display the admin view of a shared folder
 */
const AdminPage = ({ path, subfolders = [], tracks = [], settings = {} }) => {
	const uploadPath = `/_admin/upload/${path}`;
	const [vFolders, setVFolders] = useState();
	const { confirm } = useDialogContext();

	useEffect(() => {
		// Replace the real subfolder list by the virtual one
		setVFolders(subfolders);
	}, [subfolders]);

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
					<PlusIcon />
				</Folder>
				{vFolders &&
					vFolders.map(({ name, path }) => (
						<Folder
							key={name}
							path={`/_admin/${path}`}
							icons={[deleteIcon(deleteFolder(path))]}
						/>
					))}
			</Grid>
			<Grid templateColumns={{ sm: "1fr", lg: "60% 40%" }} color="white">
				<MiniPlaylist tracks={tracks} />
				<Center>
					<SharedSettings settings={settings} folderPath={path} />
				</Center>
			</Grid>
		</Stack>
	);
};

export default AdminPage;
