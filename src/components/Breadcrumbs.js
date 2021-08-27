import { Box, Heading } from "@chakra-ui/layout";
import { extractPaths } from "../lib/utils/Folders";
import { VLink } from "./base/Link";

/**
 * @typedef BreadcrumbsProps
 * @param {String} path the '/' separated path to our current location
 */

/**
 * Displays the list of links to the parents to this folder location :
 * <grand-parent> / <parent> / location
 * @param {BreadcrumbsProps} props
 */
const Breadcrumbs = ({
	path,
	prefix = "/share",
	navigate,
	children,
	linkLeaf = false
}) => {
	const { leaf, parents } = extractPaths(path, linkLeaf);
	const Link = VLink(navigate);
	// Render the links to the parent folders
	return (
		<Box className="breadcrumbs" float="left">
			{children && (
				<Heading display="inline-block" key="intro">
					{children}
				</Heading>
			)}
			{parents.map((path) => (
				<Heading key={path} display="inline-block">
					<Link href={`${prefix}/${path}`}>{path.split("/").pop()}</Link>
					&nbsp;&#x2F;&nbsp;
				</Heading>
			))}
			{!linkLeaf && (
				<Heading display="inline-block" key={leaf}>
					{leaf}
				</Heading>
			)}
		</Box>
	);
};

export default Breadcrumbs;
