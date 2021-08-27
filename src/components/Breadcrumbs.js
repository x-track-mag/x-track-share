import { Box, Heading } from "@chakra-ui/layout";
import { makeBreadcrumbs } from "../lib/utils/Folders";
import { VLink } from "./base/Link";

/**
 * @typedef BreadcrumbsProps
 * @property {String} path the full path ('/' separated) to our current location
 * @property {String} [root=""] an optional root folder to all links
 * @property {Function} [navigate] optional alternative navigation method
 * @property {String} children Things to append to the breadcrumbs
 * @property {Boolean} [linkLeaf=false] Make the leaf itself a navigation link
 */

/**
 * Displays the list of links to the parents to this folder location :
 * <grand-parent> / <parent> / location
 * @param {BreadcrumbsProps} props
 */
const Breadcrumbs = ({ path, root = "", navigate, children, linkLeaf = false }) => {
	const Link = VLink(navigate);
	const { leaf, parents } = makeBreadcrumbs(path, linkLeaf);
	return (
		<Box className="breadcrumbs" float="left">
			{children && (
				<Heading display="inline-block" key="intro">
					{children}
				</Heading>
			)}
			{parents.map((path) => (
				<Heading key={path} display="inline-block">
					<Link href={`${root}/${path}`}>{path.split("/").pop()}</Link>
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
