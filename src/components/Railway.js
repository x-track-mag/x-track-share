import { Box, Heading } from "@chakra-ui/layout";
import { extractPaths } from "../lib/utils/Folders";
import { Link } from "./base/Link";

const Railway = ({ path }) => {
	const { leaf, parents } = extractPaths(path);
	// Render the links to the parent forldes
	return (
		<Box className="railway">
			{parents.map((path) => (
				<Heading key={path} display="inline-block">
					<Link href={`/share/${path}`}>{path.split("/").pop()}</Link>
					&nbsp;&#x2F;&nbsp;
				</Heading>
			))}
			<Heading display="inline-block" key={leaf}>
				{leaf}
			</Heading>
		</Box>
	);
};

export default Railway;
