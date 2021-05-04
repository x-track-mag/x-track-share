// .storybook/preview.js
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" }
};

const withThemeProvider = (Story, context) => {
	return (
		<ChakraProvider resetCSS>
			<Story {...context} />
		</ChakraProvider>
	);
};

export const decorators = [withThemeProvider];
