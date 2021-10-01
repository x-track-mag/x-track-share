import { Box, Heading } from "@chakra-ui/react";

export const Title = ({ children, ...moreStyles }) => (
	<Heading as="h2" fontSize="2rem" lineHeight="2.2rem" fontWeight={500} {...moreStyles}>
		{children}
	</Heading>
);

export const Subtitle = ({ children, ...moreStyles }) => (
	<Heading as="h3" fontSize="1.7rem" lineHeight="2rem" fontWeight={500} {...moreStyles}>
		{children}
	</Heading>
);

export const ColumnHeader = ({ children, ...moreStyles }) => (
	<Heading
		as="h4"
		fontSize="1.4rem"
		lineHeight="1rem"
		fontWeight={600}
		color="white"
		display="inline-block"
		{...moreStyles}
	>
		{children}
	</Heading>
);

export const Info = ({ children }) => (
	<Box as="p" className="info" lineHeight="1rem" fontSize="sm" color="white" mb="1rem">
		{children}
	</Box>
);

export default {
	Title,
	Subtitle,
	ColumnHeader,
	Info
};
