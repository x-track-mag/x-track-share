import APIClient from "../../lib/services/APIClient.js";
import CloudinaryFolder from "../../components/CloudinaryFolder.js";
import { withEventBus } from "../../components/EventBusProvider.js";

/**
 * Render a single share folder
 * @param {Object} props
 */
const SharePage = (props) => <CloudinaryFolder {...props} />;

/**
 * Retrieve the folder content /share/${uid}
 */
export const getServerSideProps = async ({ params }) => {
	const uid = params.uid;
	const props = await APIClient.get(`/api/share/${uid}`);
	return { props };
};

export default withEventBus(SharePage);
