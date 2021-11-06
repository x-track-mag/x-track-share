import { Box } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { Title } from "../base/Typography";
import { useVScrollPosition } from "../base/VScrollPositionProvider";
import SvgLogo from "../icons/SvgLogo";

/**
 * @type PageHeaderProps
 * @property {String} title The textual reading of the logo
 * @property {CSSProp} height (Must be known to animate the hiding)
 * @property {Array} navigation
 */
/**
 * Auto-hiding page header
 * @param {PageHeaderProps} props
 */
const PageHeader = ({ title = "", navigation = [], height = "3rem", ...props }) => {
	const [visible, setVisible] = useState(true);
	const { scrollY, direction } = useVScrollPosition();

	useEffect(() => {
		setVisible(direction === "up" || scrollY < 40);
	});

	return (
		<Box
			as="header"
			id="page-header"
			position="fixed"
			height={height}
			top={visible ? 0 : `-${height}`}
			transition="top 0.5s ease-in-out"
			zIndex="999"
			right="0"
			left="0"
			{...props}
			p="1rem"
		>
			<Title id="header-logo">
				<SvgLogo alt={title} title={title} color="yellow" />
			</Title>
		</Box>
	);
};

export default PageHeader;
