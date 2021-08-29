import withAuth from "../../../components/auth/withAuth.js";
import Breadcrumbs from "../../../components/Breadcrumbs.js";
import { Box, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import FileUpload from "../../../components/upload/FileUpload.js";

export const getServerSideProps = async ({ params }) => {
	const parts = params.parts || [""];

	const props = {
		folderPath: parts.join("/")
	};

	return {
		props
	};
};

const UploadPage = ({ folderPath }) => {
	const router = useRouter();
	const comeBack = () => {
		router.push(`/_admin/${folderPath}`);
	};
	return (
		<VStack className="folder-content" minH="100vh" margin="0 1rem" align="stretch">
			<Box className="navigation-header" as="header">
				<Breadcrumbs root="/_admin" path={folderPath} linkLeaf={true}>
					Upload&nbsp;to&nbsp;
				</Breadcrumbs>
			</Box>
			<FileUpload upload_url={`/api/upload/${folderPath}`} callback={comeBack} />
		</VStack>
	);
};

// export default withAuth(UploadPage);
export default UploadPage;
