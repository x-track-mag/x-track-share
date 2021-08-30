import FileUploadProgress from "./FileUploadProgress";

export const SimpleFileUploadProgress = ({ ...props }) => (
	<FileUploadProgress {...props} />
);

export default {
	component: FileUploadProgress,
	title: "File Upload Progress",
	args: {
		fileName: "File Name",
		progress: 0,
		error: "",
		color: ""
	},
	argTypes: {
		fileName: { control: { type: "text" } },
		progress: { control: { type: "number" } },
		color: { control: { type: "text" } },
		error: { control: { type: "text" } }
	}
};
