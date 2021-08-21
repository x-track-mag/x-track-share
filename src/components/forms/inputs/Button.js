import { Button as ChakraUIButton } from "@chakra-ui/react";

const Button = ({ children, ...props }) => (
	<ChakraUIButton bgColor="blue" color="yellow" borderRadius={0} {...props}>
		{children}
	</ChakraUIButton>
);

export default Button;
