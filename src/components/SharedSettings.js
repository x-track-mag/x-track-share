import APIClient from "../lib/services/APIClient";
import CheckBoxes from "./forms/inputs/CheckBoxes";
import {
	useFormValidationContext,
	withFormValidationContext
} from "./forms/validation/FormValidationProvider";

const SHARE_OPTIONS = {
	download_links: "Téléchargement Individuel",
	download_zip: "Tout Télécharger",
	download_form: "Sélection + Formulaire"
};
const SHARE_OPTIONS_DEFAULTS = {
	download_links: false,
	download_zip: false,
	download_form: false
};

/**
 * @typedef SharedSettingsProps
 * @property {String} folderPath The path to the folder
 * @property {Object} settings Current share settings
 */
/**
 * Display the mini settings form for a shared folder
 */
const SharedSettings = ({ folderPath, settings = SHARE_OPTIONS_DEFAULTS }) => {
	const { getData } = useFormValidationContext({ data: { settings } });
	const submitOnChange = () => {
		const settings = getData("settings");
		APIClient.post("/api/settings/" + folderPath, { settings });
	};

	return (
		<CheckBoxes
			name="settings"
			onChange={submitOnChange}
			defaultValue={settings}
			options={SHARE_OPTIONS}
			serialization="object"
			columns={1}
		/>
	);
};

export default withFormValidationContext(SharedSettings);
