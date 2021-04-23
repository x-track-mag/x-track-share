import CloudinaryClient from "../../lib/services/CloudinaryClient";

/**
 * Render a single static pages (simplified version of a post)
 * @param {JSX.Element} props
 */
const SharePage = ({ audios, videos }) => {};

/**
 */
export const getStaticProps = async ({ params, preview }) => {
	const uid = params.uid;
	const { ...pageProps } = await CloudinaryClient.getFolders();
	return {
		props: { ...pageProps }
	};
};

/**
 */
export const getStaticPaths = () => {
	const paths = [];
	return {
		paths,
		fallback: false
	};
};

export default SharePage;
