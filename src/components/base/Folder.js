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
				color="brand.yellow"
				style={{ cursor: "pointer" }}
				_hover={{ bg: "brand.yellow", color: "brand.blue" }}
			>
				<>
					<Subtitle>{children || folderName}</Subtitle>
					{icons.length > 0 && (
						<Box as="aside" className="icons-container" position="relative">
							<Box
								className="icons"
								position="absolute"
								bottom={1}
								right={2}
							>
								{icons.map((Icon, i) => (
									<Icon key={`icon-${i}`} pl={2} />
								))}
							</Box>
						</Box>
					)}
				</>
			</AspectRatio>
		</Link>
	);
};
export default Folder;
