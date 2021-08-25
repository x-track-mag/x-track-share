import APIClient from "../../lib/services/APIClient.js";
import EventBusProvider from "@components/EventBusProvider.js";
import { Box, Stack, Grid } from "@chakra-ui/layout";
import Folder from "@components/base/Folder";
import { PlusIcon } from "@components/icons";
import Breadcrumbs from "@components/Breadcrumbs";

/**
 * Display the admin view of a shared folder
 */
export const getServerSideProps = async ({ params }) => {
	const folderPath = params.parts.join("/");

	const props = await APIClient.get(`/api/admin/${folderPath}`);
	console.log(`getServerSideProps(${folderPath}) returned`, props);

	return {
		props
	};
};

export default ({ path, subfolders, playlist }) => {
	const navigate = (path) => {};
	return (
		<EventBusProvider>
			<Stack className="folder-content" minH="100vh" margin="0 1rem">
				<Box className="navigation-header" as="header">
					<Breadcrumbs path={path} navigate={navigate} />
				</Box>

				<Grid
					templateColumns={{ sm: "repeat(2, 1fr)", lg: "repeat(6, 1fr)" }}
					className="sub-folders"
					gap={5}
					p={5}
				>
					<Folder key="upload" path={path} navigate={navigate}>
						<PlusIcon />
					</Folder>
					{subfolders.map(({ name, path }) => (
						<Folder key={name} path={path} navigate={navigate} />
					))}
				</Grid>
			</Stack>
		</EventBusProvider>
	);
};
