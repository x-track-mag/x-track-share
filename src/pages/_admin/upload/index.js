import FileUpload from "../../../components/forms/inputs/FileUpload.js";
import withAuth from "../../../components/auth/withAuth.js";

const UploadPage = () => <FileUpload />;

export default withAuth(UploadPage);
