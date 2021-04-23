import { Flex, Heading } from "@chakra-ui/react";

const HeroSection = ({ title }) => (
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
	</Flex>
);

export default HeroSection;
