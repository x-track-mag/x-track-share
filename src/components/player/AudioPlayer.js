import { Box } from "@chakra-ui/layout";
import { useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import { useEventBus } from "../EventBusProvider";
import { usePlayerState } from "./PlayerStateProvider";

/**
 * Instantiate a custom CloudinaryPlayer
 * @param {String} id
 * @param {Array<String>} playlist
 */
const createPlayer = (id, playlist, selectedIndex, merge) => {
	try {
		const player = (window.player = WaveSurfer.create({
			container: `#${id}`,
			backgroundColor: "black",
			waveColor: "blue",
			progressColor: "yellow",
			normalize: true,
			hideScrollbar: true,
			height: 256,
			barWidth: 2,
			barGap: 1,
			scrollParent: true,
			autoCenterImmediately: true,
			autoCenterRate: 10
		}));

		["play", "pause", "load"].map((methodName) => {
			player[methodName] = player[methodName].bind(player);
		});

		// Redefine the load method so that it return a Promise
		const load = player.load;
		player.load = async (src, selectedIndex) => {
			player.track = src;
			player.selectedIndex = selectedIndex;
			return new Promise((resolve, reject) => {
				const loaded = () => {
					resolve(src);
					player.un("ready", loaded);
				};
				player.on("ready", loaded);
				player.cancelAjax();
				load(src);
			});
		};

		const loadTrack = async (i, autoPlay) => {
			const track = playlist[i].url.replace("wav", "mp3");
			if (player.track === track) return;

			merge({ selectedIndex: i });
			await player.load(track, i);
			if (autoPlay) {
				player.play();
			}
		};

		player.playNext = () => {
			selectedIndex++;
			if (selectedIndex === playlist.length) {
				selectedIndex = 0;
			}
			loadTrack(selectedIndex, true);
		};
		player.playPrevious = () => {
			selectedIndex--;
			if (selectedIndex < 0) {
				selectedIndex = playlist.length - 1;
			}
			loadTrack(selectedIndex, true);
		};
		player.changeTrack = (i) => {
			loadTrack((selectedIndex = i), true);
		};

		loadTrack(selectedIndex);

		return player;
	} catch (err) {
		console.error(err);
	}
};

const registerPlayerEvents = (playerId, player, eb, merge) => {
	if (!player) return;
	eb.on(`${playerId}:play`, player.play);
	eb.on(`${playerId}:pause`, player.pause);
	eb.on(`${playerId}:next`, player.playNext);
	eb.on(`${playerId}:previous`, player.playPrevious);
	eb.on(`${playerId}:changeTrack`, player.changeTrack);

	// Now the player events inform us of the real state changes
	player.on("play", () => {
		merge({
			selectedIndex: player.selectedIndex,
			playing: true
		});
	});
	player.on("pause", () => {
		merge({
			selectedIndex: player.selectedIndex,
			playing: false
		});
	});
};
const unregisterPlayerEvents = (playerId, player, eb) => {
	if (!player) return;
	eb.off(`${playerId}:play`, player.play);
	eb.off(`${playerId}:pause`, player.pause);
	eb.off(`${playerId}:next`, player.playNext);
	eb.off(`${playerId}:previous`, player.playPrevious);
	eb.off(`${playerId}:changeTrack`, player.changeTrack);
	player.unAll();
	player.destroy();
};

/**
 *
 * @param {VideoPlayerProps} props
 */
const AudioPlayer = ({ id, playlist }) => {
	let player; // the CloudinaryPlayer instance
	const { selectedIndex, playing, merge } = usePlayerState();
	let eb = useEventBus();

	// Instanciate the player
	useEffect(() => {
		console.log(`Creating audio player ${id}`);
		player = createPlayer(id, playlist, selectedIndex, merge);
		registerPlayerEvents(id, player, eb, merge);

		return () => {
			console.log(`Unregistrating audio player ${id}`);
			unregisterPlayerEvents(id, player, eb);
			player = null;
		};
	}, [id]);

	return (
		<Box
			id={id}
			className="audio-container"
			width="100%"
			height="256px"
			margin="0 2rem"
			position="relative"
			sx={{ position: "-webkit-sticky", /* Safari */ position: "sticky", top: "0" }}
			overflow="hidden"
			zIndex={100}
		/>
	);
};

export default AudioPlayer;
