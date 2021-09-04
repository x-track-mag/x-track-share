import { Checkbox } from "@chakra-ui/checkbox";
import { Stack } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import APIClient from "../lib/services/APIClient";

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
	const [sharedSettings, setSharedSettings] = useState(settings);

	const toggle = (code) => (evt) => {
		sharedSettings[code] = !sharedSettings[code];

		// Some options are in  fact exclusives from each other
		if (sharedSettings.download_links || sharedSettings.download_zip) {
			sharedSettings.download_form = false;
		} else if (sharedSettings.download_form) {
			sharedSettings.download_links = sharedSettings.download_zip = false;
		}
		setSharedSettings({
			...sharedSettings
		});
		APIClient.post("/api/settings/" + folderPath, { settings: sharedSettings });
	};

	useEffect(() => {
		console.log("Re-rendering setting choices");
	}, [sharedSettings]);

	return (
		<Stack>
			{Object.keys(SHARE_OPTIONS).map((code, i) => (
				<Checkbox
					name={code}
					key={code}
					value={code}
					isChecked={sharedSettings[code]}
					onChange={toggle(code)}
				>
					{SHARE_OPTIONS[code]}
				</Checkbox>
			))}
		</Stack>
	);
};

export default SharedSettings;
