import APIClient from "../../lib/services/APIClient.js";
import { withEventBus } from "../../components/EventBusProvider.js";
import CloudinaryAdminFolder from "../../components/CloudinaryAdminFolder.js";

/**
 * Retrieve the folder content /share/${uid}
 */
export const getServerSideProps = async ({ params }) => {
	const uid = params.uid;
	console.log(`getServerSideProps(${uid.join("/")})`);

	const { folders, sharedOptions } = await APIClient.get(`/api/share/${uid[0]}`);

	return {
		props: {
			folders,
			editMode: true,
			sharedOptions,
			path: uid.join("/")
		}
	};
};

export default withEventBus(CloudinaryAdminFolder);
