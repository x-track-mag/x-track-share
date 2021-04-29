import { Link, AspectRatio, Box, Heading } from "@chakra-ui/layout";

const Folder = ({ title, path }) => (
	<Link as={NextLink} ref={path}>
		<AspectRatio
			maxW={{ sm: "90vw", lg: "30vw", xl: "400rem" }}
			color="brand.blue"
			_hover="brand.yellow"
		>
			<Heading as="h3" color="brand.yellow">
				{title}
			</Heading>
		</AspectRatio>
	</Link>
);

export default Folder;
