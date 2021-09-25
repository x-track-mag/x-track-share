import { Button as ChakraUIButton } from "@chakra-ui/react";

const Button = ({ children, primary = true, ...props }) => (
	<ChakraUIButton
		bgColor={primary ? "blue" : "gray.500"}
		color="yellow"
		borderRadius={0}
		{...props}
	>
		{children}
	</ChakraUIButton>
);

export default Button;
