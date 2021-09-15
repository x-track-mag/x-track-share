import { ChakraProvider } from "@chakra-ui/react";
import { DialogContextProvider } from "../components/base/Dialog.js";
import EventBusProvider from "../components/EventBusProvider.js";

import PageLayout from "../components/layout/PageLayout.js";
import "../styles/x-track-theme.css";
import theme from "../theme.js";
import safePromises from "make-promises-safe";

function MyApp({ Component, pageProps }) {
	return (
		<ChakraProvider resetCSS theme={theme}>
			<PageLayout>
				<EventBusProvider>
					<DialogContextProvider>
						<Component {...pageProps} />
					</DialogContextProvider>
				</EventBusProvider>
			</PageLayout>
		</ChakraProvider>
	);
}

export default MyApp;
