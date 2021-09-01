import dynamic from "next/dynamic";
import { AspectRatio, Center, Image } from "@chakra-ui/react";
import { useState } from "react";
import { useEventBus } from "../EventBusProvider";

// AudioPlayer and VideoPlayer must only be instanciated on client side
const VideoPlayer = dynamic(() => import("./VideoPlayer.js"), { ssr: false });
const AudioPlayer = dynamic(() => import("./AudioPlayer.js"), { ssr: false });

const decode = (format) => {
	return "video";
};

const AutoPlay = ({ url, format }) => {
	switch (decode(format)) {
		case "video":
			return <VideoPlayer id="mini-player" />;
		case "audio":
			return <AudioPlayer />;
		case "image":
			return <Image src={`${public_id}.${format}`} />;

		default:
			break;
	}
};

const MiniPlayer = () => {
	const [currentTrack, setCurrentTrack] = useState();
	const eb = useEventBus();

	eb.on("play:track", setCurrentTrack);
	eb.on("pause:track", () => setCurrentTrack(null));

	return (
		<Center className="mini-player">
			<h3>PLAYER</h3>
			{currentTrack && (
				<AspectRatio ratio={4 / 3}>
					<AutoPlay track={currentTrack} />
				</AspectRatio>
			)}
		</Center>
	);
};

export default MiniPlayer;
