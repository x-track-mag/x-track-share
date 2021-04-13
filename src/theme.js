import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";
import { colors, fonts, breakpoints, global } from "./styles/x-track-theme.js";

const theme = extendTheme({
	colors,
	fonts,
	breakpoints: createBreakpoints(breakpoints),
	styles: { global }
});

export default theme;
