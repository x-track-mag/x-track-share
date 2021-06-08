// .storybook/preview.js
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import theme from "../src/theme.js";

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" }
};

const withThemeProvider = (Story, context) => {
	return (
		<ChakraProvider resetCSS theme={theme}>
			<Story {...context} />
		</ChakraProvider>
	);
};

export const decorators = [withThemeProvider];
