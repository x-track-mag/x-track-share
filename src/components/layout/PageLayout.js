import { Box } from "@chakra-ui/layout";
import { withVScrollPosition } from "../base/VScrollPositionProvider.js";

import PageHeader from "./PageHeader.js";

const PageLayout = ({ children }) => (
	<>
		<PageHeader height="3rem" bg="brand.blue" />
		<Box as="main" pt="3rem">
			{children}
		</Box>
	</>
);

export default withVScrollPosition(PageLayout);
