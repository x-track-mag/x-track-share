import { Box, Flex } from "@chakra-ui/layout";
import { useEffect } from "react";
import { useEventBus } from "../EventBusProvider";
import { usePlayerState } from "./PlayerStateProvider";
import { Cloudinary } from "cloudinary-core";
import "cloudinary-video-player/dist/cld-video-player.light.min";
import "cloudinary-video-player/dist/cld-video-player.light.min.css";

/**
 * Instantiate a custom CloudinaryPlayer
 * @param {String} id
 * @param {Array<String>} playlist
 */
const createPlayer = (id, playlist) => {
	try {
		console.log(
			`Creating player for ${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`
		);
		const cloudinary = new Cloudinary({
			cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
			secure: true
		});
		const player = cloudinary.videoPlayer(id, {
			fluid: false,
			controls: true,
			bigPlayButton: true,
			showJumpControls: true,
			fontFace: "inherit",
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

		["play", "pause"].map((methodName) => {
			player[methodName] = player[methodName].bind(player);
		});

		if (playlist && playlist.length) {
			player.playlist(
				playlist.map((p) => p.url.replace(".wav", ".mp3")),
				{
					sourceTypes: ["hls"]
				}
			);
		}

		return player;
	} catch (err) {
		console.error(err);
	}
};

const registerPlayerEvents = (playerId, player, eb, merge) => {
	if (!player) return;
	eb.on(`${playerId}:play`, player.play);
	eb.on(`${playerId}:pause`, player.pause);
	eb.on(`${playerId}:changeTrack`, (selected) => {
		player.playlist().playAtIndex(selected);
	});
	// Now the player events inform us of the real state changes
	player.on("play", () => {
		merge({
			selectedIndex: player.playlist().currentIndex(),
			playing: true
		});
	});
	player.on("pause", () => {
		merge({
			selectedIndex: player.playlist().currentIndex(),
			playing: false
		});
	});
	player.on("sourcechanged", () => {
		merge({
			selectedIndex: player.playlist().currentIndex()
		});
	});
};
const unregisterPlayerEvents = (playerId, player, eb) => {
	if (!player) return;
	eb.off(`${playerId}:play`, player.play);
	eb.off(`${playerId}:pause`, player.pause);
	eb.off(`${playerId}:next`, player.playNext);
	eb.off(`${playerId}:previous`, player.playPrevious);
};

/**
 *
 * @param {VideoPlayerProps} props
 */
const VideoPlayer = ({ id, playlist }) => {
	let player; // the CloudinaryPlayer instance
	const { merge } = usePlayerState();
	let eb = useEventBus();

	// Instanciate the player
	useEffect(() => {
		console.log(`Creating video player ${id}`);
		player = createPlayer(id, playlist);
		registerPlayerEvents(id, player, eb, merge);

		return () => {
			console.log(`Unregistrating video player ${id}`);
			unregisterPlayerEvents(id, player, eb);
			player = null;
		};
	}, [id]);

	return (
		<Box
			className="video-container"
			width="100%"
			height="45vh"
			position="relative"
			overflow="hidden"
		>
			<video controls className="video-player" id={id} height="100%" width="100%" />
		</Box>
	);
};

export default VideoPlayer;
