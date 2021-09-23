import { ChakraProvider } from "@chakra-ui/react";
import FirebaseAuthProvider from "../components/auth/FirebaseAuthProvider.js";
import { DialogContextProvider } from "../components/base/Dialog.js";
import EventBusProvider from "../components/EventBusProvider.js";
import PageLayout from "../components/layout/PageLayout.js";
import extendArrays from "../lib/utils/Arrays.js";
import { exitOnRejections } from "../lib/utils/Promises.js";
import extendStrings from "../lib/utils/Strings";
import "../styles/x-track-theme.css";
import theme from "../theme.js";

function MyApp({ Component, pageProps }) {
	// Do some global tweakings
	extendStrings();
	extendArrays();
	exitOnRejections();

	return (
		<FirebaseAuthProvider>
			<ChakraProvider resetCSS theme={theme}>
				<PageLayout>
					<EventBusProvider>
						<DialogContextProvider>
							<Component {...pageProps} />
						</DialogContextProvider>
					</EventBusProvider>
				</PageLayout>
			</ChakraProvider>
		</FirebaseAuthProvider>
	);
}

export default MyApp;
