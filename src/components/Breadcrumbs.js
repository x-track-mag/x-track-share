import { Box, Heading } from "@chakra-ui/layout";
import { extractPaths } from "../lib/utils/Folders";
import { useShareContext } from "./ShareContextProvider";

/**
 * @typedef BreadcrumbsProps
 * @param {String} path the '/' separated path to our current location
 */

/**
 * Displays the list of links to the parents to this folder location :
 * <grand-parent> / <parent> / location
 * @param {BreadcrumbsProps} props
 */
const Breadcrumbs = ({ path }) => {
	const { navigate } = useShareContext();
	const { leaf, parents } = extractPaths(path);
	// Render the links to the parent folders
	return (
		<Box className="breadcrumbs">
			{parents.map((path) => (
				<Heading key={path} display="inline-block">
					<a href={`/share/${path}`} onClick={navigate(path)}>
						{path.split("/").pop()}
					</a>
					&nbsp;&#x2F;&nbsp;
				</Heading>
			))}
			<Heading display="inline-block" key={leaf}>
				{leaf}
			</Heading>
		</Box>
	);
};

export default Breadcrumbs;
