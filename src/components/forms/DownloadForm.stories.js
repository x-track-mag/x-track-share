import DownloadForm from "./DownloadForm";
import { FormValidationProvider } from "./validation/FormValidationProvider";

export default {
	title: "Download Form"
};

export const DownloadFormDemo = () => (
	<FormValidationProvider>
		<Box bgColor="black" w="100%" h="100%">
			<DownloadForm links={[]} />;
		</Box>
	</FormValidationProvider>
);
