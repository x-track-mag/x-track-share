import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Center, Container } from "@chakra-ui/react";
import prettyBytes from "pretty-bytes";
import { UploadIcon } from "../icons";
import { Info } from "../base/Typography";
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
	updateProgress({ progress: undefined }, i); // We will use the undefined state before the upload actually begins

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
			{files.map(({ fileName, progress, error }, i) => (
				<FileUploadProgress
					key={`file-${i}`}
					fileName={fileName}
					progress={progress}
					color="blue"
					error={error}
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

	// Call this to re-display the list of uploaded files
	const updateProgress = (files) => (progressInfo, i) => {
		const f = files[i];
		Object.assign(f, progressInfo);

		// Update the remaining files count.
		// NOTE : We can not use directly the `pending` variable here because it's in a closure
		// It doesn't reflect its updated state
		if (f.error || f.progress === 100) {
			const remaining = files.reduce(
				(remaining, file) =>
					file.progress === 100 || file.error ? remaining - 1 : remaining,
				files.length
			);

			setPending(remaining);
		}

		setFiles([...files]); // duplicate the array of files to re-render everything
	};

	// React Drop zone
	const onDrop = useCallback(async (acceptedFiles) => {
		// Create a new array to map only the file progression
		const filesProgression = acceptedFiles.map((f, i) => ({
			fileName: `${f.name} (${prettyBytes(f.size)})`,
			progress: 0,
			error: false
		}));
		console.log(`Received #${filesProgression.length} files to upload`);

		setPending(filesProgression.length);
		setFiles(filesProgression); // for the progress report

		const start = Date.now();
		const jobQueue = JobQueue({
			worker: sendFile(upload_url, updateProgress(filesProgression)),
			concurrency: 8
		});
		const result = await jobQueue.runBatch(acceptedFiles);
		setPending(0);
		console.log(
			`${filesProgression.length} uploaded in ${(Date.now() - start) / 1000}secs`,
			result
		);
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
