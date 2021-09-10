import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Center, Container } from "@chakra-ui/react";
import prettyBytes from "pretty-bytes";
import { UploadIcon } from "../icons";
import { Info } from "../base/Typography";
// import pLimit from "@lib/utils/p-limit.js";
import FileUploadProgress from "./FileUploadProgress";
import Button from "../forms/inputs/Button";
import JobQueue from "../../lib/utils/JobQueue";

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
	const folderPath = file.path.substr(1, file.path.lastIndexOf("/"));
	console.log(`Uploading ${file.name} to ${folderPath}`);
	file.progress = undefined; // We will use the undefined state when upload actually begins
	updateProgress({ progress: undefined }, i);

	try {
		await fetch(`${uploadUrl}${folderPath}`, {
			method: "POST",
			body: formData
		});
		updateProgress({ progress: 100 }, i);
		return true; //
	} catch (err) {
		updateProgress({ error: err.message }, i);
		return false;
	}
};

const FileUploadReport = ({ files }) => {
	return (
		<Box className="upload-report" pl={8} pr={8}>
			{files.map((file, i) => (
				<FileUploadProgress
					key={`file-${i}`}
					fileName={file.name}
					progress={file.progress}
					color="blue"
					error={file.error}
				/>
			))}
		</Box>
	);
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
	const [pending, setPending] = useState(true);
	// const limit = pLimit(concurrency);

	// Call this to re-display the list of uploaded files
	const updateProgress = ({ ...progressInfo }, i) => {
		const { error, progress } = (files[i] = { ...files[i], ...progressInfo }); // new instance

		// Update the remaining files count.
		// NOTE : We can not use directly the `pending` variable here because it's in a closure
		// And doesn't reflect its updated state
		if (error || progress === 100) {
			const remaining = files.reduce(
				(remaining, file) =>
					file.progress === 100 || file.error ? remaining - 1 : remaining,
				files.length
			);

			setPending(remaining);
		}

		setFiles([...files]); // duplicate the array of files to re-render
	};

	// React Drop zone
	const onDrop = useCallback(async (acceptedFiles) => {
		// Map the files to display only upload tracking infos
		console.log(`Received #${acceptedFiles.length} files`, acceptedFiles);

		const uploadProgress = acceptedFiles.map((f, i) => ({
			fileName: `${f.name} (${prettyBytes(f.size)})`,
			progress: 0,
			error: false
		}));

		setFiles(uploadProgress); // for the progress report
		setPending(uploadProgress.length);

		const jobQueue = JobQueue({ worker: sendFile(upload_url, updateProgress) });
		await jobQueue.runBatch(acceptedFiles);

		alert();

		// await Promise.allSettled(
		// 	acceptedFiles.map((f, i) => {
		// 		limit(sendFile(upload_url, updateProgress), f, i, pending);
		// 	})
		// );
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
			<Center>
				{pending === 0 && (
					<Button onClick={callback} mt={4}>
						RETOUR
					</Button>
				)}
			</Center>
		</Container>
	);
};

export default FileUpload;
