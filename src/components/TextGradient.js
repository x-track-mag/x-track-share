import { Heading } from "@chakra-ui/layout";

const TextGradient = ({
	from = "cyan",
	to = "magenta",
	direction = "45deg",
	children,
	...moreProps
}) => (
	<Heading
		bgGradient={`linear(${direction},${from},${to})`}
		bgClip="text"
		{...moreProps}
	>
		{children}
	</Heading>
);

export default TextGradient;
