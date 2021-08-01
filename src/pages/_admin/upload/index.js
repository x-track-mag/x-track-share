import { Box } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Info } from "../../../components/base/Typography";

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

const UploadPage = ({ label }) => {
	const [files, setFiles] = useState([]);
	const onDrop = useCallback((acceptedFiles) => {
		// Do something with the files
		setFiles(acceptedFiles);
	}, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<Box
			borderStyle="dashed"
			borderColor="blue"
			borderWith="6px"
			bg="#333"
			m="2rem"
			p="2rem"
			minW="960px"
			h="50vh"
			{...getRootProps()}
		>
			{isDragActive ? (
				<Info>Vous pouvez déposer les fichier</Info>
			) : (
				<Info>{label}</Info>
			)}

			{files.length && files.map((file) => <Info>{file.name}</Info>)}
		</Box>
	);
};

export default UploadPage;
