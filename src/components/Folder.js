import { Link } from "@chakra-ui/layout";
import { Heading } from "@chakra-ui/layout";
import { Box } from "@chakra-ui/layout";

const Folder = ({ title, path }) => (
	<Link as={NextLink} ref={path}>
		<Box color="brand.blue" _hover={}>
			<Heading as="h3" color="brand.yellow">
				{title}
			</Heading>
		</Box>
	</Link>
);

export default Folder;
