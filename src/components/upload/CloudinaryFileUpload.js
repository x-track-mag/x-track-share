import { Box, Center, Container } from "@chakra-ui/react";
import prettyBytes from "pretty-bytes";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { createPublicId, getResourceType } from "../../lib/utils/Cloudinary";
import JobQueue from "../../lib/utils/JobQueue";
import { Info } from "../base/Typography";
import Button from "../forms/inputs/Button";
import { UploadIcon } from "../icons";
import FileUploadProgress from "./FileUploadProgress";

/**
 * @typedef FileUploadProps
 * @property {String} label The field label
 */

/**
 * Upload a single file
 * @param {String} uploadUrl
 * @return {Function}
 */
const sendFile = (uploadPath, updateProgress) => async (file, i, retries) => {
	// const folderPath = uploadPath + file.path.substr(1, file.path.lastIndexOf("/"));
	const public_id = createPublicId(uploadPath + file.path);

	// const timestamp = Math.round(new Date().getTime() / 1000);
	const upload_preset = "x-track-share";

	const resource_type = getResourceType(file.path);
	const upload_url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resource_type}/upload`;

	let formData = new FormData();
	// @see https://cloudinary.com/documentation/image_upload_api_reference#required_parameters
	formData.append("file", file);
	formData.append("upload_preset", upload_preset);
	formData.append("public_id", public_id);
	// formData.append("timestamp", timestamp);

	// const {signature, uploadUrl} = await APIClient.post("/api/cloudinary/upload-url", {
	// 	file: file.path,
	// 	public_id,
	// 	timestamp
	// });
	// // Append parameters to the form data. The parameters that are signed using
	// // the signing function (signuploadform) need to match these.
	// // formData.append("api_key", credentials.apikey);
	// // formData.append("timestamp", credentials.timestamp);
	// formData.append("signature", signature);

	updateProgress({ progress: 40 - 10 * retries }, i); // We will use the undefined state before the upload actually begins

	fetch(upload_url, {
		method: "POST",
		body: formData
	})
		.then((resp) => resp.text)
		.then((text) => {
			try {
				return JSON.parse(text);
			} catch (err) {
				return text;
			}
		})
		.then((result) => {
			updateProgress({ progress: 100, error: false }, i);
		})
		.catch((err) => {
			updateProgress({ error: err.message }, i);
			throw new Error(err);
		});
};

const FileUploadReport = ({ files }) => {
	return (
		<Box className="upload-report" pl={8} pr={8}>
			{files.map(({ fileName, progress = 0, error }, i) => (
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
const CloudinaryFileUpload = ({
	label = "Drag files or folder here...",
	uploadPath,
	concurrency = 8,
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
			worker: sendFile(uploadPath, updateProgress(filesProgression)),
			concurrency: 8
		});
		const results = await jobQueue.runBatch(acceptedFiles);

		const [uploaded = [], failed = []] = results.partition((job) => job.success);
		console.log(
			`${uploaded.length} files were successfully uploaded. ${
				failed.length
			} files were rejected. 
Total process completed in ${(Date.now() - start) / 1000}secs`,
			results
		);

		if (failed.length > 0) {
			confirm(`${failed.length} échecs`);
		}
		setPending(0);
		jobQueue.clear(); // Why not ?
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

export default CloudinaryFileUpload;
