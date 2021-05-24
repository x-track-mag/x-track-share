import { AspectRatio } from "@chakra-ui/layout";
import { useShareContext } from "../ShareContextProvider.js";
import { Subtitle } from "./Typography.js";

const Folder = ({ path }) => {
	const title = path.split("/").pop();
	const { navigate } = useShareContext();

	return (
		<a href={path} onClick={navigate(path)}>
			<AspectRatio
				w="100%"
				bg="brand.blue"
				color="brand.yellow"
				_hover={{ bg: "brand.yellow", color: "brand.blue" }}
			>
				<Subtitle>{title}</Subtitle>
			</AspectRatio>
		</a>
	);
};
export default Folder;
