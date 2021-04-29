import { AspectRatio } from "@chakra-ui/layout";
import { useEffect } from "react";

const createPlayer = (id, src) => {
	const player = cld.videoPlayer(id, {
		fluid: true,
		controls: true,
		showJumpControls: true,
		fontFace: "Audiowide",
		colors: {
			accent: "#0000ff",
			text: "#ffff00"
		},
		logoOnclickUrl: "https://x-track.net",
		logoImageUrl:
			"https://res.cloudinary.com/x-track/image/fetch/h_25/https://x-track.net/img/x-track-logo.png",
		floatingWhenNotVisible: "right",
		posterOptions: {
			transformation: {
				startOffset: "0"
			}
		}
	});

	player.source(src, {
		sourceTypes: ["hls"]
	});

	return player;
};

const VideoPlayer = ({ id, src }) => {
	let player; // the CloudinaryPlayer instance
	let eb = useEventBus();

	// Load the source
	useEffect(() => {
		player = createPlayer(id, src);

		return () => {
			player = null;
		};
	}, [id]);

	return (
		<AspectRatio className="video-container" ratio={4 / 3} height="100%">
			<video controls className="video-player" id={id} width="100%" height="100%" />
		</AspectRatio>
	);
};

export default VideoPlayer;
