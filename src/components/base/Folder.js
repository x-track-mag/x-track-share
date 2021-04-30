import { Link as NextLink } from "next/link";
import { Link, AspectRatio, Box, Heading } from "@chakra-ui/layout";

const Folder = ({ path }) => {
	const title = path.split("/").pop();
	return (
		<Link as={NextLink} to={path}>
			<AspectRatio
				w="100%"
				bg="brand.blue"
				color="brand.yellow"
				m="1rem"
				_hover={{ bg: "brand.yellow", color: "brand.blue" }}
			>
				<Heading as="h3" textTransform="uppercase" fontWeight={500}>
					{title}
				</Heading>
			</AspectRatio>
		</Link>
	);
};
export default Folder;
