import FileUpload from "../../../components/forms/inputs/FileUpload.js";
import withAuth from "../../../components/auth/withAuth.js";
import { Subtitle } from "../../../components/base/Typography.js";
import { useRouter } from "next/router";

const UploadPage = () => {
	const router = useRouter();
	const { path = [""] } = router.query;
	const joinedPath = path.join("/");

	return (
		<>
			<Subtitle>Upload to /{joinedPath}</Subtitle>
			<FileUpload upload_url={`/api/upload/share/${joinedPath}`} />
		</>
	);
};

export default withAuth(UploadPage);
