import FileUpload from "../../../components/forms/inputs/FileUpload.js";
import withAuth from "../../../components/auth/withAuth.js";

const UploadPage = () => <FileUpload upload_url="/api/upload" />;

export default withAuth(UploadPage);
