import { Checkbox } from "@chakra-ui/checkbox";
import { Stack } from "@chakra-ui/layout";
import { useEffect } from "react";
import { SHARED_SETTINGS_DEFAULTS } from "../lib/cloudinary/SharedFolder";

const SHARE_OPTIONS = {
	download_links: "Téléchargement Individuel",
	download_zip: "Tout Télécharger",
	download_form: "Sélection + Formulaire"
};

/**
 * @typedef SharedSettingsProps
 * @property {Object} settings Current share settings
 * @property {Function} updateSettings callback
 */
/**
 * Display the mini settings form for a shared folder
 * @param {SharedSettingsProps} props
 */
const SharedSettings = ({ settings = SHARED_SETTINGS_DEFAULTS, updateSettings }) => {
	const toggle = (code) => (evt) => {
		settings[code] = !settings[code];

		// Some options are in fact exclusives from each other
		if (settings[code] === true) {
			switch (code) {
				case "download_links":
				case "download_zip":
					settings.download_form = false;
					break;
				case "download_form":
					settings.download_links = settings.download_zip = false;
			}
		}

		updateSettings(settings);
	};

	useEffect(() => {
		console.log("Re-rendering setting choices", settings);
	}, [settings]);

	return (
		<Stack>
			<h3>PARAMETRES</h3>
			{Object.keys(SHARE_OPTIONS).map((code, i) => (
				<Checkbox
					name={code}
					key={code}
					value={code}
					isChecked={Boolean(settings[code])}
					onChange={toggle(code)}
				>
					{SHARE_OPTIONS[code]}
				</Checkbox>
			))}
		</Stack>
	);
};

export default SharedSettings;
