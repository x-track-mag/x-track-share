import { Box } from "@chakra-ui/react";

const Main = ({ children, ...props }) => (
	<Box as="main" pt="3rem" w="100%" h="100vh" position="relative" {...props}>
		{children}
	</Box>
);

export default Main;
