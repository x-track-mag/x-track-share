import CloudinaryClient from "../../lib/services/CloudinaryClient.js";
import CloudinaryFolder from "../../components/CloudinaryFolder.js";

/**
 * Render a single share folder
 * @param {Object} props
 */
const SharePage = (props) => <CloudinaryFolder {...props} />;

/**
 * Retrieve the folder conte/share/${uid}
 */
export const getServerSideProps = async ({ params }) => {
	const uid = params.uid;
	const props = await CloudinaryClient.getContent(`share/${uid}`);
	return {
		props
	};
};

export default SharePage;
