import { ChakraProvider } from "@chakra-ui/react";

import PageLayout from "../components/layout/PageLayout.js";
import "../styles/x-track-theme.css";
import theme from "../theme.js";

function MyApp({ Component, pageProps }) {
	return (
		<ChakraProvider resetCSS theme={theme}>
			<PageLayout>
				<Component {...pageProps} />
			</PageLayout>
		</ChakraProvider>
	);
}

export default MyApp;
