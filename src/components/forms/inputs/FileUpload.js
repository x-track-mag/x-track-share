import { Center } from "@chakra-ui/layout";
import { useDropzone } from "react-dropzone";
import { createRef, useCallback, useState } from "react";
import { UploadIcon } from "../../icons";
import { Box } from "@chakra-ui/react";
import { Info } from "../../base/Typography";
import pLimit from "@lib/utils/p-limit.js";

/**
 * @typedef FileUploadProps
 * @property {String} label The field label
 * @property {Number} [maxFiles] How many files are allowed for upload ?
 */

/**
 * Upload a single file
 * @param {String} uploadUrl
 * @returns {Function}
 */
const sendFile = (uploadUrl) => async (file) => {
	let formData = new FormData();
	formData.append("file", file);
	console.log(`Uploading ${file.name}`);

	return fetch(uploadUrl, {
		method: "POST",
		body: formData
	});
};

const noop = () => {};

/**
 * Drag and drop file uploader
 * @param {FileUploadProps} props -
 */
const FileUpload = ({
	label = "Drag files or folder here...",
	upload_url,
	concurrency = 3,
	callback = noop
}) => {
	const [files, setFiles] = useState([]);
	const limit = pLimit(concurrency);

	// Find the form validation context to register our input
	const inputRef = createRef();

	const onDrop = useCallback((acceptedFiles) => {
		// Do something with the files
		console.log("Received some files", acceptedFiles);
		setFiles(acceptedFiles);

		Promise.all(
			acceptedFiles.map((f) => {
				return limit(sendFile(upload_url), f);
			})
		)
			.then((status) => {
				console.log("All files have been uploaded");
				callback(status);
			})
			.catch(console.error);
	}, []);

	// @see
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
	return (
		<Center>
			<Box
				{...getRootProps()}
				bg="#222"
				borderStyle="double"
				borderColor="blue"
				borderWidth="10px"
				w="100%"
				h="100%"
				padding="2rem"
				margin="2rem"
				maxW="1200px"
				position="relative"
			>
				{files.length ? (
					files.map((file, i) => <Info key={`file-${i}`}>{file.name}</Info>)
				) : isDragActive ? (
					<Info>You can drop the files now</Info>
				) : (
					<Info>{label}</Info>
				)}
				<Center>
					<UploadIcon
						color="yellow"
						bgColor="blue"
						size={{ sm: "64px", md: "128px" }}
					/>
				</Center>
			</Box>
		</Center>
	);
};

export default FileUpload;
