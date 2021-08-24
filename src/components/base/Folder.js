import { AspectRatio } from "@chakra-ui/layout";
import { useSharedFolderContext } from "../SharedFolderContext.js";
import { Subtitle } from "./Typography.js";

const Folder = ({ path }) => {
	const folderName = path.split("/").pop();
	const { navigate } = useSharedFolderContext();

	return (
		<a href={path} onClick={navigate(path)}>
			<AspectRatio
				w="100%"
				bg="brand.blue"
				color="brand.yellow"
				_hover={{ bg: "brand.yellow", color: "brand.blue" }}
			>
				<Subtitle>{folderName}</Subtitle>
			</AspectRatio>
		</a>
	);
};
export default Folder;
