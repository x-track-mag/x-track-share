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
	const [sharedSettings, setSharedSettings] = useState(SHARE_OPTIONS_DEFAULTS);

	const toggle = (code) => (evt) => {
		sharedSettings[code] = !sharedSettings[code];

		// Some options are in  fact exclusives from each other
		if (sharedSettings[code] === true) {
			switch (code) {
				case "download_links":
				case "download_zip":
					sharedSettings.download_form = false;
					break;
				case "download_form":
					sharedSettings.download_links = sharedSettings.download_zip = false;
			}
		}
		setSharedSettings({
			...sharedSettings
		});
		console.log("Post new settings", sharedSettings);
		APIClient.post("/api/settings/" + folderPath, { settings: sharedSettings });
	};

	useEffect(() => {
		setSharedSettings(settings);
		console.log("Re-rendering setting choices", sharedSettings);
	}, [settings]);

	return (
		<Stack>
			<h3>PARAMETRES</h3>
			{Object.keys(SHARE_OPTIONS).map((code, i) => (
				<Checkbox
					title={folderPath}
					name={code}
					key={code}
					value={code}
					isChecked={Boolean(sharedSettings[code])}
					onChange={toggle(code)}
				>
					{SHARE_OPTIONS[code]}
				</Checkbox>
			))}
		</Stack>
	);
};

export default SharedSettings;
