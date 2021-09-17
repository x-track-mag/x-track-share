import { Box, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Breadcrumbs from "../../../components/Breadcrumbs.js";
import CloudinaryFileUpload from "../../../components/upload/CloudinaryFileUpload.js";

/**
 * Join every parts of the dynamic path
 */
export const getServerSideProps = async ({ params }) => {
	const parts = params.parts || [""];

	return {
		props: {
			folderPath: parts.join("/")
		}
	};
};

/**
 * Display the upload page at /_admin/upload/[more]/[things]/[here]..
 * Files are send to          /api/upload/[same]/[things]/[here]..
 */
const UploadPage = ({ folderPath }) => {
	const router = useRouter();
	const comeBack = () => {
		router.push(`/_admin/${folderPath}`);
	};
	return (
		<VStack className="folder-content" minH="100vh" margin="0 1rem" align="stretch">
			<Box className="navigation-header" as="header">
				<Breadcrumbs
					root="/_admin"
					path={folderPath}
					linkLeaf={true}
					linkRoot="Share"
				>
					Upload&nbsp;to&nbsp;
				</Breadcrumbs>
			</Box>
			<CloudinaryFileUpload uploadPath={folderPath} callback={comeBack} />
		</VStack>
	);
};

// export default withAuth(UploadPage);
export default UploadPage;
