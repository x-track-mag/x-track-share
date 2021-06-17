import { Center, FormHelperText } from "@chakra-ui/react";
import { useState } from "react";
import APIForm from "./APIForm.js";
import Email from "./inputs/Email.js";
import Hidden from "./inputs/Hidden.js";
import SelectBox from "./inputs/SelectBox.js";
import Submit from "./inputs/Submit.js";
import Text from "./inputs/Text.js";

const DownloadForm = ({ selectedTracks, ...props }) => {
	const [downloadUrl, setDownloadUrl] = useState();

	const onSuccess = ({ downloadUrl }) => setDownloadUrl(downloadUrl);
	const options = ["wav", "mp3", "m4a", "ogg"];

	return (
		<>
			{!downloadUrl && (
				<APIForm
					action="/api/download/all"
					onSuccess={onSuccess}
					h="100%"
					w="100%"
					{...props}
				>
					<FormHelperText color="white">
						Indiquez quelques informations sur votre projet si vous le
						désirez, choisissez le format et cliquez sur Télécharger pour
						obtenir le lien.
					</FormHelperText>
					<Text name="fullName" label="Votre nom" />
					<Email name="email" />
					<Text name="message" rows={5} />
					<SelectBox
						name="format"
						label="Choisissez le format approprié"
						options={options}
						defaultValue="wav"
						required={true}
					/>
					<Hidden
						name="public_ids"
						defaultValue={selectedTracks.audios.map((t) => t.public_id)}
					/>
					<Submit bgColor="blue" color="yellow">
						Télécharger
					</Submit>
				</APIForm>
			)}
			{downloadUrl && (
				<Center h="100%">
					<a
						href={downloadUrl}
						download={`playlist-x-track-${new Date()
							.toISOString()
							.substr(0, 19)}.zip`}
					>
						Cliquez ici pour télécharger
					</a>
				</Center>
			)}
		</>
	);
};

export default DownloadForm;
