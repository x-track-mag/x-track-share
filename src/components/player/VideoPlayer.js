import { AspectRatio } from "@chakra-ui/layout";
import { useEffect } from "react";
import { useEventBus } from "../EventBusProvider";
import { usePlayerState } from "./PlayerStateProvider";
import { Cloudinary } from "cloudinary-core";
import "cloudinary-video-player/dist/cld-video-player.light.min";
import "cloudinary-video-player/dist/cld-video-player.light.min.css";

const createPlayer = (id, playlist) => {
	const cloudinary = new Cloudinary({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		secure: true
	});
	const player = cloudinary.videoPlayer(id, {
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

	if (playlist && playlist.length) {
		player.source(playlist([0].url), {
			sourceTypes: ["hls"]
		});
	}

	return player;
};

const VideoPlayer = ({ id }) => {
	let player; // the CloudinaryPlayer instance
	const { playlist, selected } = usePlayerState();
	let eb = useEventBus();

	// Load the source
	useEffect(() => {
		player = createPlayer(id, playlist);

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
