import APIClient from "../../lib/services/APIClient.js";
import { withEventBus } from "../../components/EventBusProvider.js";
import CloudinaryAdminFolder from "../../components/CloudinaryAdminFolder.js";

/**
 * Retrieve the folder content /share/${uid}
 */
export const getServerSideProps = async ({ params }) => {
	const { parts } = params;
	const folderPath = parts.join("/");

	const props = await APIClient.get(`/api/admin/${folderPath}`);
	console.log(`getServerSideProps(${folderPath}) returned`, props);

	return {
		props
	};
};

export default withEventBus(CloudinaryAdminFolder);
