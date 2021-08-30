import APIClient from "../../lib/services/APIClient.js";
import { Box, Stack, Grid } from "@chakra-ui/layout";
import Breadcrumbs from "../../components/Breadcrumbs.js";
import Folder from "../../components/base/Folder.js";
import { PlusIcon } from "../../components/icons";

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

/**
 * Display the admin view of a shared folder
 */
const AdminPage = ({ path, subfolders = [], playlist = [] }) => {
	const uploadPath = `/_admin/upload/${path}`;
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
					<Folder key={name} path={`/_admin/${path}`} />
				))}
			</Grid>
		</Stack>
	);
};

export default AdminPage;
