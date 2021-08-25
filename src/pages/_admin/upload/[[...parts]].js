import FileUpload from "../../../components/forms/inputs/FileUpload.js";
import withAuth from "../../../components/auth/withAuth.js";
import { Subtitle } from "../../../components/base/Typography.js";
import { useRouter } from "next/router";

const UploadPage = () => {
	const router = useRouter();
	const { parts = [""] } = router.query;
	const folderPath = parts.join("/");

	return (
		<>
			<Subtitle>Upload to /{folderPath}</Subtitle>
			<FileUpload upload_url={`/api/upload/${folderPath}`} />
		</>
	);
};

export default withAuth(UploadPage);
