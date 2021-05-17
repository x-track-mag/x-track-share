import { Box } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { Title } from "../base/Typography";
import { useVScrollPosition } from "../base/VScrollPositionProvider";

/**
 * Auto-hiding page header
 * @param {*} param0
 * @returns
 */
const PageHeader = ({ logo, navigation = [], height = "3rem", ...props }) => {
	const [visible, setVisible] = useState(true);
	const { scrollY, direction } = useVScrollPosition();

	useEffect(() => {
		setVisible(scrollY < 80 || direction === "up");
	});

	return (
		<Box
			{...props}
			className="page_header"
			height={height}
			top={visible ? 0 : `-${height}`}
			position="fixed"
			left="0"
			right="0"
			zIndex="999"
			p="1rem"
		>
			<Title id="header-logo">X-TRACK SHARE</Title>
		</Box>
	);
};

export default PageHeader;
