import { useState, createContext, useContext } from "react";
import PlaylistEntry from "./PlaylistEntry.js";

/**
 * @typedef PlayerState
 * @property {Array} playlist
 * @property {Number} selected
 * @property {Boolean} playing
 * @property {Function} setPlayerState
 */

const PlayerContext = createContext();

const PlayerStateProvider = ({ playerId, playlist, children }) => {
	const [playerState, setPlayerState] = useState({
		playlist,
		selected: 0,
		playing: false // play/pause
	});

	return (
		<PlayerContext.Provider value={{ setPlayerState, ...playerState }}>
			{children}
		</PlayerContext.Provider>
	);
};

export default PlayerStateProvider;

/**
 * Make en PlayerState accessible inside this component
 * with the usePlayerState() hook
 * @param {JSX.Element} Component
 */
export const withPlayerState = (Component) => (props) => {
	return (
		<PlayerStateProvider {...props}>
			<Component {...props} />
		</PlayerStateProvider>
	);
};

/**
 * usePlayerState() Hook
 * @return {PlayerState}
 */
export const usePlayerState = () => {
	const ps = useContext(PlayerContext);
	if (!ps) {
		throw new ReferenceError(`usePlayerState() called without a PlayerStateProvider`);
	}
	return ps;
};

export const Playlist = ({ playerId, playlist }) => {
	const { selected } = usePlayerState();
	return (
		<Box as="ol" className="playlist-container">
			{playlist.map((entry, i) => (
				<PlaylistEntry
					index={i}
					playerId={playerId}
					selected={i === selected}
					{...entry}
				/>
			))}
		</Box>
	);
};
