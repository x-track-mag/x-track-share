import router from "next/router";
import { Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";
import clsx from "clsx";

const noOutline = {
	outline: "none",
	outlineStyle: "none"
};

/**
 * Style applied when link is inside plain text
 */
const textStyles = {
	textColor: "brand.green",
	textDecoration: "none",
	_focus: noOutline,
	_active: noOutline
};

const isExternalLink = (href) => /^http/.test(href);

const isActive = (href) => typeof window !== "undefined" && router.route === href;

/**
 * Use Next.js router to navigate to internal pages
 * or not..
 * @param {String} href
 */
export const navigate = (href) => (evt) => {
	if (!isExternalLink(href)) {
		evt.preventDefault();
		if (href === "back") {
			router.back();
		} else {
			router.push(href);
		}
	}
};

/**
 * Use Chakra-UI to style the link
 * And Next.js router to navigate...
 * @param {JSXElement} props
 * @param {String} props.href Absolute or relative URL to go by
 */
export const Link = ({ href = "#", children, ...props }) => (
	<ChakraLink
		href={href}
		target={isExternalLink(href) ? "_blank" : ""}
		onClick={navigate(href)}
		className={clsx({ active: isActive(href) })}
		{...props}
	>
		{children}
	</ChakraLink>
);

/**
 * Choose between a Virtual link providing your own navigate mthod
 * or the advanced Next.js Link
 * @param {Function} navigate
 * @returns Link<href,children>
 */
export const VLink = (navigate) => ({ children, href }) =>
	navigate ? (
		<a href={href} onClick={navigate(href)}>
			{children}
		</a>
	) : (
		<NextLink className="next-link" href={href} style={{ cursor: "pointer" }}>
			{children}
		</NextLink>
	);

/**
 * Build a link from specified style object
 * @param {Object} style
 * @return {Link}
 */
const makeLink = (style) => ({ children, ...props }) => (
	<Link {...style} {...props}>
		{children}
	</Link>
);

export const TextLink = makeLink(textStyles);
