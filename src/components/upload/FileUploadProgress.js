import { Box, Progress } from "@chakra-ui/react";

/**
 * @typedef FileUploadProgressProps
 * @property {String} fileName
 * @property {String} color
 * @property {Number} [progress=0]
 * @property {Boolean} [error=false]
 */

/**
 * Render the current upload progression of a file
 * @param {FileUploadProgressProps} props
 */
const FileUploadProgress = ({
	fileName,
	color = "white",
	progress = 0,
	error = false
}) => (
	<Box w="100%">
		<em>{fileName}</em>
		<Progress size="sm" value={progress} colorScheme={error ? "red" : color} />
	</Box>
);

export default FileUploadProgress;
