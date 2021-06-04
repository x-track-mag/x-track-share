import Email from "./inputs/Email.js";
import Text from "./inputs/Text.js";
import ValidatingForm from "./validation/ValidatingForm.js";

const DownloadForm = ({ action }) => (
	<ValidatingForm action={action}>
		<Text name="fullName" required={true} />
		<Email name="email" required={true} />
	</ValidatingForm>
);

export default DownloadForm;
