import { Box } from "@chakra-ui/react";

const Main = ({ children }) => (
	<Box as="main" bg="blue" minHeight="100vh">
		{children}
	</Box>
);

export default Main;
