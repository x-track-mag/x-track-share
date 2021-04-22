import Image from "next/image";
import { Box } from "@chakra-ui/react";

/**
 *
 * @param {JSXElement} props
 */
const BackgroundImageContainer = ({ image, width = "100%", height = "100%" }) => {
	if (!image) return null;

	// Calculate the width and height and position to fill the container
	return (
		<Box
			className="background-image-container"
			width={width}
			height={height}
			position="absolute"
			zIndex="-1"
			overflow="hidden"
		>
			<Image
				className="background-image"
				src={image.url}
				alt={image.alt}
				objectFit="cover"
				layout="fill"
			/>
		</Box>
	);
};

export default BackgroundImageContainer;
