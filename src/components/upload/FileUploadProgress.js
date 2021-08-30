import { Box, Progress } from "@chakra-ui/react";

/**
 * @typedef FileUploadProgressProps
 * @property {String} fileName
 * @property {String} color
 * @property {Number} [progress=0]
 * @property {String} [error]
 */

/**
 * Render the current upload progression of a file
 * @param {FileUploadProgressProps} props
 */
const FileUploadProgress = ({
	fileName,
	color = "white",
	progress,
	error = false,
	...props
}) => (
	<Box w="100%" {...props}>
		<em>{fileName}</em>
		<Progress
			size="sm"
			value={error ? 100 : progress}
			min={0}
			max={100}
			colorScheme={error ? "red" : color}
		/>
		{error && <code>{error}</code>}
	</Box>
);

export default FileUploadProgress;
