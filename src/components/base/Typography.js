import { Heading, Text } from "@chakra-ui/react";

export const Title = ({ children, ...moreStyles }) => (
	<Heading as="h2" fontSize="2rem" lineHeight="2.2rem" fontWeight={500} {...moreStyles}>
		{children}
	</Heading>
);

export const Subtitle = ({ children, ...moreStyles }) => (
	<Heading as="h3" fontSize="1.6rem" lineHeight="2rem" fontWeight={500} {...moreStyles}>
		{children}
	</Heading>
);

export const ColumnHeader = ({ children, ...moreStyles }) => (
	<Heading
		as="h4"
		fontFamily="sans"
		fontSize="1.2rem"
		lineHeight="1rem"
		fontWeight={600}
		display="inline-block"
		{...moreStyles}
	>
		{children}
	</Heading>
);

export default {
	Title,
	Subtitle,
	ColumnHeader
};
