import { AspectRatio } from "@chakra-ui/layout";
import { Box } from "@chakra-ui/react";
import { VLink } from "./Link.js";
import { Subtitle } from "./Typography.js";

const Folder = ({ path, children, navigate, icons = [] }) => {
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
				<Subtitle>
					{children || folderName}
					{icons.length > 0 && (
						<Box key="icons" position="absolute" bottom={1} right={2}>
							{icons}
						</Box>
					)}
				</Subtitle>
			</AspectRatio>
		</Link>
	);
};
export default Folder;
