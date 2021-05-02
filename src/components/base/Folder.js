import { useRouter } from "next/router";
import { AspectRatio, Heading } from "@chakra-ui/layout";
import { useShareContext } from "../CloudinaryExplorer.js";
import { Subtitle } from "./Typography.js";

const Folder = ({ path }) => {
	const title = path.split("/").pop();
	const { setCurrent } = useShareContext();
	const router = useRouter();

	const navigate = (path) => (evt) => {
		evt.preventDefault();
		setCurrent(path);
		router.push(`/share/${path}`, undefined, { shallow: true });
	};

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
