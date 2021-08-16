import FileUpload from "../../../components/forms/inputs/FileUpload.js";
import withAuth from "../../../components/auth/withAuth.js";

function uploadFile(file) {
	let url = "YOUR URL HERE";
	let formData = new FormData();

	formData.append("file", file);

	fetch(url, {
		method: "POST",
		body: formData
	})
		.then(() => {
			/* Done. Inform the user */
		})
		.catch(() => {
			/* Error. Inform the user */
		});
}

const UploadPage = () => <FileUpload />;

export default withAuth(UploadPage);
