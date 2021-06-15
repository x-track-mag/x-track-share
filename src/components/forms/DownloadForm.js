import { useState } from "react";
import APIForm from "./APIForm.js";
import Email from "./inputs/Email.js";
import Hidden from "./inputs/Hidden.js";
import Submit from "./inputs/Submit.js";
import Text from "./inputs/Text.js";

const DownloadForm = ({ selectedTracks, ...props }) => {
	const [downloadUrl, setDownloadUrl] = useState();

	const onSuccess = ({ downloadUrl }) => setDownloadUrl(downloadUrl);

	return (
		<>
			{!downloadUrl && (
				<APIForm action="/api/download/all" onSuccess={onSuccess} {...props}>
					<Text name="fullName" />
					<Email name="email" />
					<Text name="message" rows={5} />
					<Hidden
						name="public_ids"
						defaultValue={JSON.stringify(
							selectedTracks.audios.map((t) => t.public_id)
						)}
					/>
					<Submit bgColor="blue" color="yellow">
						Télécharger
					</Submit>
				</APIForm>
			)}
			{downloadUrl && (
				<a
					href={downloadUrl}
					download={`playlist-x-track-${new Date()
						.toISOString()
						.substr(0, 19)}.zip`}
				>
					Votre lien
				</a>
			)}
		</>
	);
};

export default DownloadForm;
