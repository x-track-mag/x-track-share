import APIClient from "../../lib/services/APIClient.js";
import CloudinaryExplorer from "../../components/CloudinaryExplorer.js";
import { withEventBus } from "../../components/EventBusProvider.js";

/**
 * Render a single share folder
 * @param {Object} props
 */
const SharePage = (props) => <CloudinaryExplorer {...props} />;

/**
 * Retrieve the folder content /share/${uid}
 */
export const getServerSideProps = async ({ params }) => {
	const uid = params.uid;
	const folders = await APIClient.get(`/api/share/${uid}`);

	return {
		props: {
			folders,
			path: uid
		}
	};
};

export default withEventBus(SharePage);
