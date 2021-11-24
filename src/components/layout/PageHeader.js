import { Box } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { Title } from "../base/Typography";
import { useVScrollPosition } from "../base/VScrollPositionProvider";
import SvgLogo from "../icons/SvgLogo";

/**
 * @type PageHeaderProps
 * @property {String} title The textual reading of the logo
 * @property {CSSProp} height (Must be known to animate the hiding)
 */
/**
 * Auto-hiding Page Header
 * @param {PageHeaderProps} props
 */
const PageHeader = ({ title = "", height = "3rem", ...props }) => {
	const [isVisible, setVisible] = useState(true);
	const { scrollY, direction } = useVScrollPosition();

	useEffect(() => {
		// Disappear when we scroll more than 40 px and re-appear when we scroll up
		setVisible(direction === "up" || scrollY < 40);
	});

	return (
		<Box
			id="page-header"
			as="header"
			position="fixed"
			height={height}
			top={isVisible ? 0 : `-${height}`}
			transition="top 0.5s ease-in-out"
			zIndex="999"
			right="0"
			left="0"
			p="1rem"
			{...props}
		>
			<Title id="header-logo">
				<SvgLogo alt={title} title={title} color="yellow" />
			</Title>
		</Box>
	);
};

export default PageHeader;
