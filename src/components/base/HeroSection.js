import { Flex, Heading } from "@chakra-ui/react";

const HeroSection = ({ title, children }) => (
	<Flex
		as="section"
		className="section hero"
		justifyContent="center"
		alignItems="center"
		height="100vh"
	>
		{title && (
			<Heading fontSize="8vw" color="yellow">
				{title}
			</Heading>
		)}
		{children}
	</Flex>
);

export default HeroSection;
