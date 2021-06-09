import Email from "./inputs/Email.js";
import Submit from "./inputs/Submit.js";
import Text from "./inputs/Text.js";
import ValidatingForm from "./validation/ValidatingForm.js";

const DownloadForm = ({ action }) => (
	<ValidatingForm action={action}>
		<Text name="fullName" required={true} />
		<Email name="email" required={true} />
		<Text name="message" rows={5} />
		<Submit>Télécharger</Submit>
	</ValidatingForm>
);

export default DownloadForm;
