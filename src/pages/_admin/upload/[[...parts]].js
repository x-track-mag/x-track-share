import FileUpload from "../../../components/forms/inputs/FileUpload.js";
import withAuth from "../../../components/auth/withAuth.js";
import Breadcrumbs from "../../../components/Breadcrumbs.js";
import { Box, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";

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
		router.push(`/admin/${forlderPath}`);
	};
	return (
		<Stack className="folder-content" minH="100vh" margin="0 1rem">
			<Box className="navigation-header" as="header">
				<Breadcrumbs prefix="/_admin" path={folderPath} linkLeaf={true}>
					Upload&nbsp;to&nbsp;
				</Breadcrumbs>
			</Box>
			<FileUpload upload_url={`/api/upload/${folderPath}`} callback={comeBack} />
		</Stack>
	);
};

export default withAuth(UploadPage);
