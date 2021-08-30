import APIClient from "../../lib/services/APIClient.js";
import { Box, Stack, Grid } from "@chakra-ui/layout";
import Breadcrumbs from "../../components/Breadcrumbs.js";
import Folder from "../../components/base/Folder.js";
import { Bin, PlusIcon } from "../../components/icons";
import { useRouter } from "next/router";

/**
 * Retrieves the subfolders and playlist linked to this shared folder
 * @param {Object} param0
 * @returns { props } to fill the page component
 */
export const getServerSideProps = async ({ params }) => {
	const parts = params.parts || [""];
	const folderPath = parts.join("/");

	const props = await APIClient.get(`/api/admin/${folderPath}`);
	console.log(`getServerSideProps(${folderPath}) returned`, props);

	return {
		props
	};
};

const deleteFolder = (folderPath, refresh) => async (evt) => {
	evt.stopPropagation();
	if (confirm(`Do you confirm the suppression of folder ${folderPath} ?`)) {
		await APIClient.del(`/api/admin/${folderPath}`);
		refresh();
	}
};

const deleteIcon = (path, refresh) => (
	<Bin size="1rem" onClick={deleteFolder(path, refresh)} />
);

/**
 * Display the admin view of a shared folder
 */
const AdminPage = ({ path, subfolders = [], playlist = [] }) => {
	const uploadPath = `/_admin/upload/${path}`;
	const router = useRouter();
	const reloadPage = () => router.reload(`/_admin/${path}`);
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
				{subfolders.map(({ name, path }) => (
					<Folder
						key={name}
						path={`/_admin/${path}`}
						icons={[deleteIcon(path, reloadPage)]}
					/>
				))}
			</Grid>
		</Stack>
	);
};

export default AdminPage;
