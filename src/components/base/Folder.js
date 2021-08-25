import { AspectRatio } from "@chakra-ui/layout";
import { Subtitle } from "./Typography.js";

const Folder = ({ path, children, navigate }) => {
	const folderName = path.split("/").pop();

	return (
		<a href={path} onClick={navigate(path)}>
			<AspectRatio
				w="100%"
				bg="brand.blue"
				color="brand.yellow"
				_hover={{ bg: "brand.yellow", color: "brand.blue" }}
			>
				<Subtitle>{children || folderName}</Subtitle>
			</AspectRatio>
		</a>
	);
};
export default Folder;
