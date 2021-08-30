import { createRef, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Center, Container } from "@chakra-ui/react";
import { UploadIcon } from "../icons";
import { Info } from "../base/Typography";
import pLimit from "@lib/utils/p-limit.js";
import FileUploadProgress from "./FileUploadProgress";

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
const sendFile = (uploadUrl, updateProgress) => async (file, i) => {
	let formData = new FormData();
	formData.append("file", file);
	console.log(`Uploading ${file.name}`);
	file.progress = undefined; // We will use the undefined state when upload actueally begins
	updateProgress(file, i);

	try {
		await fetch(uploadUrl, {
			method: "POST",
			body: formData
		});
		file.progress = 100;
		updateProgress(file, i);
	} catch (err) {
		file.error = err.message;
		updateProgress(file, i);
	}
	return true; //
};

const FileUploadReport = ({ files }) => (
	<Box className="upload-report">
		{files.map((file, i) => (
			<FileUploadProgress
				key={`file-${i}`}
				fileName={file.name}
				progress={file.progress}
				error={file.error}
			/>
		))}
	</Box>
);

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

	const updateProgress = (f, i) => {
		files[i] = f;
		setFiles([...files]); // duplicate the array of files to re-render
		console.log(`File ${f.name} as been updated : ${f.progress}, ${f.error}`);
	};

	// React Drop zone
	const onDrop = useCallback((acceptedFiles) => {
		// Do something with the files
		console.log("Received some files", acceptedFiles);
		setFiles(
			acceptedFiles.map((f) => ({
				...f,
				progress: 0,
				error: false
			}))
		);

		Promise.all(
			acceptedFiles.map((f, i) => {
				return limit(sendFile(upload_url, updateProgress), f, i);
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
		<Container maxW="container.xl">
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
					{isDragActive ? (
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
			<FileUploadReport files={files} />
		</Container>
	);
};

export default FileUpload;
