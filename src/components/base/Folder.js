import { AspectRatio } from "@chakra-ui/layout";
import { VLink } from "./Link.js";
import { Subtitle } from "./Typography.js";

const Folder = ({ path, children, navigate }) => {
	const folderName = path.split("/").pop();
	const Link = VLink(navigate);

	return (
		<Link href={path}>
			<AspectRatio
				w="100%"
				bg="brand.blue"
				style={{ cursor: "pointer" }}
				color="brand.yellow"
				_hover={{ bg: "brand.yellow", color: "brand.blue" }}
			>
				<Subtitle>{children || folderName}</Subtitle>
			</AspectRatio>
		</Link>
	);
};
export default Folder;
