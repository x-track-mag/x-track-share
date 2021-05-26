import APIClient from "../../lib/services/APIClient.js";
import { withEventBus } from "../../components/EventBusProvider.js";
import CloudinaryFolder from "../../components/CloudinaryFolder.js";
import { withShareContext } from "../../components/ShareContextProvider.js";

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
			sharedOptions,
			path: uid.join("/")
		}
	};
};

export default withEventBus(withShareContext(CloudinaryFolder));
