import Head from "next/head";
import Main from "../base/Main.js";
import { withScreenSize } from "../base/ScreenSizeProvider.js";
import { withVScrollPosition } from "../base/VScrollPositionProvider.js";
import PageHeader from "./PageHeader.js";

const PageLayout = ({ children }) => (
	<>
		<Head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			<title>X-TRACK SHARE</title>
			{/* <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
			<link rel="manifest" href="/site.webmanifest" />
			<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" /> */}
			<meta name="msapplication-TileColor" content="#FF0" />
			<meta name="theme-color" content="#00F" />
		</Head>
		<PageHeader height="3rem" bg="brand.blue" />
		<Main bg="black">{children}</Main>
	</>
);

export default withScreenSize(withVScrollPosition(PageLayout));
