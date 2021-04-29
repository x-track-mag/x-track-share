import { Link as NextLink } from "next/link";
import { Link, AspectRatio, Box, Heading } from "@chakra-ui/layout";

const Folder = ({ title, path }) => (
	<Link as={NextLink} ref={path}>
		<AspectRatio w="100%" bg="brand.blue" m="1rem" _hover="brand.yellow">
			<Heading
				as="h3"
				color="brand.yellow"
				textTransform="uppercase"
				fontWeight={500}
			>
				{title}
			</Heading>
		</AspectRatio>
	</Link>
);

export default Folder;
