import { ChakraProvider } from "@chakra-ui/react";
import { DialogContextProvider } from "../components/base/Dialog.js";

import PageLayout from "../components/layout/PageLayout.js";
import "../styles/x-track-theme.css";
import theme from "../theme.js";

function MyApp({ Component, pageProps }) {
	return (
		<ChakraProvider resetCSS theme={theme}>
			<PageLayout>
				<DialogContextProvider>
					<Component {...pageProps} />
				</DialogContextProvider>
			</PageLayout>
		</ChakraProvider>
	);
}

export default MyApp;
